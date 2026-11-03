import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KnowledgeCard from '@/components/KnowledgeCard';
import { INITIAL_CATEGORIES, INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { ChevronRight, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INITIAL_CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Find articles under this category
  const articles = INITIAL_KNOWLEDGE_ITEMS.filter((item) => item.category.slug === slug);
  const otherCategories = INITIAL_CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/categories/science" className="hover:text-foreground">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <header className="mb-10 p-8 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-semibold text-accent uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Knowledge Domain</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-3">
            {category.name}
          </h1>

          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>{articles.length} verified entries in this domain</span>
            <Link
              href={`/search?category=${category.slug}`}
              className="text-accent hover:underline font-medium"
            >
              Search within {category.name} →
            </Link>
          </div>
        </header>

        {/* Knowledge Articles in this Category */}
        <section className="mb-16">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
            Published Articles in {category.name}
          </h2>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((item) => (
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
            <div className="p-8 text-center rounded-xl bg-card border border-border text-sm text-muted-foreground">
              <p>No reviewed articles in this category yet.</p>
              <Link
                href="/contribute"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs"
              >
                Be the first to contribute
              </Link>
            </div>
          )}
        </section>

        {/* Other Categories Explorer */}
        <section className="pt-8 border-t border-border">
          <h3 className="text-lg font-serif font-bold text-foreground mb-4">
            Explore Other Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="p-3.5 rounded-lg bg-card border border-border hover:border-foreground/30 text-xs font-medium text-foreground hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
