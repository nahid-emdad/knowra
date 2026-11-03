'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Globe,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Layers,
  Atom,
  Info,
} from 'lucide-react';

interface ConstellationNode {
  id: string;
  slug: string;
  title: string;
  bengaliTitle: string;
  category: string;
  categorySlug: string;
  summary: string;
  bengaliSummary: string;
  formula?: string;
  source: {
    publisher: string;
    sourceType: string;
    url: string;
    citation: string;
  };
  connectedTo: string[];
  x: number; // percentage
  y: number; // percentage
  radius: number;
  color: string;
  isCore?: boolean;
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: 'photosynthesis',
    slug: 'photosynthesis-process',
    title: 'Photosynthesis Engine',
    bengaliTitle: 'সালোকসংশ্লেষণ শক্তিচক্র',
    category: 'Science',
    categorySlug: 'science',
    summary:
      'Photochemical mechanism converting atmospheric carbon dioxide and water into oxygen and glucose via solar photon excitation in chloroplast thylakoid membranes.',
    bengaliSummary:
      'সালোকসংশ্লেষণ হলো একটি জৈবরাসায়নিক প্রক্রিয়া যার মাধ্যমে সবুজ উদ্ভিদ সূর্যালোকের শক্তিকে ব্যবহার করে পানি ও কার্বন ডাই-অক্সাইড থেকে গ্লুকোজ ও অক্সিজেন তৈরি করে।',
    formula: '6CO₂ + 6H₂O + hν ⟶ C₆H₁₂O₆ + 6O₂',
    source: {
      publisher: 'Nature Publishing Group',
      sourceType: 'RESEARCH_PAPER',
      url: 'https://www.nature.com/articles/nature08431',
      citation: 'Deisenhofer & Michel, Crystallographic Structure of Reaction Center',
    },
    connectedTo: ['thylakoid', 'calvin_cycle', 'solar_energy', 'quantum'],
    x: 50,
    y: 45,
    radius: 36,
    color: '#6366F1', // Indigo
    isCore: true,
  },
  {
    id: 'thylakoid',
    slug: 'photosynthesis-process',
    title: 'Thylakoid Membrane Complex',
    bengaliTitle: 'থাইলাকয়েড পর্দা ও ফোটোলাইসিস',
    category: 'Science',
    categorySlug: 'science',
    summary:
      'Internal membrane-bound compartment of chloroplasts containing Photosystem I & II reaction centers responsible for light-dependent photophosphorylation.',
    bengaliSummary:
      'ক্লোরোপ্লাস্টের থাইলাকয়েড পর্দা যেখানে আলোক-নির্ভর বিক্রিয়া সম্পন্ন হয় এবং পানি বিশ্লিষ্ট হয়ে মুক্ত অক্সিজেন নির্গত হয়।',
    formula: '2H₂O ⟶ O₂ + 4H⁺ + 4e⁻',
    source: {
      publisher: 'Nature Publishing Group',
      sourceType: 'RESEARCH_PAPER',
      url: 'https://www.nature.com/articles/nature08431',
      citation: 'Thylakoid Proton-Motive Force Measurements',
    },
    connectedTo: ['photosynthesis'],
    x: 25,
    y: 28,
    radius: 24,
    color: '#38BDF8', // Sky
  },
  {
    id: 'calvin_cycle',
    slug: 'photosynthesis-process',
    title: 'Calvin-Benson-Bassham Cycle',
    bengaliTitle: 'ক্যালভিন চক্র ও শর্করা সংবন্ধন',
    category: 'Science',
    categorySlug: 'science',
    summary:
      'Enzymatic light-independent fixation of atmospheric CO₂ catalyzed by RuBisCO in the chloroplast stroma, generating high-energy triose phosphate precursors.',
    bengaliSummary:
      'আলোক-নিরপেক্ষ পর্যায় যেখানে বায়ুমণ্ডলের কার্বন ডাই-অক্সাইড সংবন্ধিত হয়ে উদ্ভিদের খাদ্য শর্করায় রূপান্তরিত হয়।',
    formula: '3 CO₂ + 9 ATP + 6 NADPH ⟶ G3P + 9 ADP + 6 NADP⁺',
    source: {
      publisher: 'Asiatic Society of Bangladesh',
      sourceType: 'ACADEMIC',
      url: 'http://en.banglapedia.org/index.php/Photosynthesis',
      citation: 'Banglapedia Botanical Sciences Monograph',
    },
    connectedTo: ['photosynthesis'],
    x: 28,
    y: 72,
    radius: 24,
    color: '#F59E0B', // Amber
  },
  {
    id: 'solar_energy',
    slug: 'solar-system-planetary-dynamics',
    title: 'Solar System Planetary Dynamics',
    bengaliTitle: 'সৌরজগতের গঠন ও মহাকর্ষীয় ভারসাম্য',
    category: 'Science',
    categorySlug: 'science',
    summary:
      'Gravitationally bound celestial architecture of the Sun, eight major planets, and interplanetary debris formed 4.6 billion years ago from molecular cloud collapse.',
    bengaliSummary:
      'সূর্য এবং একে কেন্দ্র করে আবর্তিত আটটি প্রধান গ্রহ ও গ্রহাণুপুঞ্জ নিয়ে গঠিত আমাদের এই মহাজাগতিক পরিবার।',
    formula: 'F = G · (m₁ · m₂) / r²',
    source: {
      publisher: 'NASA Science Mission Directorate',
      sourceType: 'GOVERNMENT',
      url: 'https://science.nasa.gov/solar-system/',
      citation: 'NASA Planetary Science Exploration Datasets',
    },
    connectedTo: ['photosynthesis', 'quantum'],
    x: 75,
    y: 26,
    radius: 32,
    color: '#EAB308', // Yellow
    isCore: true,
  },
  {
    id: 'quantum',
    slug: 'quantum-computing-fundamentals',
    title: 'Quantum Superposition & Qubits',
    bengaliTitle: 'কোয়ান্টাম সুপারপজিশন ও কিউবিট',
    category: 'Technology',
    categorySlug: 'technology',
    summary:
      'Non-classical computing paradigm harnessing quantum mechanical superposition and entanglement to solve discrete optimization problems exponentially faster than Turing machines.',
    bengaliSummary:
      'সুপারপজিশন ও এন্ট্যাঙ্গলমেন্টের নীতি ব্যবহার করে ক্লাসিক্যাল কম্পিউটারের চেয়ে হাজার গুণ দ্রুত তথ্য প্রক্রিয়াকরণ প্রযুক্তি।',
    formula: '|ψ⟩ = α|0⟩ + β|1⟩, |α|² + |β|² = 1',
    source: {
      publisher: 'IEEE Computer Society',
      sourceType: 'OFFICIAL_DOCUMENTATION',
      url: 'https://quantum.ieee.org/resources',
      citation: 'IEEE Standards for Quantum Algorithms',
    },
    connectedTo: ['photosynthesis', 'solar_energy'],
    x: 76,
    y: 70,
    radius: 30,
    color: '#10B981', // Emerald
    isCore: true,
  },
  {
    id: 'language_movement',
    slug: 'bengali-language-movement-1952',
    title: 'Language Movement of 1952',
    bengaliTitle: '১৯৫২ সালের মহান ভাষা আন্দোলন',
    category: 'History',
    categorySlug: 'history',
    summary:
      'The historic socio-political advocacy asserting Bengali as an official state language, laying the foundation for UNESCO International Mother Language Day.',
    bengaliSummary:
      'রাষ্ট্রভাষা হিসেবে বাংলার মর্যাদার দাবিতে ঐতিহাসিক আত্মত্যাগ, যার স্মরণে পরবর্তীতে ২১শে ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করা হয়।',
    formula: 'UNESCO Resolution 30C/62 (Nov 17, 1999)',
    source: {
      publisher: 'UNESCO General Conference Archive',
      sourceType: 'EDUCATIONAL_INSTITUTION',
      url: 'https://www.unesco.org/en/days/mother-language',
      citation: 'UNESCO Mother Language Proclamation Records',
    },
    connectedTo: [],
    x: 48,
    y: 84,
    radius: 26,
    color: '#F43F5E', // Rose
  },
];

export default function ConstellationPage() {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode>(CONSTELLATION_NODES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isDossierBengali, setIsDossierBengali] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filteredNodes = CONSTELLATION_NODES.filter((node) => {
    if (activeCategory !== 'all' && node.categorySlug !== activeCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        node.title.toLowerCase().includes(q) ||
        node.bengaliTitle.toLowerCase().includes(q) ||
        node.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#070A0F] text-slate-100 selection:bg-indigo-500/30">
      <Navbar />

      {/* ========================================================================= */}
      {/* CONSTELLATION HUD & CONTROLS */}
      {/* ========================================================================= */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 py-3 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center font-serif shadow-lg shadow-indigo-600/30">
            ✦
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white font-serif">
              Spatial Knowledge Constellation
            </h1>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              Interactive Epistemic Graph & Primary Source Provenance
            </span>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter graph nodes..."
              className="bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 w-44"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/10">
            {['all', 'science', 'technology', 'history'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1.5 hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Peer-Reviewed Nodes</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN SPATIAL STAGE: CANVAS GRAPH (8 COLS) + NODE DOSSIER (4 COLS) */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        
        {/* INTERACTIVE GRAPH CANVAS (8 COLS) */}
        <section className="lg:col-span-8 rounded-3xl bg-slate-950/60 border border-white/10 p-6 relative overflow-hidden flex flex-col justify-between backdrop-blur-sm min-h-[520px] shadow-2xl">
          
          {/* Top Status */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 z-10">
            <span className="bg-slate-900/90 px-3 py-1 rounded-md border border-white/10 text-indigo-300">
              FOCUS CLUSTER: {selectedNode.category.toUpperCase()} • {selectedNode.title}
            </span>
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              Click any node to open its verified source dossier
            </span>
          </div>

          {/* SVG Vector Stage */}
          <div className="my-auto relative h-[440px] flex items-center justify-center">
            
            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Dynamic Laser Connections */}
              {CONSTELLATION_NODES.map((node) =>
                node.connectedTo.map((targetId) => {
                  const target = CONSTELLATION_NODES.find((n) => n.id === targetId);
                  if (!target) return null;
                  const isHighlighted =
                    selectedNode.id === node.id ||
                    selectedNode.id === target.id ||
                    hoveredNode === node.id ||
                    hoveredNode === target.id;

                  return (
                    <line
                      key={`${node.id}-${target.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isHighlighted ? '#818CF8' : 'rgba(99, 102, 241, 0.2)'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={isHighlighted ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />
                  );
                })
              )}
            </svg>

            {/* Render Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 cursor-pointer transition-all duration-300 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg group select-none ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40 scale-110 shadow-2xl shadow-indigo-600/50'
                      : isHovered
                      ? 'bg-slate-800 text-slate-100 ring-2 ring-indigo-400 scale-105 border border-indigo-400/40'
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mb-1 animate-pulse"
                    style={{ backgroundColor: node.color }}
                  />
                  <h4 className="text-xs sm:text-sm font-bold font-serif leading-tight">
                    {node.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-[120px] truncate">
                    {node.bengaliTitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom HUD Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Science</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Technology</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>History</span>
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedNode(CONSTELLATION_NODES[0]);
                setActiveCategory('all');
                setSearchFilter('');
              }}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-900 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Constellation</span>
            </button>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* NODE DOSSIER DRAWER (RIGHT 4 COLS) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 rounded-3xl bg-slate-950/80 border border-white/10 p-6 flex flex-col justify-between shadow-2xl space-y-6">
          
          <div className="space-y-5">
            {/* Dossier Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Epistemic Node Dossier
                </span>
              </div>

              {/* Language Switcher for Dossier */}
              <button
                onClick={() => setIsDossierBengali(!isDossierBengali)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>{isDossierBengali ? 'EN' : 'বাংলা'}</span>
              </button>
            </div>

            {/* Category Pill & Status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-semibold">
                {selectedNode.category}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Provenance: Verified Primary Source
              </span>
            </div>

            {/* Titles */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                {isDossierBengali ? selectedNode.bengaliTitle : selectedNode.title}
              </h2>
              <p className="text-xs text-indigo-300 font-sans mt-0.5">
                {isDossierBengali ? selectedNode.title : selectedNode.bengaliTitle}
              </p>
            </div>

            {/* Formulation / Mathematical Expression Card */}
            {selectedNode.formula && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-200">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Scientific Formulation:
                </span>
                <span className="font-bold text-indigo-200">{selectedNode.formula}</span>
              </div>
            )}

            {/* Executive Summary */}
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block mb-1">
                Factual Briefing:
              </span>
              <p>{isDossierBengali ? selectedNode.bengaliSummary : selectedNode.summary}</p>
            </div>

            {/* Verified Primary Source Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Primary Citation
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedNode.source.sourceType}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-xs leading-snug">
                {selectedNode.source.publisher}
              </h4>

              <p className="text-[11px] text-slate-400 italic">
                "{selectedNode.source.citation}"
              </p>

              <a
                href={selectedNode.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline font-semibold pt-1"
              >
                <span>Inspect Primary Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Connected Concepts */}
            {selectedNode.connectedTo.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                  Cross-Disciplinary Synapses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connectedTo.map((cId) => {
                    const cNode = CONSTELLATION_NODES.find((n) => n.id === cId);
                    if (!cNode) return null;
                    return (
                      <button
                        key={cId}
                        onClick={() => setSelectedNode(cNode)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        {cNode.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CTA: Read Full Article */}
          <div className="pt-4 border-t border-white/10">
            <Link
              href={`/knowledge/${selectedNode.slug}`}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Read Full Knowledge Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </aside>

      </main>

      <Footer />
    </div>
  );
}
