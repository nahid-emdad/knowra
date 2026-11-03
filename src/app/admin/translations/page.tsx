'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IN_MEMORY_TRANSLATIONS, TranslationRecord } from '@/lib/services/translation';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { VerificationStatus } from '@prisma/client';
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Split,
  Eye,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function AdminTranslationsPage() {
  const [translations, setTranslations] = useState<TranslationRecord[]>(IN_MEMORY_TRANSLATIONS);
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationRecord | null>(
    translations.find((t) => t.reviewStatus === VerificationStatus.PENDING_REVIEW) || translations[0] || null
  );
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleReviewAction = async (action: 'APPROVE' | 'REQUEST_CORRECTIONS' | 'REJECT') => {
    if (!selectedTranslation) return;
    setActionLoading(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/v1/admin/translations/${selectedTranslation.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: reviewerNotes }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTranslations((prev) =>
          prev.map((t) => (t.id === data.data.id ? data.data : t))
        );
        setSelectedTranslation(data.data);
        setNotification({
          type: 'success',
          message: `Translation status updated to: ${data.data.reviewStatus}`,
        });
        setReviewerNotes('');
      } else {
        setNotification({
          type: 'error',
          message: data.error?.message || 'Review action failed.',
        });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error performing review.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateAiTranslation = async (articleId: string) => {
    const article = INITIAL_KNOWLEDGE_ITEMS.find((k) => k.id === articleId);
    if (!article) return;

    const targetLang = article.language === 'en' ? 'bn' : 'en';
    setAiGenerating(true);
    setNotification(null);

    try {
      const res = await fetch('/api/v1/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          sourceLanguage: article.language,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Submit as pending translation
        const submitRes = await fetch('/api/v1/translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalItemId: article.id,
            language: targetLang,
            title: data.data.translatedTitle,
            summary: `${article.summary} [Translated Draft]`,
            content: data.data.translatedContent,
            translatorName: 'Knowra AI Translation Copilot',
            translatorEmail: 'ai-copilot@knowra.org',
          }),
        });
        const submitData = await submitRes.json();
        if (submitData.success && submitData.data) {
          setTranslations((prev) => [submitData.data, ...prev]);
          setSelectedTranslation(submitData.data);
          setNotification({
            type: 'success',
            message: `AI Translation draft generated in ${targetLang.toUpperCase()} and added to review queue. Status: PENDING_REVIEW.`,
          });
        }
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to generate AI translation draft.' });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              PRD Section 5.4: Multilingual Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Translation & Language Review Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Translations are verified independently from original canonical articles. No automatic inheritance of review status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateAiTranslation('k_bhasha_01')}
            disabled={aiGenerating}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{aiGenerating ? 'Translating...' : 'Auto-Draft Missing Language'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 border border-destructive/20 text-destructive'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main 2-Column Interface: Queue on Left, Side-by-Side on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Translations Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-mono text-muted-foreground">
            <span>Translations Queue ({translations.length})</span>
            <span>Independent Review</span>
          </div>

          <div className="space-y-2">
            {translations.map((t) => {
              const isSelected = selectedTranslation?.id === t.id;
              const isPending = t.reviewStatus === VerificationStatus.PENDING_REVIEW;
              const isReviewed = t.reviewStatus === VerificationStatus.REVIEWED;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTranslation(t)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-secondary border-accent/40 shadow-sm'
                      : 'bg-card border-border hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border font-bold">
                      {t.originalLanguage.toUpperCase()} ➔ {t.language.toUpperCase()}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isReviewed
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : isPending
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 animate-pulse'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {t.reviewStatus}
                    </span>
                  </div>

                  <h4 className="font-semibold text-foreground truncate">{t.title}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">Orig: {t.originalTitle}</p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>By: {t.translator.name}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Side-by-Side Review Inspector */}
        <div className="lg:col-span-8 space-y-4">
          {selectedTranslation ? (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
              
              {/* Reviewer Header & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary font-bold">
                      {selectedTranslation.originalLanguage.toUpperCase()} ➔ {selectedTranslation.language.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Translator: {selectedTranslation.translator.name} ({selectedTranslation.translator.email})
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    PRD Rule 5.4: Verify terminology, scientific formulas, and meaning preservation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded font-bold uppercase ${
                      selectedTranslation.reviewStatus === VerificationStatus.REVIEWED
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {selectedTranslation.reviewStatus}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Content Comparer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Original Canonical Article */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-2 border-b border-border/60">
                    <span className="font-semibold text-foreground">
                      Original ({selectedTranslation.originalLanguage.toUpperCase()})
                    </span>
                    <span>Canonical Source</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    {selectedTranslation.originalTitle}
                  </h3>
                  <div className="text-xs font-sans text-muted-foreground whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed pt-2">
                    {selectedTranslation.originalContent}
                  </div>
                </div>

                {/* Right: Translated Article Draft */}
                <div className="p-4 rounded-xl bg-background border border-accent/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-accent pb-2 border-b border-border/60">
                    <span className="font-semibold text-foreground">
                      Translation ({selectedTranslation.language.toUpperCase()})
                    </span>
                    <span className="font-bold">Proposed Draft</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    {selectedTranslation.title}
                  </h3>
                  <div className="text-xs font-sans text-foreground whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed pt-2">
                    {selectedTranslation.content}
                  </div>
                </div>

              </div>

              {/* Reviewer Notes & Action Buttons */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Editorial Reviewer Notes & Feedback
                  </label>
                  <input
                    type="text"
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="e.g. 'Accurate Bengali technical translation verified against scientific glossary.'"
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Admin Reviewer: Nahid Emdad
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('REJECT')}
                      className="px-3.5 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('REQUEST_CORRECTIONS')}
                      className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border transition-colors"
                    >
                      Request Corrections
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('APPROVE')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish Translation</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">
              Select a translation from the queue to review.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
