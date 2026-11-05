'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, AlertCircle, Key, RefreshCw } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      // Successful server authentication: HttpOnly cookie set by server
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError('Network communication failure. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <span className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            K
          </span>
          <span className="font-serif font-bold text-2xl text-foreground">Knowra</span>
        </Link>
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
          Editorial & Administration Gateway
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
          Cryptographically authenticated console for verified editors and platform administrators
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-sm">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Registered Email Address</span>
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. editor@knowra.org"
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            <span>{loading ? 'Verifying Credentials...' : 'Sign In to Console'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground underline underline-offset-4">
            ← Return to Public Portal
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground/70">
            Auth: HMAC-SHA256
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">
          Loading authenticated gateway...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
