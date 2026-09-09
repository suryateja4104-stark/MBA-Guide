"use client";

import React, { useState } from "react";

export default function TabWorkingCapital() {
  // Simulator state
  const [sales, setSales] = useState<number>(3000); // ₹ Crores
  const [cogsPercent, setCogsPercent] = useState<number>(70); // % of sales
  const [dio, setDio] = useState<number>(65); // Days Inventory Outstanding
  const [dso, setDso] = useState<number>(45); // Days Sales Outstanding
  const [dpo, setDpo] = useState<number>(50); // Days Payables Outstanding
  const [costOfCapital, setCostOfCapital] = useState<number>(12); // %

  // Computations
  const cogs = (sales * cogsPercent) / 100;
  const ccc = dio + dso - dpo; // Cash Conversion Cycle in days
  const operatingCycle = dio + dso;

  // Working Capital Balances
  const inventory = (cogs * dio) / 365;
  const receivables = (sales * dso) / 365;
  const payables = (cogs * dpo) / 365;
  const netOperatingWorkingCapital = inventory + receivables - payables;
  const carryingCost = (netOperatingWorkingCapital * costOfCapital) / 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#3D7A52]/10 text-[#3D7A52] mb-2 mono">
              Sessions 4 &amp; 5 • Operational Liquidity &amp; Working Capital
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Working Capital Policies &amp; Cash Conversion Cycle (CCC)
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Working capital management balances <strong>profitability vs risk</strong>. Shortening the cash conversion
              cycle frees up operational liquidity without borrowing expensive external capital.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Net Cash Cycle</span>
            <span
              className={`text-xl font-black font-mono block mt-0.5 ${
                ccc < 0 ? "text-[#3D7A52]" : "text-[#8C6A2E]"
              }`}
            >
              {ccc} Days
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">
              {ccc < 0 ? "Vendor-Financed (Negative CCC)" : "Capital Tied Up"}
            </span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards: Investment & Financing Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: The Cash Conversion Cycle */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">The Cash Conversion Cycle</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            The elapsed time between paying suppliers for raw materials and receiving cash from customers:
          </p>
          <div className="mt-2.5 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center font-bold text-[#211E19]">
            CCC = DIO + DSO - DPO
          </div>
          <div className="mt-2.5 space-y-1.5 text-xs text-[#686254]">
            <p>• <strong>DIO (Inventory Conversion):</strong> Days from raw materials purchase to finished good sale.</p>
            <p>• <strong>DSO (Receivables Collection):</strong> Average days customers take to pay credit invoices.</p>
            <p>• <strong>DPO (Payables Deferral):</strong> Average days firm takes to pay supplier invoices.</p>
          </div>
        </div>

        {/* Card 2: Investment Policies */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">WC Investment Policies</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Determines the targeted level of current assets relative to sales:
          </p>
          <div className="mt-2.5 space-y-2 text-xs">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#8C6A2E]">Relaxed Policy:</strong> High cash cushions, liberal credit terms, huge safety inventories. Low stockout risk, but depressed ROIC due to high tied-up capital.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#BB3B2E]">Restricted / Lean Policy:</strong> Just-in-time inventory, tight credit terms. Maximizes ROIC, but carries vulnerability to supply halts and lost sales.
            </div>
          </div>
        </div>

        {/* Card 3: Financing Policies */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">WC Financing Policies</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            How permanent vs temporary current assets are funded:
          </p>
          <div className="mt-2.5 space-y-2 text-xs">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#3D7A52]">Maturity Matching:</strong> Fund seasonal peaks with short-term bank debt; fund permanent current assets and fixed assets with long-term capital.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#BB3B2E]">Aggressive Strategy:</strong> Finance permanent assets with short-term debt. Cheaper interest rates, but high interest rate spike and refinancing risks.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator: Cash Conversion Cycle Flow & Capital Drag */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#3D7A52] uppercase tracking-wider mono">Interactive Workbench</span>
            <h3 className="text-xl font-black text-[#211E19]">
              Cash Conversion Cycle &amp; Working Capital Carrying Cost Simulator
            </h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Adjust operating cycle components to see immediate impacts on balance sheet working capital and annual financing expense.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDio(65);
                setDso(45);
                setDpo(50);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono"
            >
              Industrial Baseline
            </button>
            <button
              onClick={() => {
                setDio(8);
                setDso(20);
                setDpo(85);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#3D7A52]/10 hover:bg-[#3D7A52]/20 border border-[#3D7A52]/30 text-[#3D7A52] transition mono"
            >
              Apple / Dell Negative CCC
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
              Operational Cycle Sliders
            </div>

            {/* Sales & COGS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="wc-sales-input" className="text-[11px] font-semibold text-[#686254] block">Annual Sales (₹ Cr):</label>
                <input
                  id="wc-sales-input"
                  type="number"
                  step="250"
                  value={sales}
                  onChange={(e) => setSales(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="wc-cogs-input" className="text-[11px] font-semibold text-[#686254] block">COGS (% of Sales):</label>
                <input
                  id="wc-cogs-input"
                  type="number"
                  step="5"
                  value={cogsPercent}
                  onChange={(e) => setCogsPercent(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
            </div>

            {/* DIO Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="wc-dio-slider">Days Inventory Outstanding (DIO):</label>
                <span className="font-mono text-[#8C6A2E]">{dio} Days</span>
              </div>
              <input
                id="wc-dio-slider"
                type="range"
                min="5"
                max="120"
                step="1"
                value={dio}
                onChange={(e) => setDio(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
              />
              <span className="text-[10px] text-[#9A927E] block mt-0.5">
                Tied-up Inventory = ₹{inventory.toFixed(1)} Cr
              </span>
            </div>

            {/* DSO Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="wc-dso-slider">Days Sales Outstanding (DSO):</label>
                <span className="font-mono text-[#2E5C8A]">{dso} Days</span>
              </div>
              <input
                id="wc-dso-slider"
                type="range"
                min="5"
                max="90"
                step="1"
                value={dso}
                onChange={(e) => setDso(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
              />
              <span className="text-[10px] text-[#9A927E] block mt-0.5">
                Accounts Receivable = ₹{receivables.toFixed(1)} Cr
              </span>
            </div>

            {/* DPO Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="wc-dpo-slider">Days Payables Outstanding (DPO):</label>
                <span className="font-mono text-[#3D7A52]">{dpo} Days</span>
              </div>
              <input
                id="wc-dpo-slider"
                type="range"
                min="10"
                max="120"
                step="1"
                value={dpo}
                onChange={(e) => setDpo(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
              />
              <span className="text-[10px] text-[#9A927E] block mt-0.5">
                Accounts Payable (Supplier Credit) = ₹{payables.toFixed(1)} Cr
              </span>
            </div>

            {/* Cost of Capital */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="wc-coc-slider">Cost of Capital / Borrowing Rate:</label>
                <span className="font-mono text-[#BB3B2E]">{costOfCapital}%</span>
              </div>
              <input
                id="wc-coc-slider"
                type="range"
                min="6"
                max="18"
                step="0.5"
                value={costOfCapital}
                onChange={(e) => setCostOfCapital(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#BB3B2E]"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* CCC Visual Timeline Bar */}
            <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-4">
              <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block mb-3 mono">
                Operating Cycle vs. Cash Conversion Timeline
              </span>

              {/* Total Operating Cycle Bar */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-[#686254] mb-1">
                    <span>Operating Cycle (DIO {dio}d + DSO {dso}d)</span>
                    <span className="font-bold text-[#211E19]">{operatingCycle} Days</span>
                  </div>
                  <div className="w-full h-6 bg-[#EAE5D8] rounded-md overflow-hidden flex">
                    <div
                      style={{ width: `${(dio / operatingCycle) * 100}%` }}
                      className="bg-[#8C6A2E] text-white flex items-center justify-center text-[10px] font-bold px-1"
                    >
                      DIO ({dio}d)
                    </div>
                    <div
                      style={{ width: `${(dso / operatingCycle) * 100}%` }}
                      className="bg-[#2E5C8A] text-white flex items-center justify-center text-[10px] font-bold px-1"
                    >
                      DSO ({dso}d)
                    </div>
                  </div>
                </div>

                {/* DPO Buffer Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#686254] mb-1">
                    <span>Vendor Financing Buffer (DPO)</span>
                    <span className="font-bold text-[#3D7A52]">{dpo} Days</span>
                  </div>
                  <div className="w-full h-4 bg-[#EAE5D8] rounded-md overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (dpo / operatingCycle) * 100)}%` }}
                      className="h-full bg-[#3D7A52]"
                    />
                  </div>
                </div>

                {/* Net CCC Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#686254] mb-1">
                    <span>Net Working Capital Financing Gap (CCC)</span>
                    <span
                      className={`font-black ${
                        ccc <= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                      }`}
                    >
                      {ccc} Days
                    </span>
                  </div>
                  <div className="w-full h-6 bg-[#EAE5D8] rounded-md overflow-hidden flex">
                    {ccc > 0 ? (
                      <div
                        style={{ width: `${Math.min(100, (ccc / operatingCycle) * 100)}%` }}
                        className="bg-[#BB3B2E] text-white flex items-center justify-center text-[10px] font-bold px-1"
                      >
                        Company Must Fund ({ccc} Days)
                      </div>
                    ) : (
                      <div className="w-full bg-[#3D7A52] text-white flex items-center justify-center text-[10px] font-bold px-1">
                        Suppliers Fund Entire Operations (+{Math.abs(ccc)} Days Buffer)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">
                  Net Operating Working Capital
                </span>
                <span
                  className={`text-xl font-black font-mono mt-1 block ${
                    netOperatingWorkingCapital >= 0 ? "text-[#8C6A2E]" : "text-[#3D7A52]"
                  }`}
                >
                  ₹{netOperatingWorkingCapital.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#686254] block mt-0.5">
                  (Inventory + Receivables - Payables)
                </span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">
                  Annual Capital Carrying Cost
                </span>
                <span
                  className={`text-xl font-black font-mono mt-1 block ${
                    carryingCost >= 0 ? "text-[#BB3B2E]" : "text-[#3D7A52]"
                  }`}
                >
                  {carryingCost >= 0 ? "₹" : "-₹"}
                  {Math.abs(carryingCost).toFixed(1)} Cr / yr
                </span>
                <span className="text-[10px] text-[#686254] block mt-0.5">
                  NOWC × {costOfCapital}% Cost of Capital
                </span>
              </div>
            </div>

            {/* Executive Vignette */}
            <div className="p-3 bg-[#FAF8F2] border border-[#EAE5D8] rounded-lg text-xs text-[#686254] leading-relaxed">
              <strong className="text-[#8C6A2E]">Executive Takeaway:</strong> Reducing DSO by 5 days and DIO by 10 days while extending DPO by 5 days cuts the CCC by 20 days. In this model, that would release over <strong>₹{(sales * 20 / 365).toFixed(1)} Crores</strong> in pure cash immediately to the balance sheet!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
