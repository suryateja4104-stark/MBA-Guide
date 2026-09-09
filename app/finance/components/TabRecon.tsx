"use client";

import React, { useState } from "react";

export default function TabRecon() {
  // Interactive Financial Reconstruction & Value Creation State
  const [sales, setSales] = useState<number>(1000); // ₹ Crores
  const [ebitMargin, setEbitMargin] = useState<number>(18); // %
  const [taxRate, setTaxRate] = useState<number>(25); // %
  const [nowcRatio, setNowcRatio] = useState<number>(15); // NOWC as % of Sales
  const [netFixedAssets, setNetFixedAssets] = useState<number>(450); // ₹ Crores
  const [priorCapital, setPriorCapital] = useState<number>(550); // ₹ Crores (T-1)
  const [wacc, setWacc] = useState<number>(10.5); // %

  // Computations
  const ebit = (sales * ebitMargin) / 100;
  const nopat = ebit * (1 - taxRate / 100);
  const nowc = (sales * nowcRatio) / 100;
  const tnoc = nowc + netFixedAssets; // Current Total Net Operating Capital
  const netCapitalInvestment = tnoc - priorCapital;
  const fcf = nopat - netCapitalInvestment;
  const roic = priorCapital > 0 ? (nopat / priorCapital) * 100 : 0;
  const capitalCharge = (priorCapital * wacc) / 100;
  const eva = nopat - capitalCharge;
  const roicWaccSpread = roic - wacc;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#8C6A2E]/10 text-[#8C6A2E] mb-2 mono">
              Sessions 1 &amp; 2 • Foundational Corporate Finance
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Modifying Accounting Data &amp; Intrinsic Value Drivers
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Accountants focus on Net Income under GAAP rules. Financial managers restructure statements into{" "}
              <strong>Operating vs Financing</strong> decisions to isolate true cash generation, calculate Free Cash Flow (FCF),
              and evaluate Economic Value Added (EVA).
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[160px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Firm Goal</span>
            <span className="text-sm font-black text-[#8C6A2E] block mt-0.5">Maximize Firm Value</span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">PV of All Future FCFs</span>
          </div>
        </div>
      </div>

      {/* Grid: Conceptual Frameworks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Three Decisions & Agency Theory */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
              01
            </div>
            <h3 className="text-base font-bold text-[#211E19]">The Three Major Decisions &amp; Agency</h3>
            <p className="text-xs text-[#686254] mt-2 leading-relaxed">
              Corporate finance revolves around three interconnected decisions:
            </p>
            <ul className="text-xs text-[#211E19] mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Investment Decision:</strong> Capital budgeting &amp; working capital allocation.</li>
              <li><strong>Financing Decision:</strong> Optimal debt vs. equity mix (Capital Structure).</li>
              <li><strong>Distribution Decision:</strong> Dividends vs. share repurchases vs. retention.</li>
            </ul>
            <div className="mt-3 p-2.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded text-[11px] text-[#686254]">
              <strong className="text-[#8C6A2E]">Agency Conflict:</strong> Separation of ownership (shareholders) and control (managers) creates agency costs. Aligning incentives via stock options, EVA compensation, and active board oversight prevents managerial empire building.
            </div>
          </div>
        </div>

        {/* Card 2: Accounting vs Finance Transformation */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
              02
            </div>
            <h3 className="text-base font-bold text-[#211E19]">Reconstructing GAAP to Finance</h3>
            <p className="text-xs text-[#686254] mt-2 leading-relaxed">
              GAAP income statements mix operating and debt financing costs. Finance separates them strictly:
            </p>
            <div className="mt-2 space-y-1.5 text-xs font-mono">
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#8C6A2E] font-bold">NOPAT</span> = EBIT × (1 - T)
              </div>
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#2E5C8A] font-bold">NOWC</span> = Operating CA - Operating CL
              </div>
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#3D7A52] font-bold">TNOC</span> = NOWC + Net Fixed Assets
              </div>
            </div>
            <p className="text-[11px] text-[#686254] mt-2.5 leading-relaxed">
              *Crucial rule: <strong>Notes Payable</strong> and short-term bank debt are <em>financing liabilities</em>, NOT operating liabilities. Excess marketable securities are non-operating assets.
            </p>
          </div>
        </div>

        {/* Card 3: Free Cash Flow & Value Creation */}
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
              03
            </div>
            <h3 className="text-base font-bold text-[#211E19]">FCF, ROIC &amp; Economic Value Added</h3>
            <p className="text-xs text-[#686254] mt-2 leading-relaxed">
              Growth creates value <em>only</em> if the return on newly deployed capital exceeds the cost of that capital:
            </p>
            <div className="mt-2 space-y-1.5 text-xs font-mono">
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#E2571C] font-bold">FCF</span> = NOPAT - Net Capital Additions
              </div>
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#3D7A52] font-bold">ROIC</span> = NOPAT / Invested Capital
              </div>
              <div className="p-1.5 bg-[#F4F1E9] rounded border border-[#DCD5C4]">
                <span className="text-[#8C6A2E] font-bold">EVA</span> = (ROIC - WACC) × Capital
              </div>
            </div>
            <div className="mt-2.5 p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded text-[11px] text-[#686254]">
              If <strong>ROIC &gt; WACC</strong>, firm generates genuine economic profit (EVA &gt; 0). If ROIC &lt; WACC, sales growth actively destroys shareholder wealth!
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Workbench: Financial Reconstruction Engine */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#8C6A2E] uppercase tracking-wider mono">Interactive Workbench</span>
            <h3 className="text-xl font-black text-[#211E19]">
              Live Financial Reconstruction &amp; EVA Diagnostic Simulator
            </h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Simulate operational drivers, observe balance sheet restructuring, and measure Free Cash Flow vs Economic Value Added.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSales(1000);
                setEbitMargin(18);
                setTaxRate(25);
                setNowcRatio(15);
                setNetFixedAssets(450);
                setPriorCapital(550);
                setWacc(10.5);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono"
            >
              Reset Baseline
            </button>
            <button
              onClick={() => {
                setSales(1400);
                setEbitMargin(11);
                setTaxRate(25);
                setNowcRatio(22);
                setNetFixedAssets(700);
                setPriorCapital(550);
                setWacc(11);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#BB3B2E]/10 hover:bg-[#BB3B2E]/20 border border-[#BB3B2E]/30 text-[#BB3B2E] transition mono"
            >
              Growth Trap Scenario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
              Operational &amp; Balance Sheet Inputs
            </div>

            {/* Sales */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="recon-sales-slider">Annual Sales Revenue:</label>
                <span className="font-mono text-[#8C6A2E]">₹{sales.toLocaleString()} Cr</span>
              </div>
              <input
                id="recon-sales-slider"
                type="range"
                min="500"
                max="2500"
                step="50"
                value={sales}
                onChange={(e) => setSales(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
              />
            </div>

            {/* EBIT Margin */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="recon-ebit-margin-slider">Operating Profit Margin (EBIT %):</label>
                <span className="font-mono text-[#2E5C8A]">{ebitMargin}% (EBIT: ₹{ebit.toFixed(1)} Cr)</span>
              </div>
              <input
                id="recon-ebit-margin-slider"
                type="range"
                min="5"
                max="35"
                step="1"
                value={ebitMargin}
                onChange={(e) => setEbitMargin(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="recon-tax-rate-slider">Corporate Tax Rate (T):</label>
                <span className="font-mono text-[#686254]">{taxRate}%</span>
              </div>
              <input
                id="recon-tax-rate-slider"
                type="range"
                min="15"
                max="35"
                step="1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#686254]"
              />
            </div>

            {/* NOWC as % of Sales */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="recon-nowc-ratio-slider">NOWC Intensity (% of Sales):</label>
                <span className="font-mono text-[#3D7A52]">{nowcRatio}% (₹{nowc.toFixed(1)} Cr)</span>
              </div>
              <input
                id="recon-nowc-ratio-slider"
                type="range"
                min="5"
                max="30"
                step="1"
                value={nowcRatio}
                onChange={(e) => setNowcRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
              />
            </div>

            {/* Net Fixed Assets */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="recon-nfa-slider">Net Operating Fixed Assets (Plant &amp; Eq):</label>
                <span className="font-mono text-[#686254]">₹{netFixedAssets} Cr</span>
              </div>
              <input
                id="recon-nfa-slider"
                type="range"
                min="200"
                max="1200"
                step="25"
                value={netFixedAssets}
                onChange={(e) => setNetFixedAssets(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#686254]"
              />
            </div>

            {/* Prior Year Capital & WACC */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#EAE5D8]">
              <div>
                <label htmlFor="recon-prior-capital-input" className="text-[11px] font-semibold text-[#686254] block">Prior Capital (T-1):</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-mono text-[#686254]">₹</span>
                  <input
                    id="recon-prior-capital-input"
                    type="number"
                    value={priorCapital}
                    onChange={(e) => setPriorCapital(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="recon-wacc-input" className="text-[11px] font-semibold text-[#686254] block">WACC (%):</label>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    id="recon-wacc-input"
                    type="number"
                    step="0.5"
                    value={wacc}
                    onChange={(e) => setWacc(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono"
                  />
                  <span className="text-xs font-mono text-[#686254]">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                roicWaccSpread >= 0
                  ? "bg-[#3D7A52]/10 border-[#3D7A52]/30 text-[#211E19]"
                  : "bg-[#BB3B2E]/10 border-[#BB3B2E]/30 text-[#211E19]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      roicWaccSpread >= 0 ? "bg-[#3D7A52]" : "bg-[#BB3B2E]"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider mono">
                    {roicWaccSpread >= 0 ? "Value Accretion Phase" : "Value Destruction Warning"}
                  </span>
                </div>
                <h4 className="text-base font-black mt-1">
                  ROIC ({roic.toFixed(2)}%) {roicWaccSpread >= 0 ? "Exceeds" : "Lags"} Cost of Capital ({wacc}%)
                </h4>
                <p className="text-xs text-[#686254] mt-0.5">
                  {roicWaccSpread >= 0
                    ? `Generating ${roicWaccSpread.toFixed(2)}% excess return per rupee of invested capital.`
                    : `Losing ${Math.abs(roicWaccSpread).toFixed(2)}% economic spread. Growth consumes more cash than it yields.`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#686254] font-medium block">Annual EVA</span>
                <span
                  className={`text-xl font-black font-mono ${
                    eva >= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                  }`}
                >
                  {eva >= 0 ? "+" : ""}₹{eva.toFixed(1)} Cr
                </span>
              </div>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">NOPAT</span>
                <span className="text-base font-black font-mono text-[#8C6A2E] mt-0.5 block">
                  ₹{nopat.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">EBIT × (1 - {taxRate}%)</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">TNOC (Capital)</span>
                <span className="text-base font-black font-mono text-[#2E5C8A] mt-0.5 block">
                  ₹{tnoc.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">NOWC + Net FA</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Net Capital Add</span>
                <span className="text-base font-black font-mono text-[#686254] mt-0.5 block">
                  {netCapitalInvestment >= 0 ? "+" : ""}₹{netCapitalInvestment.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">TNOC - Prior Capital</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Free Cash Flow</span>
                <span
                  className={`text-base font-black font-mono mt-0.5 block ${
                    fcf >= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                  }`}
                >
                  ₹{fcf.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">NOPAT - Capital Add</span>
              </div>
            </div>

            {/* Reconciliation Walkthrough Table */}
            <div className="bg-white border border-[#DCD5C4] rounded-xl p-4">
              <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block mb-2 mono">
                Mathematical Statement Walkthrough (GAAP to EVA)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#FAF8F2]">
                  <span className="text-[#686254]">Gross Sales Revenue</span>
                  <span className="font-mono font-semibold">₹{sales.toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF8F2]">
                  <span className="text-[#686254]">Operating Costs (excl. depreciation &amp; interest)</span>
                  <span className="font-mono text-[#BB3B2E]">-(₹{(sales - ebit).toFixed(1)}) Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF8F2] font-semibold">
                  <span className="text-[#211E19]">Operating Income (EBIT)</span>
                  <span className="font-mono">₹{ebit.toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF8F2]">
                  <span className="text-[#686254]">Taxes on Operating Profit (EBIT × {taxRate}%)</span>
                  <span className="font-mono text-[#BB3B2E]">-(₹{(ebit * (taxRate / 100)).toFixed(1)}) Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF8F2] font-bold bg-[#FAF8F2] px-2 rounded">
                  <span className="text-[#8C6A2E]">Net Operating Profit After Taxes (NOPAT)</span>
                  <span className="font-mono text-[#8C6A2E]">₹{nopat.toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF8F2]">
                  <span className="text-[#686254]">Less: Capital Charge (Prior Invested Capital × WACC {wacc}%)</span>
                  <span className="font-mono text-[#BB3B2E]">-(₹{capitalCharge.toFixed(1)}) Cr</span>
                </div>
                <div className="flex justify-between py-1.5 font-black bg-[#FAF8F2] px-2 rounded border border-[#EAE5D8]">
                  <span className="text-[#211E19]">Economic Value Added (EVA)</span>
                  <span className={`font-mono ${eva >= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"}`}>
                    {eva >= 0 ? "+" : ""}₹{eva.toFixed(1)} Cr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Vignette */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-5">
        <h4 className="text-sm font-bold text-[#8C6A2E] uppercase tracking-wider mono flex items-center gap-2">
          <span>📖 Real-World Executive Case: The Growth Trap</span>
        </h4>
        <p className="text-xs text-[#211E19] mt-2 leading-relaxed">
          In corporate boardrooms, CEOs frequently announce 25% year-on-year revenue growth. However, if that growth requires heavy working capital buildup (high NOWC) and aggressive capex, the new capital deployed may earn an ROIC of 8% against a cost of capital of 11%. Even though accounting EPS rises, Free Cash Flow turns sharply negative, and EVA declines. The market eventually punishes the stock because intrinsic firm value has been destroyed.
        </p>
      </div>
    </div>
  );
}
