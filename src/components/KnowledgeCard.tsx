import React from 'react';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { VerificationStatus } from '@prisma/client';

interface KnowledgeCardProps {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: {
    name: string;
    slug: string;
  };
  language: string;
  status?: VerificationStatus;
  sourceCount: number;
  lastUpdatedAt: Date | string;
  relevanceScore?: number;
  className?: string;
}

export default function KnowledgeCard({
  slug,
  title,
  summary,
  category,
  language,
  status = VerificationStatus.REVIEWED,
  sourceCount,
  lastUpdatedAt,
  className = '',
}: KnowledgeCardProps) {
  const formattedDate = new Date(lastUpdatedAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <article
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:border-foreground/30 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <Link
              href={`/categories/${category.slug}`}
              className="px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              {category.name}
            </Link>
            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[11px] uppercase">
              {language.toUpperCase()}
            </span>
          </div>

          {status === VerificationStatus.REVIEWED && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-accent transition-colors leading-snug mb-2.5">
          <Link href={`/knowledge/${slug}`} className="focus:outline-none">
            <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
            {title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
          {summary}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium text-foreground/80">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span>
            {sourceCount} {sourceCount === 1 ? 'Primary Source' : 'Primary Sources'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}
