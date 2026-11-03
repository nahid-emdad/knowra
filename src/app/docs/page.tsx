'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Terminal,
  Code,
  Copy,
  Check,
  Play,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Clock,
} from 'lucide-react';

interface EndpointSpec {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  category: 'Knowledge' | 'Search' | 'Categories' | 'Sources' | 'AI Services';
  description: string;
  defaultParams?: Record<string, string>;
  defaultBody?: string;
  sampleResponse: unknown;
}

const ENDPOINTS: EndpointSpec[] = [
  {
    id: 'search',
    method: 'GET',
    path: '/api/v1/search',
    title: 'Multilingual Knowledge Search',
    category: 'Search',
    description: 'Query verified articles with full Bengali Unicode inflection support and English tokenization.',
    defaultParams: {
      q: 'Photosynthesis',
      language: 'all',
      limit: '5',
      sort: 'relevance',
    },
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'k_photo_01',
          slug: 'photosynthesis-process',
          title: 'Photosynthesis: Biochemical Mechanism and Energy Transduction',
          summary: 'Photosynthesis converts solar light into chemical energy inside plant chloroplast thylakoids.',
          language: 'en',
          sourceCount: 3,
        },
      ],
      meta: {
        query: 'Photosynthesis',
        detectedLanguage: 'all',
        sort: 'relevance',
        page: 1,
        limit: 5,
        total: 1,
        totalPages: 1,
        version: '1.0.0',
      },
    },
  },
  {
    id: 'list-knowledge',
    method: 'GET',
    path: '/api/v1/knowledge',
    title: 'List Published Knowledge Items',
    category: 'Knowledge',
    description: 'Returns a paginated list of peer-reviewed knowledge entries with category and tag filters.',
    defaultParams: {
      category: 'science',
      limit: '5',
    },
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'k_photo_01',
          slug: 'photosynthesis-process',
          title: 'Photosynthesis: Biochemical Mechanism and Energy Transduction',
          category: { id: 'cat_science', name: 'Science', slug: 'science' },
          language: 'en',
          status: 'REVIEWED',
        },
      ],
      meta: { page: 1, limit: 5, total: 6, totalPages: 2, version: '1.0.0' },
    },
  },
  {
    id: 'get-knowledge-slug',
    method: 'GET',
    path: '/api/v1/knowledge/photosynthesis-process',
    title: 'Retrieve Knowledge Item by Slug',
    category: 'Knowledge',
    description: 'Returns complete article body, primary verified citations, translations, and AI summaries.',
    defaultParams: {},
    sampleResponse: {
      success: true,
      data: {
        id: 'k_photo_01',
        slug: 'photosynthesis-process',
        title: 'Photosynthesis: Biochemical Mechanism and Energy Transduction',
        summary: 'Photochemical mechanism converting carbon dioxide and water into glucose and oxygen.',
        content: '# Photosynthesis\n\nPhotosynthesis is a fundamental biological process...',
        language: 'en',
        status: 'REVIEWED',
        revisionNumber: 4,
        sources: [
          {
            source: {
              publisher: 'Nature Publishing Group',
              url: 'https://www.nature.com/articles/nature08431',
              sourceType: 'RESEARCH_PAPER',
            },
            supportingNote: 'Volume 461, pp 123-130',
          },
        ],
      },
    },
  },
  {
    id: 'list-categories',
    method: 'GET',
    path: '/api/v1/categories',
    title: 'List Disciplines & Categories',
    category: 'Categories',
    description: 'Retrieve all knowledge taxonomy categories and published article counts.',
    defaultParams: {},
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'cat_science',
          name: 'Science',
          slug: 'science',
          description: 'Empirical knowledge, physics, chemistry, and biology.',
          itemCount: 4,
        },
        {
          id: 'cat_technology',
          name: 'Technology',
          slug: 'technology',
          description: 'Computing, software engineering, and digital systems.',
          itemCount: 2,
        },
      ],
      meta: { total: 12, version: '1.0.0' },
    },
  },
  {
    id: 'list-sources',
    method: 'GET',
    path: '/api/v1/sources',
    title: 'Verified Sources Registry',
    category: 'Sources',
    description: 'Query authoritative primary sources (Nature, NASA, Banglapedia, UNESCO) cited across the knowledge base.',
    defaultParams: {
      type: 'RESEARCH_PAPER',
    },
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'src_nature_01',
          publisher: 'Nature Publishing Group',
          title: 'Structure and mechanism of the photosynthetic reaction center',
          url: 'https://www.nature.com/articles/nature08431',
          sourceType: 'RESEARCH_PAPER',
          license: 'Academic / Peer-Reviewed',
        },
      ],
      meta: { total: 1, version: '1.0.0' },
    },
  },
  {
    id: 'ai-summarize',
    method: 'POST',
    path: '/api/v1/ai/summarize',
    title: 'AI Source-Grounded Summarization',
    category: 'AI Services',
    description: 'Generates objective executive summary strictly from source text. Marked with isAiGenerated: true.',
    defaultBody: JSON.stringify(
      {
        content:
          'Photosynthesis occurs inside chloroplasts where chlorophyll pigments absorb solar photons. In the light-dependent reactions within thylakoids, water is split generating ATP and NADPH while liberating oxygen. In the Calvin cycle, carbon dioxide is reduced to glucose.',
        language: 'en',
        maxLength: 150,
      },
      null,
      2
    ),
    sampleResponse: {
      success: true,
      data: {
        summary:
          'Photosynthesis is a solar energy conversion process in plant chloroplasts that produces ATP, NADPH, and glucose while releasing oxygen.',
        provider: 'mock',
        isAiGenerated: true,
      },
    },
  },
  {
    id: 'ai-simplify',
    method: 'POST',
    path: '/api/v1/ai/simplify',
    title: 'AI Reading Level Simplification',
    category: 'AI Services',
    description: 'Simplifies complex concepts for elementary students (সহজ পাঠ), high schoolers, or general readers.',
    defaultBody: JSON.stringify(
      {
        content:
          'Quantum superposition allows particles to exist in linear combinations of orthogonal eigenstates until quantum wave function collapse occurs upon measurement.',
        targetReadingLevel: 'elementary',
        language: 'en',
      },
      null,
      2
    ),
    sampleResponse: {
      success: true,
      data: {
        simplifiedContent:
          'Think of a spinning coin. While it is spinning, it is both heads and tails at the same time. Only when you stop it does it choose one side! In the tiny quantum world, things can be in two states until we look at them.',
        readingLevel: 'elementary',
        isAiGenerated: true,
      },
    },
  },
];

export default function DeveloperDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec>(ENDPOINTS[0]);
  const [queryParams, setQueryParams] = useState<Record<string, string>>(
    selectedEndpoint.defaultParams || {}
  );
  const [requestBody, setRequestBody] = useState<string>(selectedEndpoint.defaultBody || '');
  const [languageTab, setLanguageTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  // Live Playground State
  const [isRunning, setIsRunning] = useState(false);
  const [liveResponse, setLiveResponse] = useState<unknown | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleSelectEndpoint = (ep: EndpointSpec) => {
    setSelectedEndpoint(ep);
    setQueryParams(ep.defaultParams || {});
    setRequestBody(ep.defaultBody || '');
    setLiveResponse(null);
    setStatusCode(null);
    setLatencyMs(null);
  };

  const getEffectiveUrl = () => {
    let url = selectedEndpoint.path;
    if (selectedEndpoint.method === 'GET' && Object.keys(queryParams).length > 0) {
      const search = new URLSearchParams(queryParams).toString();
      if (search) url += `?${search}`;
    }
    return url;
  };

  const handleExecuteRequest = async () => {
    setIsRunning(true);
    const start = performance.now();
    try {
      const url = getEffectiveUrl();
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Knowra-Key': 'knowra_demo_key_2026',
        },
      };
      if (selectedEndpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }
      const res = await fetch(url, options);
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setStatusCode(res.status);
      setLatencyMs(elapsed);
      setLiveResponse(data);
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - start);
      setStatusCode(500);
      setLatencyMs(elapsed);
      setLiveResponse({ error: 'Network request failed', details: String(err) });
    } finally {
      setIsRunning(false);
    }
  };

  const generateSnippet = () => {
    const url = `https://knowra.org${getEffectiveUrl()}`;
    if (languageTab === 'curl') {
      if (selectedEndpoint.method === 'GET') {
        return `curl -X GET "${url}" \\\n  -H "Accept: application/json" \\\n  -H "X-Knowra-Key: your_api_key"`;
      }
      return `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Knowra-Key: your_api_key" \\\n  -d '${requestBody.replace(/\n/g, '')}'`;
    }

    if (languageTab === 'js') {
      if (selectedEndpoint.method === 'GET') {
        return `const response = await fetch("${url}", {\n  headers: {\n    "Accept": "application/json",\n    "X-Knowra-Key": "your_api_key"\n  }\n});\nconst result = await response.json();\nconsole.log(result.data);`;
      }
      return `const response = await fetch("${url}", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "X-Knowra-Key": "your_api_key"\n  },\n  body: JSON.stringify(${requestBody.trim() || '{}'})\n});\nconst result = await response.json();\nconsole.log(result.data);`;
    }

    if (languageTab === 'python') {
      if (selectedEndpoint.method === 'GET') {
        return `import requests\n\nurl = "${url}"\nheaders = {"X-Knowra-Key": "your_api_key"}\n\nresponse = requests.get(url, headers=headers)\ndata = response.json()\nprint(data["data"])`;
      }
      return `import requests\n\nurl = "${url}"\nheaders = {"Content-Type": "application/json", "X-Knowra-Key": "your_api_key"}\npayload = ${requestBody.trim() || '{}'}\n\nresponse = requests.post(url, headers=headers, json=payload)\ndata = response.json()\nprint(data["data"])`;
    }

    return '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Hero Header */}
        <div className="mb-10 pb-8 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold border border-indigo-500/20">
                  Module B: Public Developer API
                </span>
                <span className="text-xs font-mono text-muted-foreground">Version 1.0.0</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Apache 2.0
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
                Knowra Developer Platform & API
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-3xl leading-relaxed">
                Connect educational applications, research bots, and knowledge tools to our verified,
                multilingual knowledge infrastructure. Zero vendor lock-in. 100% source-backed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/api/v1/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-mono border border-border flex items-center gap-1.5 transition-colors"
              >
                <span>OpenAPI 3.1 Spec</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/constellation"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>3D Constellation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics & Architecture Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60 text-xs">
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Base Endpoint</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">/api/v1</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Rate Limit</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">60 req/min (Anon) • 120 (Key)</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Epistemic Truth</span>
              <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Primary Sources (PRD 5.3)
              </p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Languages</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">English (EN) & Bengali (BN)</p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Endpoints Directory */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                API Endpoints Directory
              </h3>
              <span className="text-xs font-mono text-muted-foreground">{ENDPOINTS.length} Operations</span>
            </div>

            <div className="space-y-1.5">
              {ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between group ${
                      isSelected
                        ? 'bg-secondary border-accent/40 shadow-sm'
                        : 'bg-card/50 border-border hover:bg-card hover:border-border/80'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ep.method === 'GET'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-semibold text-foreground truncate">{ep.title}</span>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground truncate">{ep.path}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {ep.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Architecture Card */}
            <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs space-y-2 mt-6">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Epistemic Integrity Notice</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                All knowledge responses returned by this API are strictly anchored to verified citations. AI
                summaries are marked with <code className="text-[10px] font-mono bg-secondary px-1 py-0.5 rounded">isAiGenerated: true</code> and
                kept decoupled from canonical content.
              </p>
            </div>
          </div>

          {/* Right Column: Endpoint Specification & Interactive Sandbox */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header of Active Endpoint */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-semibold text-foreground">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground">
                  {selectedEndpoint.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                {selectedEndpoint.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedEndpoint.description}
              </p>

              {/* URL Preview & Run Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-border">
                <div className="flex-1 font-mono text-xs p-3 rounded-xl bg-background border border-border truncate text-foreground/90">
                  <span className="text-muted-foreground select-none">https://knowra.org</span>
                  <span className="text-accent font-semibold">{getEffectiveUrl()}</span>
                </div>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isRunning}
                  className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isRunning ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>{isRunning ? 'Sending...' : 'Test Request Live'}</span>
                </button>
              </div>
            </div>

            {/* Query Parameters or Body Editor */}
            {selectedEndpoint.method === 'GET' && Object.keys(queryParams).length > 0 && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-muted-foreground">
                  Query Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(queryParams).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground font-medium">{key}</label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEndpoint.method === 'POST' && (
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-muted-foreground">
                  JSON Request Payload
                </h4>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Code Snippets Section (cURL / JS / Python) */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguageTab('curl')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      languageTab === 'curl'
                        ? 'bg-secondary text-foreground font-semibold border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setLanguageTab('js')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      languageTab === 'js'
                        ? 'bg-secondary text-foreground font-semibold border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    JavaScript (Fetch)
                  </button>
                  <button
                    onClick={() => setLanguageTab('python')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      languageTab === 'python'
                        ? 'bg-secondary text-foreground font-semibold border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Python (Requests)
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(generateSnippet())}
                  className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1"
                  title="Copy code snippet"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-border/40">
                <pre>{generateSnippet()}</pre>
              </div>
            </div>

            {/* Live Response Sandbox / Console */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                    Response Output
                  </span>
                  {statusCode !== null && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        statusCode >= 200 && statusCode < 300
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      HTTP {statusCode}
                    </span>
                  )}
                  {latencyMs !== null && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {latencyMs}ms
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-muted-foreground">
                  {liveResponse ? 'Live Output' : 'Sample Specification Output'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[380px] border border-border/40">
                <pre>{JSON.stringify(liveResponse || selectedEndpoint.sampleResponse, null, 2)}</pre>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
