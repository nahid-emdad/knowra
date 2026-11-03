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
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
