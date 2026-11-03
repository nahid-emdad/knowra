'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, Moon, Sun, Globe, PlusCircle, Menu, X, ExternalLink, Atom, Code } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    // Check initial dark mode from document or prefers-color-scheme
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'bn' : 'en';
    setCurrentLang(nextLang);
    // Dispatch custom event for client components
    window.dispatchEvent(new CustomEvent('knowra-lang-change', { detail: { lang: nextLang } }));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg tracking-tight shadow-sm group-hover:scale-105 transition-transform duration-200">
            K
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-foreground">
                Knowra
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground font-semibold uppercase tracking-wider hidden sm:inline-block">
                Open Source
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-medium hidden sm:inline-block">
              Multilingual Knowledge Infrastructure
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/search"
            className={`flex items-center gap-1.5 hover:text-foreground transition-colors ${
              pathname === '/search' ? 'text-foreground font-semibold' : ''
            }`}
          >
            <Search className="w-4 h-4 text-accent" />
            <span>Search</span>
          </Link>
          <Link
            href="/constellation"
            className={`flex items-center gap-1.5 hover:text-foreground transition-colors ${
              pathname === '/constellation' ? 'text-foreground font-semibold text-accent' : ''
            }`}
          >
            <Atom className="w-4 h-4 text-indigo-500 animate-[spin_12s_linear_infinite]" />
            <span className="flex items-center gap-1">
              Constellation
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20">3D</span>
            </span>
          </Link>
          <Link
            href="/categories/science"
            className={`hover:text-foreground transition-colors ${
              pathname.startsWith('/categories') ? 'text-foreground font-semibold' : ''
            }`}
          >
            <span>Categories</span>
          </Link>
          <Link
            href="/contribute"
            className={`flex items-center gap-1.5 hover:text-foreground transition-colors ${
              pathname === '/contribute' ? 'text-foreground font-semibold' : ''
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Contribute</span>
          </Link>
          <Link
            href="/docs"
            className={`flex items-center gap-1.5 hover:text-foreground transition-colors ${
              pathname === '/docs' ? 'text-foreground font-semibold text-accent' : ''
            }`}
          >
            <Code className="w-4 h-4 text-amber-500" />
            <span>API Docs</span>
          </Link>
          <a
            href="https://github.com/nahid-emdad/knowra"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors text-xs font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
            title="Toggle Language (English / বাংলা)"
          >
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold">{currentLang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            title="Toggle Dark/Light Mode"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-lg border border-border bg-secondary text-secondary-foreground"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-6 py-4 space-y-3 text-sm">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-foreground"
          >
            <Search className="w-4 h-4 text-accent" />
            <span>Search Knowledge</span>
          </Link>
          <Link
            href="/constellation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-foreground"
          >
            <Atom className="w-4 h-4 text-indigo-500" />
            <span>Spatial Constellation (Graph)</span>
          </Link>
          <Link
            href="/categories/science"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-foreground"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span>Browse Categories</span>
          </Link>
          <Link
            href="/contribute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-foreground"
          >
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            <span>Contribute Knowledge</span>
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-1 text-foreground"
          >
            <Code className="w-4 h-4 text-amber-500" />
            <span>Developer API & Docs</span>
          </Link>
          <a
            href="https://github.com/nahid-emdad/knowra"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 py-1 text-muted-foreground text-xs font-mono"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </header>
  );
}
