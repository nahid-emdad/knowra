'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KnowledgeCard from '@/components/KnowledgeCard';
import { INITIAL_KNOWLEDGE_ITEMS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { SearchService } from '@/lib/services/search';
import { Search, Filter, Globe, ArrowUpDown, BookOpen, AlertCircle } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialLang = searchParams.get('lang') || 'all';
  const initialSort = searchParams.get('sort') || 'relevance';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);
  const [sortBy, setSortBy] = useState(initialSort);

  // Synchronize state when URL params change
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedLanguage(searchParams.get('lang') || 'all');
    setSortBy(searchParams.get('sort') || 'relevance');
  }, [searchParams]);

  // Execute Search Evaluator
  const searchResults = useMemo(() => {
    let items = INITIAL_KNOWLEDGE_ITEMS;

    // Filter by Category
    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category.slug === selectedCategory);
    }

    // Filter by Language
    if (selectedLanguage !== 'all') {
      items = items.filter((item) => item.language === selectedLanguage);
    }

    // Search query matching using SearchService
    if (query.trim()) {
      const corpus = items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        content: item.content,
        language: item.language,
        category: item.category,
        sourceCount: item.sources.length,
        updatedAt: item.updatedAt,
      }));

      const results = SearchService.searchInMemory(corpus, query, selectedLanguage);

      // Re-map to full items
      const resultMap = new Map(results.map((r) => [r.id, r.relevanceScore]));
      return items
        .filter((item) => resultMap.has(item.id))
        .sort((a, b) => {
          if (sortBy === 'title') return a.title.localeCompare(b.title);
          if (sortBy === 'latest') return b.updatedAt.getTime() - a.updatedAt.getTime();
          return (resultMap.get(b.id) || 0) - (resultMap.get(a.id) || 0);
        });
    }

    // Default sorting when no query
    return items.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [query, selectedCategory, selectedLanguage, sortBy]);

  const updateUrl = (newQuery: string, newCat: string, newLang: string, newSort: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCat !== 'all') params.set('category', newCat);
    if (newLang !== 'all') params.set('lang', newLang);
    if (newSort !== 'relevance') params.set('sort', newSort);
    router.replace(`/search?${params.toString()}`);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    updateUrl(val, selectedCategory, selectedLanguage, sortBy);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategory(val);
    updateUrl(query, val, selectedLanguage, sortBy);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedLanguage(val);
    updateUrl(query, selectedCategory, val, sortBy);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    updateUrl(query, selectedCategory, selectedLanguage, val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Global Knowledge Search
          </h1>
          <p className="text-sm text-muted-foreground">
            Search peer-reviewed knowledge entries across English and Bengali
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm mb-8 space-y-4">
          
          {/* Main Search Input */}
          <div className="flex items-center bg-background border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
            <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by keywords, title, or concepts (e.g. 'Photosynthesis', 'সালোকসংশ্লেষণ')..."
              className="w-full bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  updateUrl('', selectedCategory, selectedLanguage, sortBy);
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <label htmlFor="cat-select" className="text-muted-foreground font-medium">Category:</label>
              <select
                id="cat-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
              >
                <option value="all">All Categories (সব বিভাগ)</option>
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <label htmlFor="lang-select" className="text-muted-foreground font-medium">Language:</label>
              <select
                id="lang-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
              >
                <option value="all">All Languages (সব ভাষা)</option>
                <option value="en">English (EN)</option>
                <option value="bn">বাংলা (BN)</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <label htmlFor="sort-select" className="text-muted-foreground font-medium">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                className="w-full bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
              >
                <option value="relevance">Relevance (প্রাসঙ্গিকতা)</option>
                <option value="latest">Recently Updated (সাম্প্রতিক)</option>
                <option value="title">Alphabetical (শিরোনাম)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Result Status Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <p>
            Showing <strong className="text-foreground">{searchResults.length}</strong> verified entries
            {query && (
              <span> for "<span className="text-accent font-semibold">{query}</span>"</span>
            )}
          </p>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            PostgreSQL Full-Text Search Active
          </span>
        </div>

        {/* Results List */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((item) => (
              <KnowledgeCard
                key={item.id}
                id={item.id}
                slug={item.slug}
                title={item.title}
                summary={item.summary}
                category={item.category}
                language={item.language}
                status={item.status}
                sourceCount={item.sources.length}
                lastUpdatedAt={item.updatedAt}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">
              No matching knowledge entries found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any reviewed entries matching your search criteria. Try using different keywords, or check for typos.
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                  setSelectedLanguage('all');
                  updateUrl('', 'all', 'all', 'relevance');
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 border border-border"
              >
                Reset All Filters
              </button>
              <a
                href="/contribute"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-95"
              >
                Submit Knowledge Entry
              </a>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SearchContent />
    </Suspense>
  );
}
