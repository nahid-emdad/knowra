import { prisma } from '@/lib/db';
import { SourceCreateInput, SourceUpdateInput } from '@/lib/validations';
import { SourceType } from '@prisma/client';

export class SourceService {
  /**
   * Validates URL protocol and structure for safety.
   */
  static validateUrl(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl);
      return ['http:', 'https:', 'doi:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Creates a verified source record.
   */
  static async create(input: SourceCreateInput) {
    if (!this.validateUrl(input.url)) {
      throw new Error('Invalid source URL format. Must begin with http://, https://, or doi:');
    }

    return prisma.source.create({
      data: {
        url: input.url,
        title: input.title,
        publisher: input.publisher ?? null,
        author: input.author ?? null,
        sourceType: input.sourceType,
        publicationDate: input.publicationDate ?? null,
        accessDate: input.accessDate,
        license: input.license ?? null,
        supportingLocation: input.supportingLocation ?? null,
        language: input.language,
      },
    });
  }

  /**
   * Retrieves a source by ID.
   */
  static async getById(id: string) {
    return prisma.source.findUnique({
      where: { id },
      include: {
        knowledgeItems: {
          include: {
            knowledgeItem: {
              select: {
                id: true,
                slug: true,
                title: true,
                language: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Links an existing source to a knowledge item with supporting note.
   */
  static async attachToKnowledge(
    knowledgeItemId: string,
    sourceId: string,
    supportingNote?: string | null
  ) {
    return prisma.knowledgeSource.upsert({
      where: {
        knowledgeItemId_sourceId: {
          knowledgeItemId,
          sourceId,
        },
      },
      update: {
        supportingNote: supportingNote ?? null,
      },
      create: {
        knowledgeItemId,
        sourceId,
        supportingNote: supportingNote ?? null,
      },
    });
  }

  /**
   * Detaches a source from a knowledge item.
   */
  static async detachFromKnowledge(knowledgeItemId: string, sourceId: string) {
    return prisma.knowledgeSource.delete({
      where: {
        knowledgeItemId_sourceId: {
          knowledgeItemId,
          sourceId,
        },
      },
    });
  }

  /**
   * Lists sources with optional filtering by type or language.
   */
  static async list(params?: {
    sourceType?: SourceType;
    language?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params?.sourceType) where.sourceType = params.sourceType;
    if (params?.language) where.language = params.language;

    const [sources, total] = await Promise.all([
      prisma.source.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.source.count({ where }),
    ]);

    return {
      sources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
