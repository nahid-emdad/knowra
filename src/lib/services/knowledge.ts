import { prisma } from '@/lib/db';
import {
  KnowledgeItemCreateInput,
  KnowledgeItemUpdateInput,
  slugify,
} from '@/lib/validations';
import { VerificationStatus } from '@prisma/client';

export interface ListKnowledgeParams {
  language?: string;
  categorySlug?: string;
  categoryId?: string;
  status?: VerificationStatus;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class KnowledgeService {
  /**
   * Creates a new knowledge item along with tags, sources, and an initial revision log.
   */
  static async create(input: KnowledgeItemCreateInput) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title);

    // PRD 5.3: Ensure reviewed items have at least one usable source
    if (input.status === VerificationStatus.REVIEWED && input.sources.length === 0) {
      throw new Error('A reviewed knowledge item must contain at least one usable source reference.');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create the knowledge item
      const item = await tx.knowledgeItem.create({
        data: {
          title: input.title,
          slug,
          summary: input.summary,
          content: input.content,
          language: input.language,
          categoryId: input.categoryId,
          status: input.status,
          authorId: input.authorId,
          revisionNumber: 1,
          aiSummary: input.aiSummary ?? null,
          isAiGenerated: input.isAiGenerated,
          lastReviewedAt: input.status === VerificationStatus.REVIEWED ? new Date() : null,
        },
      });

      // 2. Link sources
      if (input.sources.length > 0) {
        await tx.knowledgeSource.createMany({
          data: input.sources.map((s) => ({
            knowledgeItemId: item.id,
            sourceId: s.sourceId,
            supportingNote: s.supportingNote ?? null,
          })),
        });
      }

      // 3. Link or create tags
      if (input.tags.length > 0) {
        for (const tagName of input.tags) {
          const tagSlug = slugify(tagName);
          const tag = await tx.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name: tagName, slug: tagSlug },
          });

          await tx.knowledgeTag.create({
            data: {
              knowledgeItemId: item.id,
              tagId: tag.id,
            },
          });
        }
      }

      // 4. Log initial revision
      await tx.revision.create({
        data: {
          knowledgeItemId: item.id,
          editorId: input.authorId,
          previousContent: '',
          newContent: input.content,
          changeSummary: 'Initial publication',
        },
      });

      return item;
    });
  }

  /**
   * Retrieves a knowledge item by slug with all relationships populated.
   */
  static async getBySlug(slug: string) {
    return prisma.knowledgeItem.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, role: true },
        },
        tags: {
          include: { tag: true },
        },
        sources: {
          include: { source: true },
        },
        translationsAsOriginal: {
          include: {
            knowledgeItem: {
              select: { id: true, slug: true, title: true, language: true, status: true },
            },
          },
        },
        translationsAsItem: {
          include: {
            originalItem: {
              select: { id: true, slug: true, title: true, language: true, status: true },
            },
          },
        },
        _count: {
          select: { revisions: true },
        },
      },
    });
  }

  /**
   * Retrieves a knowledge item by ID.
   */
  static async getById(id: string) {
    return prisma.knowledgeItem.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, role: true },
        },
        tags: {
          include: { tag: true },
        },
        sources: {
          include: { source: true },
        },
        translationsAsOriginal: true,
        revisions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            editor: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  /**
   * Updates a knowledge item and appends an immutable revision log.
   */
  static async update(id: string, input: KnowledgeItemUpdateInput) {
    const existing = await prisma.knowledgeItem.findUnique({
      where: { id },
      include: { sources: true },
    });

    if (!existing) {
      throw new Error(`Knowledge item with ID ${id} not found.`);
    }

    return prisma.$transaction(async (tx) => {
      const data: Record<string, unknown> = {};

      if (input.title !== undefined) data.title = input.title;
      if (input.summary !== undefined) data.summary = input.summary;
      if (input.content !== undefined) data.content = input.content;
      if (input.language !== undefined) data.language = input.language;
      if (input.categoryId !== undefined) data.categoryId = input.categoryId;
      if (input.status !== undefined) {
        data.status = input.status;
        if (input.status === VerificationStatus.REVIEWED) {
          data.lastReviewedAt = new Date();
        }
      }
      if (input.aiSummary !== undefined) data.aiSummary = input.aiSummary;
      if (input.isAiGenerated !== undefined) data.isAiGenerated = input.isAiGenerated;

      if (input.slug !== undefined) {
        data.slug = slugify(input.slug);
      } else if (input.title !== undefined) {
        data.slug = slugify(input.title);
      }

      // Bump revision number if content changed
      const contentChanged = input.content !== undefined && input.content !== existing.content;
      if (contentChanged) {
        data.revisionNumber = existing.revisionNumber + 1;
      }

      // Update sources if provided
      if (input.sources !== undefined) {
        await tx.knowledgeSource.deleteMany({ where: { knowledgeItemId: id } });
        if (input.sources.length > 0) {
          await tx.knowledgeSource.createMany({
            data: input.sources.map((s) => ({
              knowledgeItemId: id,
              sourceId: s.sourceId,
              supportingNote: s.supportingNote ?? null,
            })),
          });
        }
      }

      // Update item
      const updated = await tx.knowledgeItem.update({
        where: { id },
        data,
      });

      // Record revision if content or summary changed
      if (contentChanged) {
        await tx.revision.create({
          data: {
            knowledgeItemId: id,
            editorId: input.editorId,
            previousContent: existing.content,
            newContent: input.content!,
            changeSummary: input.changeSummary ?? 'Content updated',
          },
        });
      }

      return updated;
    });
  }

  /**
   * Lists knowledge items with filtering and pagination.
   */
  static async list(params?: ListKnowledgeParams) {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (params?.language) where.language = params.language;
    if (params?.status) where.status = params.status;
    if (params?.categoryId) where.categoryId = params.categoryId;
    if (params?.categorySlug) {
      where.category = { slug: params.categorySlug };
    }
    if (params?.tag) {
      where.tags = {
        some: {
          tag: { slug: slugify(params.tag) },
        },
      };
    }

    const sortField = params?.sortBy === 'title' ? 'title' : params?.sortBy === 'updated_at' ? 'updatedAt' : 'createdAt';
    const sortOrder = params?.sortOrder ?? 'desc';

    const [items, total] = await Promise.all([
      prisma.knowledgeItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          _count: { select: { sources: true } },
        },
      }),
      prisma.knowledgeItem.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Updates verification status with reviewer attribution.
   */
  static async changeStatus(id: string, status: VerificationStatus, reviewerId: string) {
    return prisma.knowledgeItem.update({
      where: { id },
      data: {
        status,
        lastReviewedAt: status === VerificationStatus.REVIEWED ? new Date() : undefined,
      },
    });
  }
}
