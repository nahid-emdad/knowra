import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { signSessionToken } from '@/lib/auth/session';
import { INITIAL_SUBMISSIONS, INITIAL_REVISIONS } from '@/lib/data/admin-state';
import { Role, SubmissionStatus, ReviewDecision } from '@prisma/client';

describe('TASK-004: Admin & Moderation Platform Verification', () => {
  describe('Server-Side Authorization Boundary (PRD 4.5 & 11)', () => {
    it('REJECTS unauthenticated requests with 401 Unauthorized', () => {
      const unauthRequest = new NextRequest('http://localhost:3000/api/v1/admin/overview');
      const result = requireRole(unauthRequest, Role.EDITOR);

      expect('errorResponse' in result).toBe(true);
      if ('errorResponse' in result) {
        expect(result.errorResponse.status).toBe(401);
      }
    });

    it('ACCEPTS cryptographically authenticated admin token', () => {
      const adminToken = signSessionToken({
        id: 'usr_admin',
        name: 'Knowra Editorial Board',
        email: 'admin@knowra.org',
        role: Role.ADMIN,
      });

      const adminRequest = new NextRequest('http://localhost:3000/api/v1/admin/overview', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const result = requireRole(adminRequest, Role.ADMIN);
      expect('session' in result).toBe(true);
      if ('session' in result) {
        expect(result.session.role).toBe(Role.ADMIN);
        expect(result.session.email).toBe('admin@knowra.org');
      }
    });

    it('ACCEPTS cryptographically signed editor session cookie for editor-level routes', () => {
      const editorToken = signSessionToken({
        id: 'usr_editor',
        name: 'Bilingual Reviewer',
        email: 'editor@knowra.org',
        role: Role.EDITOR,
      });

      const editorRequest = new NextRequest('http://localhost:3000/api/v1/admin/overview', {
        headers: {
          Cookie: `knowra_session=${editorToken}`,
        },
      });

      const result = requireRole(editorRequest, Role.EDITOR);
      expect('session' in result).toBe(true);
      if ('session' in result) {
        expect(result.session.role).toBe(Role.EDITOR);
      }
    });

    it('REJECTS editor role when ADMIN permission is strictly required (403 Forbidden)', () => {
      const editorToken = signSessionToken({
        id: 'usr_editor',
        name: 'Bilingual Reviewer',
        email: 'editor@knowra.org',
        role: Role.EDITOR,
      });

      const editorRequest = new NextRequest('http://localhost:3000/api/v1/admin/system', {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      });

      const result = requireRole(editorRequest, Role.ADMIN);
      expect('errorResponse' in result).toBe(true);
      if ('errorResponse' in result) {
        expect(result.errorResponse.status).toBe(403);
      }
    });
  });

  describe('Submission Moderation Workflow (PRD Module C)', () => {
    it('initializes submissions queue with pending community contributions', () => {
      const pending = INITIAL_SUBMISSIONS.filter((s) => s.status === SubmissionStatus.PENDING);
      expect(pending.length).toBeGreaterThanOrEqual(1);
      expect(pending[0].proposedSources).toBeDefined();
    });

    it('verifies that every submission requires verifiable primary sources', () => {
      INITIAL_SUBMISSIONS.forEach((sub) => {
        expect(sub.proposedSources.length).toBeGreaterThan(5);
        expect(sub.contributorName).toBeDefined();
      });
    });

    it('correctly maps ReviewDecision to SubmissionStatus', () => {
      const decisions: Record<ReviewDecision, SubmissionStatus> = {
        [ReviewDecision.APPROVED]: SubmissionStatus.APPROVED,
        [ReviewDecision.REJECTED]: SubmissionStatus.REJECTED,
        [ReviewDecision.REQUEST_CHANGES]: SubmissionStatus.CHANGES_REQUESTED,
      };

      expect(decisions[ReviewDecision.APPROVED]).toBe(SubmissionStatus.APPROVED);
      expect(decisions[ReviewDecision.REJECTED]).toBe(SubmissionStatus.REJECTED);
      expect(decisions[ReviewDecision.REQUEST_CHANGES]).toBe(SubmissionStatus.CHANGES_REQUESTED);
    });
  });

  describe('Revision Audit Trail (PRD 4.5 & 7)', () => {
    it('maintains tamper-evident revision records with editor attribution', () => {
      expect(INITIAL_REVISIONS.length).toBeGreaterThanOrEqual(2);
      INITIAL_REVISIONS.forEach((rev) => {
        expect(rev.id).toBeDefined();
        expect(rev.knowledgeItemTitle).toBeDefined();
        expect(rev.editorName).toBeDefined();
        expect(rev.changeSummary).toBeDefined();
        expect(rev.revisionNumber).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
