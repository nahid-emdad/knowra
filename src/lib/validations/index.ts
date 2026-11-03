import { z } from 'zod';
import { VerificationStatus, SourceType, SubmissionStatus, ReviewDecision, Role } from '@prisma/client';

/**
 * Generates a clean URL-friendly slug.
 * Handles Latin text and retains valid Unicode characters (including Bengali).
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\t\n]+/g, '-') // Replace spaces with hyphen
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // Keep alphanumeric and Bengali script
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
}

// =========================================================
// Category Schemas
// =========================================================

export const categoryCreateSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  parentId: z.string().cuid().nullable().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

// =========================================================
// Source Schemas
// =========================================================

export const sourceCreateSchema = z.object({
  url: z.string().url('A valid URL is required').max(2000),
  title: z.string().min(3, 'Source title must be at least 3 characters').max(255),
  publisher: z.string().max(255).optional().nullable(),
  author: z.string().max(255).optional().nullable(),
  sourceType: z.nativeEnum(SourceType).default(SourceType.REPUTABLE_PUBLICATIONS),
  publicationDate: z.coerce.date().optional().nullable(),
  accessDate: z.coerce.date().default(() => new Date()),
  license: z.string().max(100).optional().nullable(),
  supportingLocation: z.string().max(255).optional().nullable(),
  language: z.string().min(2).max(10).default('en'),
});

export const sourceUpdateSchema = sourceCreateSchema.partial();

export type SourceCreateInput = z.infer<typeof sourceCreateSchema>;
export type SourceUpdateInput = z.infer<typeof sourceUpdateSchema>;

// =========================================================
// Knowledge Item Schemas
// =========================================================

export const knowledgeItemSourceLinkSchema = z.object({
  sourceId: z.string().min(1, 'Source ID is required'),
  supportingNote: z.string().max(1000).optional().nullable(),
});

export const knowledgeItemCreateSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(255),
    slug: z.string().min(3).max(255).optional(),
    summary: z.string().min(10, 'Summary must be at least 10 characters').max(2000),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    language: z.string().min(2).max(10).default('en'),
    categoryId: z.string().min(1, 'Category ID is required'),
    tags: z.array(z.string().min(1).max(50)).default([]),
    status: z.nativeEnum(VerificationStatus).default(VerificationStatus.DRAFT),
    authorId: z.string().min(1, 'Author ID is required'),
    sources: z.array(knowledgeItemSourceLinkSchema).default([]),
    aiSummary: z.string().optional().nullable(),
    isAiGenerated: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // PRD Section 5.3: "Every published knowledge item must contain at least one usable source."
    if (data.status === VerificationStatus.REVIEWED && data.sources.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources'],
        message: 'A reviewed/published knowledge item must contain at least one usable source reference.',
      });
    }
  });

export const knowledgeItemUpdateSchema = z
  .object({
    title: z.string().min(3).max(255).optional(),
    slug: z.string().min(3).max(255).optional(),
    summary: z.string().min(10).max(2000).optional(),
    content: z.string().min(20).optional(),
    language: z.string().min(2).max(10).optional(),
    categoryId: z.string().optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
    status: z.nativeEnum(VerificationStatus).optional(),
    sources: z.array(knowledgeItemSourceLinkSchema).optional(),
    aiSummary: z.string().optional().nullable(),
    isAiGenerated: z.boolean().optional(),
    editorId: z.string().min(1, 'Editor ID is required for revisions'),
    changeSummary: z.string().max(255).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === VerificationStatus.REVIEWED && data.sources !== undefined && data.sources.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources'],
        message: 'A reviewed knowledge item cannot have its sources completely removed.',
      });
    }
  });

export type KnowledgeItemCreateInput = z.infer<typeof knowledgeItemCreateSchema>;
export type KnowledgeItemUpdateInput = z.infer<typeof knowledgeItemUpdateSchema>;

// =========================================================
// Translation Schemas
// =========================================================

export const translationCreateSchema = z.object({
  knowledgeItemId: z.string().min(1, 'Knowledge Item ID is required'),
  originalItemId: z.string().min(1, 'Original Item ID is required'),
  language: z.string().min(2).max(10),
  title: z.string().min(3).max(255),
  summary: z.string().min(10).max(2000),
  content: z.string().min(20),
  // PRD 5.4: Translation review must be tracked independently. Always defaults to DRAFT.
  reviewStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.DRAFT),
});

export const translationUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  summary: z.string().min(10).max(2000).optional(),
  content: z.string().min(20).optional(),
  reviewStatus: z.nativeEnum(VerificationStatus).optional(),
});

export type TranslationCreateInput = z.infer<typeof translationCreateSchema>;
export type TranslationUpdateInput = z.infer<typeof translationUpdateSchema>;

// =========================================================
// Submission & Review Schemas
// =========================================================

export const submissionCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255),
  content: z.string().min(30, 'Content must provide adequate knowledge information').max(50000),
  language: z.string().min(2).max(10).default('en'),
  proposedSources: z.string().min(10, 'Please provide at least one source URL or citation').max(2000),
  contributorName: z.string().min(2).max(255),
  contributorEmail: z.string().email('Please enter a valid email address').optional().nullable(),
});

export const reviewCreateSchema = z.object({
  submissionId: z.string().min(1),
  reviewerId: z.string().min(1),
  decision: z.nativeEnum(ReviewDecision),
  feedback: z.string().max(2000).optional().nullable(),
});

export type SubmissionCreateInput = z.infer<typeof submissionCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
