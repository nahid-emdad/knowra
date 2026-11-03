'use client';

import React, { useState } from 'react';
import { INITIAL_CATEGORIES, StaticCategory } from '@/lib/data/initial-data';
import { slugify } from '@/lib/validations';
import {
  Layers,
  PlusCircle,
  CheckCircle,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<StaticCategory[]>(INITIAL_CATEGORIES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [notice, setNotice] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setFormData({
      ...formData,
      name: val,
      slug: slugify(val),
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newCat: StaticCategory = {
      id: `cat_${Date.now()}`,
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      description: formData.description,
      itemCount: 0,
    };

    setCategories([...categories, newCat]);
    setShowAddForm(false);
    setNotice(`Category "${newCat.name}" added successfully.`);
    setTimeout(() => setNotice(null), 3000);
    setFormData({ name: '', slug: '', description: '' });
  };

  return (
    <div className="max-w-6xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Knowledge Domains & Taxonomy Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize knowledge hierarchy, parent-child disciplines, and domain descriptions
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add Knowledge Domain'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddCategory} className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            <span>Create New Category</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Neuroscience"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">URL Slug (Auto) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Scope & Description *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Define the disciplinary scope of this category..."
              className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-accent"
            />
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
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-card border border-border hover:border-foreground/30 transition-all flex flex-col justify-between shadow-sm space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] text-muted-foreground">
                  /{cat.slug}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary text-foreground font-semibold">
                  {cat.itemCount} Entries
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <a
                href={`/categories/${cat.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
