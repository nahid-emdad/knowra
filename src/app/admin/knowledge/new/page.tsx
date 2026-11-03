'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_CATEGORIES, INITIAL_SOURCES } from '@/lib/data/initial-data';
import { VerificationStatus } from '@prisma/client';
import { slugify } from '@/lib/validations';
import {
  FileText,
  ShieldCheck,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function CreateArticleAdminPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    language: string;
    categorySlug: string;
    summary: string;
    content: string;
    sourceId: string;
    status: VerificationStatus;
    supportingNote: string;
    tags: string[];
  }>({
    title: '',
    slug: '',
    language: 'en',
    categorySlug: 'science',
    summary: '',
    content: '',
    sourceId: 'src_nature_01',
    status: VerificationStatus.REVIEWED,
    supportingNote: '',
    tags: [],
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAISummarize = async () => {
    if (!formData.content || formData.content.length < 20) {
      setError('Please provide at least 20 characters of content before generating an AI summary.');
      return;
    }
    setAiLoading(true);
    setAiMessage('Generating AI summary draft...');
    try {
      const res = await fetch('/api/v1/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          language: formData.language,
          maxLength: 250,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.summary) {
        setFormData((prev) => ({ ...prev, summary: data.data.summary }));
        setAiMessage('AI Summary draft inserted. Human review required before publishing.');
      }
    } catch {
      setError('Failed to generate AI summary.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAISuggestTags = async () => {
    if (!formData.title || !formData.content) {
      setError('Please provide both title and content before generating tags.');
      return;
    }
    setAiLoading(true);
    setAiMessage('Analyzing content for relevant topic tags...');
    try {
      const res = await fetch('/api/v1/ai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          language: formData.language,
          maxTags: 6,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.tags) {
        setFormData((prev) => ({ ...prev, tags: data.data.tags }));
        setAiMessage(`Suggested ${data.data.tags.length} tags: ${data.data.tags.join(', ')}`);
      }
    } catch {
      setError('Failed to suggest tags.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAITranslateDraft = async () => {
    if (!formData.title || !formData.content) {
      setError('Please provide title and content to translate.');
      return;
    }
    const targetLang = formData.language === 'en' ? 'bn' : 'en';
    setAiLoading(true);
    setAiMessage(`Translating to ${targetLang === 'bn' ? 'Bengali' : 'English'} draft...`);
    try {
      const res = await fetch('/api/v1/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          sourceLanguage: formData.language,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          title: data.data.translatedTitle,
          content: data.data.translatedContent,
          language: targetLang,
          status: VerificationStatus.DRAFT, // Strict PRD Rule 5.4: Translated draft cannot inherit reviewed status automatically
        }));
        setAiMessage('Translated draft created with status set to DRAFT (Editor review required).');
      }
    } catch {
      setError('Failed to translate draft.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || formData.title.length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }

    if (!formData.content.trim() || formData.content.length < 20) {
      setError('Content must provide adequate knowledge text (at least 20 characters).');
      return;
    }

    // PRD 5.3: Strict rule
    if (formData.status === VerificationStatus.REVIEWED && !formData.sourceId) {
      setError('A reviewed/published article must link to at least one verified primary source.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/knowledge');
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/knowledge"
            className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Create Knowledge Article
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft and publish source-backed knowledge entries directly to the platform
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
          Source Verification Required
        </span>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Knowledge article created successfully! Redirecting to knowledge list...</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card border border-border space-y-6 shadow-sm">
        
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Cellular Respiration and ATP Synthesis"
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              URL Slug (Generated) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-muted-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Category, Language & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Knowledge Domain *
            </label>
            <select
              value={formData.categorySlug}
              onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground cursor-pointer"
            >
              {INITIAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Language *
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="bn">বাংলা (BN)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Verification Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as VerificationStatus })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground cursor-pointer font-medium"
            >
              <option value={VerificationStatus.REVIEWED}>Reviewed & Published</option>
              <option value={VerificationStatus.DRAFT}>Draft</option>
              <option value={VerificationStatus.NEEDS_CORRECTION}>Needs Correction</option>
            </select>
          </div>
        </div>

        {/* AI Copilot / Assistant Toolbar (PRD Section 6) */}
        <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Knowra AI Editorial Assistant
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              PRD 6.3: AI Drafts require mandatory human editorial review
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleAISummarize}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Draft Summary</span>
            </button>
            <button
              type="button"
              onClick={handleAISuggestTags}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggest Tags</span>
            </button>
            <button
              type="button"
              onClick={handleAITranslateDraft}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Translate Draft ({formData.language === 'en' ? 'বাংলা' : 'English'})</span>
            </button>
          </div>

          {aiMessage && (
            <div className="text-[11px] text-indigo-600 dark:text-indigo-300 font-mono bg-indigo-500/5 p-2 rounded border border-indigo-500/15">
              {aiMessage}
            </div>
          )}

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Generated Tags:</span>
              {formData.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary border border-border">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Summary / Executive Abstract *
          </label>
          <textarea
            rows={3}
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="A clear, 1-3 sentence factual summary introducing the topic..."
            className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-accent"
          />
        </div>

        {/* Markdown Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex justify-between">
            <span>Article Body (Markdown Format) *</span>
            <span className="text-[11px] text-muted-foreground font-normal">Supports #, ##, Lists, Math $$</span>
          </label>
          <textarea
            rows={10}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="# Article Heading&#10;&#10;Detailed explanation of the concept with proper subdivisions...&#10;&#10;## Key Mechanisms&#10;&#10;- Mechanism 1&#10;- Mechanism 2"
            className="w-full bg-background border border-border rounded-lg p-3.5 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
          />
        </div>

        {/* Primary Source Binding (PRD 5.3) */}
        <div className="p-4 rounded-xl bg-secondary/60 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Primary Source Citation *</span>
            </label>
            <span className="text-[10px] font-mono text-muted-foreground">Anchors Epistemic Truth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={formData.sourceId}
              onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground cursor-pointer"
            >
              {Object.values(INITIAL_SOURCES).map((src) => (
                <option key={src.id} value={src.id}>
                  {src.publisher} — {src.title.slice(0, 40)}...
                </option>
              ))}
            </select>

            <input
              type="text"
              value={formData.supportingNote}
              onChange={(e) => setFormData({ ...formData, supportingNote: e.target.value })}
              placeholder="Supporting note (e.g. Chapter 4, pp. 110-120)"
              className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/admin/knowledge"
            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity"
          >
            Save & Publish Knowledge Entry
          </button>
        </div>

      </form>

    </div>
  );
}
