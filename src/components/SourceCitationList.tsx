import React from 'react';
import { ExternalLink, ShieldCheck, Bookmark, FileText } from 'lucide-react';
import { StaticSource } from '@/lib/data/initial-data';

interface SourceCitationListProps {
  sources: Array<{
    source: StaticSource;
    supportingNote?: string;
  }>;
}

export default function SourceCitationList({ sources }: SourceCitationListProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section className="my-10 p-6 sm:p-8 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-foreground">Verified References & Sources</h3>
            <p className="text-xs text-muted-foreground">
              Primary citations anchoring this published knowledge item
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-secondary text-secondary-foreground font-semibold">
          {sources.length} {sources.length === 1 ? 'Source' : 'Sources'}
        </span>
      </div>

      <div className="space-y-4">
        {sources.map(({ source, supportingNote }, idx) => (
          <div
            key={source.id || idx}
            className="p-4 rounded-xl bg-background border border-border/70 hover:border-foreground/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent">[{idx + 1}]</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase font-semibold">
                  {source.sourceType.replace('_', ' ')}
                </span>
                {source.license && (
                  <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                    {source.license}
                  </span>
                )}
              </div>

              <h4 className="text-base font-semibold text-foreground leading-snug">
                {source.title}
              </h4>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {source.publisher && <span>Publisher: <strong className="text-foreground/80">{source.publisher}</strong></span>}
                {source.author && <span>• Author: <strong className="text-foreground/80">{source.author}</strong></span>}
                {source.supportingLocation && <span>• Location: <strong className="text-foreground/80">{source.supportingLocation}</strong></span>}
              </div>

              {supportingNote && (
                <p className="text-xs text-muted-foreground/90 italic pt-1 border-t border-border/50">
                  Note: "{supportingNote}"
                </p>
              )}
            </div>

            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border flex-shrink-0 transition-colors"
            >
              <span>Inspect Source</span>
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
