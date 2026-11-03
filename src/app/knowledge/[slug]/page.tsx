import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SourceCitationList from '@/components/SourceCitationList';
import AISummaryBanner from '@/components/AISummaryBanner';
import KnowledgeCard from '@/components/KnowledgeCard';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import {
  ShieldCheck,
  Globe,
  Clock,
  Tag,
  GitBranch,
  Edit3,
  ChevronRight,
  Share2,
  BookOpen,
} from 'lucide-react';
import { VerificationStatus } from '@prisma/client';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INITIAL_KNOWLEDGE_ITEMS.map((item) => ({
    slug: item.slug,
  }));
}

export default async function KnowledgeArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = INITIAL_KNOWLEDGE_ITEMS.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles in the same category (excluding current)
  const relatedArticles = INITIAL_KNOWLEDGE_ITEMS.filter(
    (item) => item.category.slug === article.category.slug && item.id !== article.id
  ).slice(0, 2);

  const formattedDate = new Date(article.updatedAt).toLocaleDateString(
    article.language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        
        {/* Breadcrumb & Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/categories/${article.category.slug}`} className="hover:text-foreground">
            {article.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {article.title}
          </span>
        </nav>

        {/* Article Header Metadata */}
        <header className="mb-8 pb-6 border-b border-border space-y-4">
          
          {/* Status & Language Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-semibold">
                {article.category.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono uppercase">
                {article.language.toUpperCase()}
              </span>
              {article.status === VerificationStatus.REVIEWED && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Peer-Reviewed & Verified</span>
                </span>
              )}
            </div>

            {/* Translation Link if Available */}
            {article.translations.length > 0 && (
              <div className="flex items-center gap-1.5 bg-secondary/80 border border-border px-3 py-1 rounded-lg text-xs">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span className="text-muted-foreground">Available in:</span>
                {article.translations.map((t) => (
                  <Link
                    key={t.id}
                    href={`/knowledge/${t.slug}`}
                    className="font-semibold text-accent hover:underline"
                  >
                    {t.language === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.2]">
            {article.title}
          </h1>

          {/* Short Lead Summary */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans font-normal">
            {article.summary}
          </p>

          {/* Metadata Attribution Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span>Author: <strong className="text-foreground">{article.author.name}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated: {formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Revision #{article.revisionNumber}</span>
              </span>
            </div>

            <Link
              href="/contribute"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-accent" />
              <span>Suggest an Edit</span>
            </Link>
          </div>

        </header>

        {/* AI Summary Banner (If Present) */}
        {article.aiSummary && <AISummaryBanner summary={article.aiSummary} />}

        {/* Article Body Content (Rendered Markdown) */}
        <article className="py-4">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="my-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground mr-1" />
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono hover:bg-secondary/70 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Verified References and Sources Section (PRD 5.3) */}
        <SourceCitationList sources={article.sources} />

        {/* Related Knowledge Section */}
        {relatedArticles.length > 0 && (
          <section className="my-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-xl text-foreground">
                Related Knowledge Entries
              </h3>
              <Link
                href={`/categories/${article.category.slug}`}
                className="text-xs text-accent hover:underline font-medium"
              >
                More in {article.category.name} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <KnowledgeCard
                  key={rel.id}
                  id={rel.id}
                  slug={rel.slug}
                  title={rel.title}
                  summary={rel.summary}
                  category={rel.category}
                  language={rel.language}
                  status={rel.status}
                  sourceCount={rel.sources.length}
                  lastUpdatedAt={rel.updatedAt}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
