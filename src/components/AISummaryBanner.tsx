'use client';

import React, { useState } from 'react';
import { Sparkles, Info, RefreshCw, BookOpen, GraduationCap, School } from 'lucide-react';

interface AISummaryBannerProps {
  summary: string;
  articleContent?: string;
  articleLanguage?: string;
  articleTitle?: string;
}

export default function AISummaryBanner({
  summary,
  articleContent,
  articleLanguage = 'en',
}: AISummaryBannerProps) {
  const [currentLevel, setCurrentLevel] = useState<'standard' | 'high_school' | 'elementary'>('standard');
  const [displayText, setDisplayText] = useState(summary);
  const [simplifiedCache, setSimplifiedCache] = useState<Record<string, string>>({
    standard: summary,
  });
  const [loading, setLoading] = useState(false);

  const handleLevelChange = async (level: 'standard' | 'high_school' | 'elementary') => {
    if (level === currentLevel) return;
    setCurrentLevel(level);

    if (simplifiedCache[level]) {
      setDisplayText(simplifiedCache[level]);
      return;
    }

    if (!articleContent) return;

    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: articleContent,
          targetReadingLevel: level,
          language: articleLanguage,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.simplifiedContent) {
        setSimplifiedCache((prev) => ({
          ...prev,
          [level]: data.data.simplifiedContent,
        }));
        setDisplayText(data.data.simplifiedContent);
      }
    } catch (err) {
      console.error('Failed to simplify content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!summary) return null;

  return (
    <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-foreground transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-500/20">
        
        {/* Header Title with AI Badge */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                AI-Assisted Knowledge Orientation
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 font-semibold uppercase">
                {currentLevel}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              PRD 6.3: AI output separated from canonical article text. Non-authoritative orientation.
            </p>
          </div>
        </div>

        {/* Reading Level Selector */}
        {articleContent && (
          <div className="flex items-center gap-1 bg-amber-500/10 p-1 rounded-lg self-start sm:self-auto text-xs">
            <button
              onClick={() => handleLevelChange('standard')}
              disabled={loading}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                currentLevel === 'standard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => handleLevelChange('high_school')}
              disabled={loading}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                currentLevel === 'high_school'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>High School</span>
            </button>
            <button
              onClick={() => handleLevelChange('elementary')}
              disabled={loading}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                currentLevel === 'elementary'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <School className="w-3 h-3" />
              <span>Elementary (সহজ পাঠ)</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="py-4 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Formulating level-adapted explanation using Knowra AI engine...</span>
        </div>
      ) : (
        <p className="text-sm text-foreground/90 leading-relaxed font-sans">
          {displayText}
        </p>
      )}

      {/* Epistemic Transparency Disclaimer */}
      <div className="mt-3 pt-2 border-t border-amber-500/15 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-amber-500" />
          <span>Derived strictly from the source material. Primary understanding must be verified via citations below.</span>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 hidden sm:inline-block">
          isAiGenerated: true
        </span>
      </div>
    </div>
  );
}
