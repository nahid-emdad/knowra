import { Role, VerificationStatus, SourceType, SubmissionStatus, ReviewDecision } from '@prisma/client';

export type { Role, VerificationStatus, SourceType, SubmissionStatus, ReviewDecision };

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

export interface SourceReference {
  id: string;
  url: string;
  title: string;
  publisher?: string | null;
  author?: string | null;
  sourceType: SourceType;
  publicationDate?: Date | null;
  accessDate: Date;
  license?: string | null;
  supportingLocation?: string | null;
  supportingNote?: string | null;
}

export interface KnowledgeItemView {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  language: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  status: VerificationStatus;
  author: {
    id: string;
    name: string;
  };
  sources: SourceReference[];
  revisionNumber: number;
  aiSummary?: string | null;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt?: Date | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
