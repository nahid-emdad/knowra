import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import KnowledgeCard from '@/components/KnowledgeCard';
import { INITIAL_CATEGORIES, INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import {
  ShieldCheck,
  Languages,
  BookOpen,
  ArrowRight,
  Terminal,
  Sparkles,
  ExternalLink,
  Layers,
  Atom,
} from 'lucide-react';

export default function HomePage() {
  const featuredArticles = INITIAL_KNOWLEDGE_ITEMS;
  const categories = INITIAL_CATEGORIES;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION (Search is the Primary Visual Focus) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/60">
          
          {/* Subtle architectural background accents */}
          <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-6 relative text-center">
            
            {/* Status / Vision Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open Source Multilingual Knowledge Infrastructure</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-foreground mb-6 leading-[1.15]">
              Knowledge Without Boundaries.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Discover, understand, and share reliable knowledge in your language. 
              Every published entry is anchored to primary, verified sources.
            </p>

            {/* PRIMARY SEARCH BAR */}
            <div className="max-w-2xl mx-auto mb-6">
              <SearchBar placeholder="Search verified knowledge (e.g. 'Photosynthesis', 'সালোকসংশ্লেষণ', 'Solar')..." />
            </div>

            {/* Popular Quick Search Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70">Popular Topics:</span>
              <Link href="/search?q=photosynthesis" className="hover:text-foreground underline underline-offset-4">Photosynthesis</Link>
              <span>•</span>
              <Link href="/search?q=সালোকসংশ্লেষণ" className="hover:text-foreground underline underline-offset-4">সালোকসংশ্লেষণ</Link>
              <span>•</span>
              <Link href="/search?q=solar" className="hover:text-foreground underline underline-offset-4">Solar System</Link>
              <span>•</span>
              <Link href="/search?q=quantum" className="hover:text-foreground underline underline-offset-4">Quantum</Link>
              <span>•</span>
              <Link href="/search?q=ভাষা" className="hover:text-foreground underline underline-offset-4">ভাষা আন্দোলন</Link>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/search"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Explore All Knowledge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/constellation"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 border border-indigo-500/30 group"
              >
                <Atom className="w-4 h-4 text-indigo-200 group-hover:rotate-180 transition-transform duration-500" />
                <span>Spatial Constellation (Graph)</span>
              </Link>
              <Link
                href="/contribute"
                className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 border border-border transition-all"
              >
                Contribute Knowledge
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BROWSE BY CATEGORY SECTION */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-border">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Knowledge Domains & Categories
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore structured disciplines across natural sciences, humanities, and technology
              </p>
            </div>
            <Link
              href="/categories/science"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View all 12 categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-foreground/30 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-base text-foreground group-hover:text-accent transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono">{cat.itemCount} Entries</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SPATIAL CONSTELLATION SPOTLIGHT BANNER (Interactive Graph & Node Dossier) */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-medium border border-indigo-500/30 mb-3">
                  <Atom className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>Direction 3 Selected • Interactive Node Dossier</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  Explore via Spatial Knowledge Constellation
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Navigate multidisciplinary knowledge as an interactive SVG particle graph. Click any node to open the live scientific dossier with real-time chemical formulas, bilingual Bengali/English translations, and direct peer-reviewed citations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/constellation"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Launch Constellation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="/prototype.html"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Inspect Switcher Prototype</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURED BILINGUAL KNOWLEDGE ARTICLES (ASYMMETRIC BENTO) */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Peer-Reviewed
                </span>
                <span className="text-xs text-muted-foreground">English & Bengali</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Featured Knowledge Entries
              </h2>
            </div>
            <Link
              href="/search"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>Search knowledge database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((item) => (
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
        </section>

        {/* ========================================================================= */}
        {/* CORE ARCHITECTURAL PILLARS (TRUST & TRANSPARENCY) */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
              Not Another AI Wrapper. A Structured Infrastructure.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Knowra is engineered on strict epistemological principles: human oversight, source transparency, and language accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">Source-Backed Publishing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every published item must contain at least one verifiable primary source from academic journals, official docs, or accredited institutions. Zero fabricated references.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground mb-4">
                <Languages className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">Native Multilingual Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dedicated Bengali and English pipelines. Custom PostgreSQL trigram search tokenizes Bengali Unicode scripts, inflections, and conjuncts accurately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-base mb-2">Decoupled AI Enhancement</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI aids in summarization and translation drafts, but never publishes automatically. The core knowledge platform operates 100% without external AI API keys.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
