'use client';

import React, { useState } from 'react';
import { INITIAL_SUBMISSIONS, AdminSubmission } from '@/lib/data/admin-state';
import { SubmissionStatus, ReviewDecision } from '@prisma/client';
import {
  CheckSquare,
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

export default function SubmissionsModerationPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(INITIAL_SUBMISSIONS);
  const [filter, setFilter] = useState<string>('ALL');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filtered = submissions.filter((sub) => {
    if (filter === 'ALL') return true;
    return sub.status === filter;
  });

  const handleReviewAction = (
    id: string,
    decision: ReviewDecision
  ) => {
    let newStatus: SubmissionStatus = SubmissionStatus.PENDING;
    let noticeText = '';

    if (decision === ReviewDecision.APPROVED) {
      newStatus = SubmissionStatus.APPROVED;
      noticeText = 'Submission APPROVED and queued for publication.';
    } else if (decision === ReviewDecision.REQUEST_CHANGES) {
      newStatus = SubmissionStatus.CHANGES_REQUESTED;
      noticeText = 'Requested revisions from contributor.';
    } else if (decision === ReviewDecision.REJECTED) {
      newStatus = SubmissionStatus.REJECTED;
      noticeText = 'Submission REJECTED with feedback.';
    }

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: newStatus,
              reviewedAt: new Date(),
              reviewerName: 'Knowra Editorial Board',
              reviewDecision: decision,
              feedback: feedback || undefined,
            }
          : s
      )
    );

    setActiveReviewId(null);
    setFeedback('');
    setActionNotice(noticeText);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="max-w-5xl space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Peer Submission Moderation Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review community knowledge entries and audit primary source references before publication
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border text-xs">
          {['ALL', 'PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === st
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-6">
        {filtered.map((sub) => {
          const isReviewing = activeReviewId === sub.id;

          return (
            <div
              key={sub.id}
              id={sub.id}
              className={`p-6 rounded-2xl bg-card border transition-all ${
                sub.status === 'PENDING'
                  ? 'border-amber-500/30 shadow-sm'
                  : 'border-border'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase px-2.5 py-0.5 rounded bg-secondary text-secondary-foreground font-bold">
                    {sub.language.toUpperCase()}
                  </span>
                  
                  {sub.status === 'PENDING' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                      Pending Review
                    </span>
                  )}
                  {sub.status === 'APPROVED' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Approved for Publication
                    </span>
                  )}
                  {sub.status === 'CHANGES_REQUESTED' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                      Changes Requested
                    </span>
                  )}
                  {sub.status === 'REJECTED' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold border border-destructive/20">
                      Rejected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{sub.contributorName} {sub.contributorEmail ? `(${sub.contributorEmail})` : ''}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Title & Content */}
              <h3 className="text-xl font-serif font-bold text-foreground mb-3 leading-snug">
                {sub.title}
              </h3>

              <div className="p-4 rounded-xl bg-background border border-border text-sm text-foreground/90 whitespace-pre-wrap font-sans mb-4 max-h-64 overflow-y-auto">
                {sub.content}
              </div>

              {/* Proposed Sources Citation Audit (Strict PRD 5.3) */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-4 space-y-1 text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Proposed Primary Citations & Verifiable Sources:</span>
                </span>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {sub.proposedSources}
                </p>
              </div>

              {/* Feedback History if already reviewed */}
              {sub.feedback && (
                <div className="p-3.5 rounded-xl bg-secondary/80 border border-border text-xs mb-4">
                  <span className="font-semibold text-foreground">Reviewer Feedback: </span>
                  <span className="text-muted-foreground italic">"{sub.feedback}"</span>
                  <p className="text-[10px] text-muted-foreground mt-1">Reviewed by: {sub.reviewerName}</p>
                </div>
              )}

              {/* Action Drawer when clicking Review */}
              {isReviewing ? (
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Reviewer Feedback / Revision Guidance (Sent to Contributor):
                    </label>
                    <textarea
                      rows={2}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Specify required citation improvements, formatting guidelines, or factual verifications..."
                      className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setActiveReviewId(null)}
                      className="px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 border border-border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReviewAction(sub.id, ReviewDecision.REJECTED)}
                      className="px-3.5 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold border border-destructive/20 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleReviewAction(sub.id, ReviewDecision.REQUEST_CHANGES)}
                      className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>
                    <button
                      onClick={() => handleReviewAction(sub.id, ReviewDecision.APPROVED)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial Review Trigger Button */
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">ID: {sub.id}</span>
                  <button
                    onClick={() => {
                      setActiveReviewId(sub.id);
                      setFeedback(sub.feedback || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold border border-border transition-colors flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-accent" />
                    <span>Moderate Submission</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
