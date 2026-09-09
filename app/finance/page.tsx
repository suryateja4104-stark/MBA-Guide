"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FinanceTabKey, FINANCE_TABS } from "./types";
import TabRecon from "./components/TabRecon";
import TabForecasting from "./components/TabForecasting";
import TabWorkingCapital from "./components/TabWorkingCapital";
import TabTVM from "./components/TabTVM";
import TabBonds from "./components/TabBonds";
import TabRiskReturn from "./components/TabRiskReturn";
import TabDCF from "./components/TabDCF";
import TabBehavioral from "./components/TabBehavioral";

export default function CorporateFinanceMasterclassApp() {
  const [activeTab, setActiveTab] = useState<FinanceTabKey>("recon");
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  // Tab index tracking for next/prev navigation
  const currentTabIndex = FINANCE_TABS.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIndex > 0 ? FINANCE_TABS[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < FINANCE_TABS.length - 1 ? FINANCE_TABS[currentTabIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E9] text-[#211E19]">
      {/* 2-Tier Sticky Executive Navigation Header */}
      <header className="tab-header bg-white border-b border-[#DCD5C4] sticky top-0 z-50 shadow-xs">
        {/* Tier 1: Brand & Top Utilities */}
        <div className="wrap flex flex-wrap items-center justify-between py-2.5 border-b border-[#FAF8F2] gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
              title="Return to MBA Domains Portal"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>MBA Domains</span>
            </Link>

            <Link href="/" className="brand hover:opacity-90 transition flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#8C6A2E] text-white flex items-center justify-center font-bold text-sm shadow-xs mono">
                CF
              </div>
              <div className="flex flex-col">
                <span className="leading-tight text-lg">Corporate Finance Guide</span>
                <span className="text-[10px] font-semibold text-[#686254] tracking-wider uppercase hidden sm:block">
                  Valuation, Capital Allocation &amp; Decision Simulation Workbench
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFormulaModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#8C6A2E] text-white hover:bg-[#735623] transition shadow-xs mono"
            >
              <span>📐 Formula Compendium</span>
            </button>
            <Link
              href="/economics/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono hidden sm:inline-flex"
            >
              <span>Economics Portal →</span>
            </Link>
          </div>
        </div>

        {/* Tier 2: Scrollable Navigation Tabs */}
        <div className="wrap">
          <nav className="tab-nav flex items-center gap-1 overflow-x-auto py-1 h-11 scrollbar-none">
            {FINANCE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded transition ${
                    isActive
                      ? "bg-[#8C6A2E] text-white shadow-xs"
                      : "text-[#686254] hover:text-[#211E19] hover:bg-[#FAF8F2]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 wrap py-8">
        {/* Module Sub-Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-[#DCD5C4] gap-2">
          <div className="flex items-center gap-2 text-xs text-[#686254] mono">
            <span className="font-bold text-[#8C6A2E]">
              Module {currentTabIndex + 1} of {FINANCE_TABS.length}:
            </span>
            <span className="text-[#211E19] font-semibold">{FINANCE_TABS[currentTabIndex].label}</span>
            <span className="text-[#9A927E]">({FINANCE_TABS[currentTabIndex].sessions})</span>
          </div>
          <div className="text-xs font-mono text-[#686254]">
            Curriculum Source: <strong className="text-[#211E19]">IIM / Brigham &amp; Ehrhardt</strong>
          </div>
        </div>

        {/* Active Tab Component */}
        {activeTab === "recon" && <TabRecon />}
        {activeTab === "forecasting" && <TabForecasting />}
        {activeTab === "working-capital" && <TabWorkingCapital />}
        {activeTab === "tvm" && <TabTVM />}
        {activeTab === "bonds" && <TabBonds />}
        {activeTab === "risk-return" && <TabRiskReturn />}
        {activeTab === "dcf-wacc" && <TabDCF />}
        {activeTab === "behavioral-emh" && <TabBehavioral />}

        {/* Module Next / Prev Step Controls */}
        <div className="mt-12 pt-6 border-t border-[#DCD5C4] flex flex-wrap items-center justify-between gap-4">
          {prevTab ? (
            <button
              onClick={() => setActiveTab(prevTab.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#DCD5C4] text-xs font-bold text-[#211E19] hover:bg-[#FAF8F2] transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Previous: {prevTab.label}</span>
            </button>
          ) : (
            <div />
          )}

          {nextTab ? (
            <button
              onClick={() => setActiveTab(nextTab.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8C6A2E] text-white text-xs font-bold hover:bg-[#735623] transition shadow-xs"
            >
              <span>Next: {nextTab.label}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E5C8A] text-white text-xs font-bold hover:bg-[#234568] transition shadow-xs"
            >
              <span>Return to MBA Domains Portal</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          )}
        </div>
      </main>

      {/* Formula Compendium Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#DCD5C4] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE5D8] pb-3">
              <div>
                <span className="text-xs font-bold text-[#8C6A2E] uppercase tracking-wider mono">Formula Compendium</span>
                <h3 className="text-lg font-black text-[#211E19]">Corporate Finance &amp; Valuation Cheatsheet</h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="w-8 h-8 rounded-lg bg-[#FAF8F2] hover:bg-[#EAE5D8] flex items-center justify-center text-sm font-bold text-[#686254]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#8C6A2E] block text-[11px] font-sans">Net Operating Profit After Taxes (NOPAT)</strong>
                NOPAT = EBIT × (1 - T)
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#2E5C8A] block text-[11px] font-sans">Net Operating Working Capital (NOWC)</strong>
                NOWC = Operating Current Assets - Operating Current Liabilities
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#3D7A52] block text-[11px] font-sans">Free Cash Flow (FCF)</strong>
                FCF = NOPAT - Net Investment in Operating Capital
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#BB3B2E] block text-[11px] font-sans">Additional Funds Needed (AFN)</strong>
                AFN = (A<sub>0</sub>*/S<sub>0</sub>)ΔS - (L<sub>0</sub>*/S<sub>0</sub>)ΔS - M·S<sub>1</sub>·(1 - Payout)
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#8C6A2E] block text-[11px] font-sans">Cash Conversion Cycle (CCC)</strong>
                CCC = DIO + DSO - DPO
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#2E5C8A] block text-[11px] font-sans">Capital Asset Pricing Model (CAPM)</strong>
                r<sub>s</sub> = r<sub>RF</sub> + β × (r<sub>M</sub> - r<sub>RF</sub>)
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#3D7A52] block text-[11px] font-sans">Weighted Average Cost of Capital (WACC)</strong>
                WACC = w<sub>d</sub>·r<sub>d</sub>(1 - T) + w<sub>e</sub>·r<sub>s</sub>
              </div>
              <div className="p-3 bg-[#FAF8F2] rounded-lg border border-[#EAE5D8]">
                <strong className="text-[#8C6A2E] block text-[11px] font-sans">Horizon Value (Gordon Growth Perpetuity)</strong>
                HV<sub>N</sub> = [FCF<sub>N</sub> × (1 + g)] / (WACC - g)
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE5D8] text-right">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 bg-[#8C6A2E] text-white text-xs font-bold rounded-lg hover:bg-[#735623] transition"
              >
                Close Compendium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#DCD5C4] bg-white py-8 mt-12 text-center text-xs text-[#686254]">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#211E19]">MBA Executive Curriculum</span>
            <span>•</span>
            <span>Corporate Finance &amp; Valuation Domain</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#211E19] transition">Domains Portal</Link>
            <Link href="/economics/" className="hover:text-[#211E19] transition">Economics</Link>
            <Link href="/operations/" className="hover:text-[#211E19] transition">Operations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
