import Link from 'next/link';
import { BookOpen, ShieldCheck, Languages, Terminal, ExternalLink } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg tracking-tight">
              K
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight leading-none">Knowra</span>
              <span className="text-[11px] text-muted-foreground tracking-wider uppercase font-medium">
                Multilingual Knowledge Infrastructure
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Phase 1: Foundation Active
            </span>
            <a
              href="https://github.com/nahid-emdad/knowra"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition-colors"
            >
              GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        {/* Foundation Hero Notice */}
        <div className="space-y-4 mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono font-medium">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            TASK-001: Project Foundation Initialized
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground">
            Knowledge Without Boundaries.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Discover, understand, and share reliable knowledge in your language. 
            An open, verified knowledge infrastructure engineered for humans, educators, and developers.
          </p>
        </div>

        {/* Core Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all duration-200">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-foreground mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold mb-2">Source-Backed Transparency</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every published knowledge entry is linked to primary academic, institutional, or official documentation. No unverified hallucinated citations.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all duration-200">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-foreground mb-4">
              <Languages className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-base font-semibold mb-2">Multilingual By Design</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              First-class English and Bengali (বাংলা) support. Dedicated full-text trigram indexing ensuring accurate Bengali search morphology.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all duration-200">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-foreground mb-4">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base font-semibold mb-2">Open Infrastructure</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apache 2.0 licensed, developer-ready REST APIs, PostgreSQL backend with Prisma ORM, and optional decoupled AI provider abstraction.
            </p>
          </div>
        </div>

        {/* Foundation Status & Quick Reference */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Development Specifications & Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Module A: Knowra Web</p>
                <p className="text-xs text-muted-foreground">Knowledge discovery, bilingual article reader, category explorer.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Module B: Knowra API</p>
                <p className="text-xs text-muted-foreground">Public versioned REST endpoints (`/api/v1`) with rate limiting.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Module C: Knowra Community</p>
                <p className="text-xs text-muted-foreground">Peer submissions, revision histories, and administrative review.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <p className="font-medium text-foreground">Decoupled AI Engine</p>
                <p className="text-xs text-muted-foreground">Pluggable provider interface; operates seamlessly without AI credentials.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>Knowra — Open Source Multilingual Knowledge Infrastructure. Licensed under Apache-2.0.</p>
      </footer>
    </div>
  );
}
