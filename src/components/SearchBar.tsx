'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialQuery = '',
  placeholder = "Search verified knowledge (e.g. 'Photosynthesis', 'সালোকসংশ্লেষণ', 'Solar')...",
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  // Listen to keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('knowra-global-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="flex items-center bg-card border border-border rounded-xl shadow-sm hover:border-foreground/20 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all px-4 py-3 sm:py-3.5">
        <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
        <input
          id="knowra-global-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
        />
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0 ml-2">
          <kbd className="px-2 py-0.5 rounded bg-secondary text-[11px] font-mono text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </div>
      </div>
    </form>
  );
}
