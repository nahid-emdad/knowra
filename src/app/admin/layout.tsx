'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Layers,
  Bookmark,
  GitBranch,
  LogOut,
  ExternalLink,
  ShieldAlert,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'EDITOR'>('ADMIN');

  useEffect(() => {
    // Check if session cookie exists
    const hasSession = document.cookie.includes('knowra_session');
    if (!hasSession && pathname !== '/admin/login') {
      // Redirect to login if unauthenticated
      router.push('/admin/login');
    }

    if (document.cookie.includes('editor_session')) {
      setRole('EDITOR');
    } else {
      setRole('ADMIN');
    }
  }, [pathname, router]);

  // Don't render sidebar layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    document.cookie = 'knowra_session=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/submissions', label: 'Submissions Queue', icon: CheckSquare, badge: '2' },
    { href: '/admin/knowledge', label: 'Knowledge Items', icon: FileText },
    { href: '/admin/knowledge/new', label: 'Create Article', icon: PlusCircle },
    { href: '/admin/sources', label: 'Verified Sources', icon: Bookmark },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/revisions', label: 'Revision History', icon: GitBranch },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
            K
          </span>
          <span className="font-serif font-bold text-lg">Knowra Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-secondary text-secondary-foreground"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 border-r border-border bg-card/70 flex-shrink-0 flex flex-col justify-between`}
      >
        <div>
          {/* Brand & Role Header */}
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-base flex items-center justify-center shadow-sm">
                K
              </span>
              <div>
                <span className="font-serif font-bold text-lg leading-none block">Knowra</span>
                <span className="text-[10px] text-muted-foreground font-mono">Editorial Console</span>
              </div>
            </Link>

            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Role: {role}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent/20 text-accent font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with Logout & Public Link */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Knowledge Web</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        {children}
      </main>

    </div>
  );
}
