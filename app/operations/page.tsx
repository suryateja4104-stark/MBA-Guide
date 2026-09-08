"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function OperationsPage() {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const basePath = process.env.NODE_ENV === "production" ? "/MBA-Guide" : "";

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E9] text-[#211E19]">
      {/* Top Navigation Bar */}
      <header className="tab-header sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#C7BFA9] shadow-xs">
        <div className="wrap header-flex">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
              title="Return to MBA Domains Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>MBA Domains</span>
            </Link>

            <div className="brand flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#2E5C8A] text-white flex items-center justify-center font-bold text-sm shadow-xs mono">
                OP
              </div>
              <div className="flex flex-col">
                <span className="leading-tight text-lg">Operations &amp; Supply Chain</span>
                <span className="text-[10px] font-semibold text-[#686254] tracking-wider uppercase">
                  Interactive Study Guide &amp; Quantitative Calculators
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="p-1.5 rounded hover:bg-[#FAF8F2] border border-transparent hover:border-[#DCD5C4] text-[#686254] transition"
              title="Reset Workbench"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href="https://github.com/suryateja4104-stark/Operations-Domain-Session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Session Repo</span>
            </a>

            <a
              href="https://suryateja4104-stark.github.io/Operations-Domain-Session/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#2E5C8A] text-white hover:bg-[#23486d] transition shadow-xs mono"
            >
              <span>Pop-Out Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Embedded Operations Workbench Frame */}
      <main className="flex-1 w-full flex flex-col bg-[#F4F1E9]">
        <iframe
          key={iframeKey}
          src={`${basePath}/operations.html`}
          title="Operations and Supply Chain Guide"
          className="w-full flex-1 border-0 min-h-[calc(100vh-73px)]"
        />
      </main>
    </div>
  );
}
