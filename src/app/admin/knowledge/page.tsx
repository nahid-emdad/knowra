'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_KNOWLEDGE_ITEMS, StaticKnowledgeItem } from '@/lib/data/initial-data';
import { VerificationStatus } from '@prisma/client';
import {
  FileText,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Edit,
  Clock,
  Layers,
  CheckCircle,
  AlertTriangle,
  Archive,
} from 'lucide-react';

export default function KnowledgeManagementPage() {
  const [items, setItems] = useState<StaticKnowledgeItem[]>(INITIAL_KNOWLEDGE_ITEMS);
  const [filterLang, setFilterLang] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = items.filter((item) => {
    if (filterLang !== 'all' && item.language !== filterLang) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: VerificationStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              updatedAt: new Date(),
              lastReviewedAt: newStatus === VerificationStatus.REVIEWED ? new Date() : item.lastReviewedAt,
            }
          : item
      )
    );
  };

  return (
    <div className="max-w-6xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Knowledge Articles Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Maintain published knowledge entries, monitor verification statuses, and update content
          </p>
        </div>

        <Link
          href="/admin/knowledge/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Knowledge Entry</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Language:</span>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="en">English (EN)</option>
              <option value="bn">বাংলা (BN)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Verification Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value={VerificationStatus.REVIEWED}>Reviewed & Published</option>
              <option value={VerificationStatus.DRAFT}>Draft</option>
              <option value={VerificationStatus.NEEDS_CORRECTION}>Needs Correction</option>
              <option value={VerificationStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
        </div>

        <span className="text-muted-foreground font-mono">
          Showing {filtered.length} of {items.length} Articles
        </span>
      </div>

      {/* Table / List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border font-medium">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Language</th>
                <th className="p-4">Sources</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                  
                  {/* Title */}
                  <td className="p-4 max-w-xs">
                    <span className="font-semibold text-foreground text-sm block leading-snug">
                      {item.title}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      /knowledge/{item.slug}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                      {item.category.name}
                    </span>
                  </td>

                  {/* Language */}
                  <td className="p-4">
                    <span className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {item.language}
                    </span>
                  </td>

                  {/* Sources Count */}
                  <td className="p-4">
                    <span className="font-semibold text-foreground">
                      {item.sources.length} {item.sources.length === 1 ? 'Source' : 'Sources'}
                    </span>
                  </td>

                  {/* Verification Status Selector */}
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as VerificationStatus)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1 border cursor-pointer ${
                        item.status === VerificationStatus.REVIEWED
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : item.status === VerificationStatus.NEEDS_CORRECTION
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : 'bg-secondary text-foreground border-border'
                      }`}
                    >
                      <option value={VerificationStatus.REVIEWED}>Reviewed</option>
                      <option value={VerificationStatus.DRAFT}>Draft</option>
                      <option value={VerificationStatus.NEEDS_CORRECTION}>Needs Correction</option>
                      <option value={VerificationStatus.ARCHIVED}>Archived</option>
                    </select>
                  </td>

                  {/* Last Updated */}
                  <td className="p-4 text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/knowledge/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
