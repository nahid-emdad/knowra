'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@knowra.org');
  const [password, setPassword] = useState('knowra_admin_2026');
  const [role, setRole] = useState<'ADMIN' | 'EDITOR'>('ADMIN');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    // Set authentication session cookie for demo / MVP
    const cookieValue = role === 'ADMIN' ? 'admin_session' : 'editor_session';
    document.cookie = `knowra_session=${cookieValue}; path=/; max-age=604800; SameSite=Lax`;

    setTimeout(() => {
      setStatus('idle');
      router.push('/admin');
    }, 400);
  };

  const selectDemoRole = (selected: 'ADMIN' | 'EDITOR') => {
    setRole(selected);
    if (selected === 'ADMIN') {
      setEmail('admin@knowra.org');
      setPassword('knowra_admin_2026');
    } else {
      setEmail('editor@knowra.org');
      setPassword('knowra_editor_2026');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center">
            K
          </span>
          <span className="font-serif font-bold text-2xl text-foreground">Knowra</span>
        </Link>
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
          Editorial & Admin Console
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Server-authenticated access for editorial reviewers and system administrators
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-sm">
        
        {/* Role Preset Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => selectDemoRole('ADMIN')}
            className={`py-2 rounded-lg transition-all ${
              role === 'ADMIN'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Administrator
          </button>
          <button
            type="button"
            onClick={() => selectDemoRole('EDITOR')}
            className={`py-2 rounded-lg transition-all ${
              role === 'EDITOR'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Editorial Reviewer
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <Key className="w-4 h-4" />
            <span>{status === 'loading' ? 'Authenticating...' : 'Sign In to Console'}</span>
          </button>

        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground underline underline-offset-4">
            ← Return to Public Knowledge Portal
          </Link>
        </div>

      </div>

    </div>
  );
}
