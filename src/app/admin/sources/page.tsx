'use client';

import React, { useState } from 'react';
import { INITIAL_SOURCES, StaticSource } from '@/lib/data/initial-data';
import { SourceType } from '@prisma/client';
import {
  Bookmark,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';

export default function SourcesManagementPage() {
  const [sources, setSources] = useState<StaticSource[]>(Object.values(INITIAL_SOURCES));
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    publisher: string;
    author: string;
    sourceType: SourceType;
    license: string;
    language: string;
  }>({
    title: '',
    url: '',
    publisher: '',
    author: '',
    sourceType: SourceType.ACADEMIC,
    license: 'Open Access / Creative Commons',
    language: 'en',
  });
  const [notice, setNotice] = useState<string | null>(null);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      alert('Source URL must begin with http:// or https://');
      return;
    }

    const newSource: StaticSource = {
      id: `src_${Date.now()}`,
      url: formData.url,
      title: formData.title,
      publisher: formData.publisher,
      author: formData.author,
      sourceType: formData.sourceType,
      license: formData.license,
      language: formData.language,
    };

    setSources([newSource, ...sources]);
    setShowAddForm(false);
    setNotice(`Source "${newSource.title}" registered successfully.`);
    setTimeout(() => setNotice(null), 3000);
    setFormData({
      title: '',
      url: '',
      publisher: '',
      author: '',
      sourceType: SourceType.ACADEMIC,
      license: 'Open Access / Creative Commons',
      language: 'en',
    });
  };

  return (
    <div className="max-w-6xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Verified Primary Sources Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registered authority repositories, academic publishers, government datasets, and official archives
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Register New Primary Source'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Source Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSource} className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Register Authority Source</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Source Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Cambridge Planetary Science Journal"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Verified URL *</label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Publisher / Institution *</label>
              <input
                type="text"
                required
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="e.g. Oxford University Press / NASA"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Author / Research Group</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Prof. Alan Turing / Mission Team"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Source Type *</label>
              <select
                value={formData.sourceType}
                onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as SourceType })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground cursor-pointer"
              >
                <option value={SourceType.ACADEMIC}>ACADEMIC</option>
                <option value={SourceType.RESEARCH_PAPER}>RESEARCH PAPER</option>
                <option value={SourceType.GOVERNMENT}>GOVERNMENT</option>
                <option value={SourceType.EDUCATIONAL_INSTITUTION}>EDUCATIONAL INSTITUTION</option>
                <option value={SourceType.OFFICIAL_DOCUMENTATION}>OFFICIAL DOCUMENTATION</option>
                <option value={SourceType.BOOKS}>BOOKS</option>
                <option value={SourceType.REPUTABLE_PUBLICATIONS}>REPUTABLE PUBLICATIONS</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">License / Copyright</label>
              <input
                type="text"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                placeholder="e.g. CC-BY 4.0 / Public Domain"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              Save Source
            </button>
          </div>
        </form>
      )}

      {/* Sources Directory Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border font-medium">
              <tr>
                <th className="p-4">Title & Publisher</th>
                <th className="p-4">Source Type</th>
                <th className="p-4">Author</th>
                <th className="p-4">License</th>
                <th className="p-4">Language</th>
                <th className="p-4 text-right">Inspect Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4 max-w-sm">
                    <span className="font-semibold text-foreground text-sm block leading-snug">
                      {src.title}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {src.publisher}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                      {src.sourceType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-foreground/80">
                    {src.author || 'Institutional'}
                  </td>
                  <td className="p-4 text-muted-foreground font-mono text-[11px]">
                    {src.license || 'All Rights Reserved'}
                  </td>
                  <td className="p-4">
                    <span className="font-mono uppercase font-bold text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {src.language}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                    >
                      <span>Visit URL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
