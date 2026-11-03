import { prisma } from '@/lib/db';
import { SubmissionCreateInput, ReviewCreateInput } from '@/lib/validations';
import { SubmissionStatus, ReviewDecision } from '@prisma/client';

export class SubmissionService {
  /**
   * Accepts a community knowledge submission.
   */
  static async submit(input: SubmissionCreateInput) {
    return prisma.submission.create({
      data: {
        title: input.title,
        content: input.content,
        language: input.language,
        proposedSources: input.proposedSources,
        contributorName: input.contributorName,
        contributorEmail: input.contributorEmail ?? null,
        status: SubmissionStatus.PENDING,
      },
    });
  }

  /**
   * Reviews a submission, recording the reviewer's decision and updating submission status.
   */
  static async review(input: ReviewCreateInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the review record
      const review = await tx.review.create({
        data: {
          submissionId: input.submissionId,
          reviewerId: input.reviewerId,
          decision: input.decision,
          feedback: input.feedback ?? null,
        },
      });

      // 2. Map review decision to submission status
      let newStatus: SubmissionStatus = SubmissionStatus.PENDING;
      if (input.decision === ReviewDecision.APPROVED) {
        newStatus = SubmissionStatus.APPROVED;
      } else if (input.decision === ReviewDecision.REJECTED) {
        newStatus = SubmissionStatus.REJECTED;
      } else if (input.decision === ReviewDecision.REQUEST_CHANGES) {
        newStatus = SubmissionStatus.CHANGES_REQUESTED;
      }

      // 3. Update the submission
      await tx.submission.update({
        where: { id: input.submissionId },
        data: { status: newStatus },
      });

      return review;
    });
  }

  /**
   * Lists pending or filtered submissions for admin/moderator dashboard.
   */
  static async list(params?: {
    status?: SubmissionStatus;
    language?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params?.status) where.status = params.status;
    if (params?.language) where.language = params.language;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          reviews: {
            include: {
              reviewer: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return {
      submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves a single submission by ID.
   */
  static async getById(id: string) {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });
  }
}
