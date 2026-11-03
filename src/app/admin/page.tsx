import React from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckSquare,
  Bookmark,
  Layers,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  GitBranch,
} from 'lucide-react';
import { INITIAL_KNOWLEDGE_ITEMS, INITIAL_CATEGORIES, INITIAL_SOURCES } from '@/lib/data/initial-data';
import { INITIAL_SUBMISSIONS, INITIAL_REVISIONS } from '@/lib/data/admin-state';

export default function AdminOverviewPage() {
  const totalArticles = INITIAL_KNOWLEDGE_ITEMS.length;
  const pendingSubmissions = INITIAL_SUBMISSIONS.filter((s) => s.status === 'PENDING').length;
  const totalSources = Object.keys(INITIAL_SOURCES).length;
  const totalCategories = INITIAL_CATEGORIES.length;

  return (
    <div className="max-w-6xl space-y-8">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Console Overview & Metrics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status of Knowra's published knowledge entries, sources, and peer review queue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/knowledge/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground border border-border text-xs font-semibold hover:bg-secondary/80 transition-all"
          >
            <CheckSquare className="w-4 h-4 text-accent" />
            <span>Review Submissions ({pendingSubmissions})</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Published Articles */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-semibold">Published Articles</p>
            <h3 className="text-3xl font-bold font-serif text-foreground mt-1">{totalArticles}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Sourced</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
            <FileText className="w-6 h-6 text-accent" />
          </div>
        </div>

        {/* Metric 2: Pending Submissions */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-semibold">Submissions in Queue</p>
            <h3 className="text-3xl font-bold font-serif text-foreground mt-1">{pendingSubmissions}</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Awaiting Peer Review
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
            <CheckSquare className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Metric 3: Verified Sources */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-semibold">Verified Primary Sources</p>
            <h3 className="text-3xl font-bold font-serif text-foreground mt-1">{totalSources}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Journals, NASA, UNESCO
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
            <Bookmark className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Metric 4: Categories */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-semibold">Knowledge Categories</p>
            <h3 className="text-3xl font-bold font-serif text-foreground mt-1">{totalCategories}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Natural & Social Sciences
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground">
            <Layers className="w-6 h-6 text-blue-500" />
          </div>
        </div>

      </div>

      {/* Main Split: Pending Reviews & Recent Revisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Submissions Queue */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-accent" />
              <h2 className="font-serif font-bold text-lg text-foreground">
                Pending Community Submissions
              </h2>
            </div>
            <Link href="/admin/submissions" className="text-xs text-accent hover:underline font-medium">
              View All Queue →
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_SUBMISSIONS.filter((s) => s.status === 'PENDING').map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-background border border-border hover:border-foreground/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                    {sub.language.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    By {sub.contributorName}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-foreground leading-snug">
                  {sub.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {sub.content.replace(/^#+\s/gm, '')}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground italic truncate max-w-[200px]">
                    Sources: {sub.proposedSources}
                  </span>
                  <Link
                    href={`/admin/submissions#${sub.id}`}
                    className="font-semibold text-accent hover:underline text-xs"
                  >
                    Moderate & Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Revision Audit Trail */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-500" />
              <h2 className="font-serif font-bold text-lg text-foreground">
                Recent Revision Audit Trail
              </h2>
            </div>
            <Link href="/admin/revisions" className="text-xs text-accent hover:underline font-medium">
              Audit Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_REVISIONS.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-background border border-border space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm">
                    {rev.knowledgeItemTitle}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-secondary text-accent font-bold">
                    Rev #{rev.revisionNumber}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {rev.changeSummary}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50">
                  <span>Editor: <strong className="text-foreground">{rev.editorName}</strong></span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
