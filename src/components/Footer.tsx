import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground text-xs mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Mission & Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                K
              </span>
              <span className="font-serif font-bold text-base text-foreground">Knowra</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              An open, reliable, multilingual knowledge infrastructure. Free and accessible to everyone under Apache 2.0.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Primary Sources</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Product Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/search" className="hover:text-foreground transition-colors">
                  Module A: Knowra Web
                </Link>
              </li>
              <li>
                <Link href="/api/v1" className="hover:text-foreground transition-colors">
                  Module B: Developer API
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-foreground transition-colors">
                  Module C: Community Submissions
                </Link>
              </li>
              <li>
                <Link href="/prototype.html" className="hover:text-foreground transition-colors">
                  Visual Studio Prototypes
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Popular Domains</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/science" className="hover:text-foreground transition-colors">
                  Science (বিজ্ঞান)
                </Link>
              </li>
              <li>
                <Link href="/categories/technology" className="hover:text-foreground transition-colors">
                  Technology (প্রযুক্তি)
                </Link>
              </li>
              <li>
                <Link href="/categories/history" className="hover:text-foreground transition-colors">
                  History (ইতিহাস)
                </Link>
              </li>
              <li>
                <Link href="/categories/health-education" className="hover:text-foreground transition-colors">
                  Health Education (স্বাস্থ্য)
                </Link>
              </li>
            </ul>
          </div>

          {/* Open Governance & Docs */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Documentation & Source</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/nahid-emdad/knowra/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Architecture & Data Flow <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nahid-emdad/knowra/blob/main/docs/BANGLA_SEARCH.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Bangla Search Engine <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nahid-emdad/knowra/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Contribution Guidelines <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nahid-emdad/knowra/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Apache 2.0 License <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Knowra Open Source Project. All knowledge is free and open.</p>
          <div className="flex items-center gap-2">
            <span>Built with precision for human knowledge & education.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
