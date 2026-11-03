import { prisma } from '@/lib/db';
import { TranslationCreateInput, TranslationUpdateInput } from '@/lib/validations';
import { VerificationStatus } from '@prisma/client';

export class TranslationService {
  /**
   * Creates a translation record linking a translated KnowledgeItem to an original KnowledgeItem.
   * Strictly enforces independent review status (defaults to DRAFT, never inherits reviewed status).
   */
  static async create(input: TranslationCreateInput) {
    // Verify that the original item exists
    const original = await prisma.knowledgeItem.findUnique({
      where: { id: input.originalItemId },
    });

    if (!original) {
      throw new Error(`Original knowledge item with ID ${input.originalItemId} does not exist.`);
    }

    // Verify knowledge item exists
    const item = await prisma.knowledgeItem.findUnique({
      where: { id: input.knowledgeItemId },
    });

    if (!item) {
      throw new Error(`Translated knowledge item with ID ${input.knowledgeItemId} does not exist.`);
    }

    return prisma.translation.create({
      data: {
        knowledgeItemId: input.knowledgeItemId,
        originalItemId: input.originalItemId,
        language: input.language,
        title: input.title,
        summary: input.summary,
        content: input.content,
        // PRD 5.4: Never inherits original status. Must be DRAFT or explicitly reviewed.
        reviewStatus: input.reviewStatus ?? VerificationStatus.DRAFT,
      },
    });
  }

  /**
   * Retrieves all translations for a given original knowledge item.
   */
  static async getByOriginalItemId(originalItemId: string) {
    return prisma.translation.findMany({
      where: { originalItemId },
      include: {
        knowledgeItem: {
          select: {
            id: true,
            slug: true,
            language: true,
            status: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { language: 'asc' },
    });
  }

  /**
   * Updates an existing translation entry.
   */
  static async update(id: string, input: TranslationUpdateInput) {
    return prisma.translation.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.summary !== undefined && { summary: input.summary }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.reviewStatus !== undefined && { reviewStatus: input.reviewStatus }),
      },
    });
  }

  /**
   * Updates translation review status independently.
   */
  static async updateReviewStatus(id: string, status: VerificationStatus) {
    return prisma.translation.update({
      where: { id },
      data: { reviewStatus: status },
    });
  }
}
