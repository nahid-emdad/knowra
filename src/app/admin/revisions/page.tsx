import React from 'react';
import Link from 'next/link';
import { INITIAL_REVISIONS } from '@/lib/data/admin-state';
import { GitBranch, Clock, User, FileText, ArrowRight } from 'lucide-react';

export default function RevisionsHistoryPage() {
  return (
    <div className="max-w-5xl space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Revision History & Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete, tamper-evident audit trail of all knowledge modifications, editor attributions, and change summaries
        </p>
      </div>

      {/* Revision Timeline List */}
      <div className="space-y-4">
        {INITIAL_REVISIONS.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm hover:border-foreground/30 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-accent/20 text-accent font-bold">
                  Revision #{rev.revisionNumber}
                </span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  ID: {rev.id}
                </span>
              </div>

              <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(rev.createdAt).toLocaleString()}</span>
              </span>
            </div>

            <h3 className="text-lg font-serif font-bold text-foreground leading-snug">
              {rev.knowledgeItemTitle}
            </h3>

            <div className="p-3.5 rounded-xl bg-background border border-border text-xs text-foreground/90 font-sans">
              <strong className="text-muted-foreground block mb-0.5 font-mono uppercase text-[10px]">Change Summary:</strong>
              {rev.changeSummary}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>Editor: <strong className="text-foreground">{rev.editorName}</strong></span>
              </span>

              <Link
                href={`/knowledge/${rev.knowledgeItemId.replace('item_', '').replace('_en', '-process')}`}
                className="text-accent hover:underline font-medium text-xs flex items-center gap-1"
              >
                <span>View Current Published State</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
