"use client";

import React, { useState } from "react";

export default function TabForecasting() {
  // Base parameters
  const [baseSales, setBaseSales] = useState<number>(2000); // ₹ Crores (S0)
  const [salesGrowth, setSalesGrowth] = useState<number>(20); // % growth g
  const [assetRatio, setAssetRatio] = useState<number>(60); // A0*/S0 (%)
  const [spontaneousLiabRatio, setSpontaneousLiabRatio] = useState<number>(12); // L0*/S0 (%)
  const [profitMargin, setProfitMargin] = useState<number>(6); // M (%)
  const [payoutRatio, setPayoutRatio] = useState<number>(40); // Dividend Payout (%)
  const [capacityUtil, setCapacityUtil] = useState<number>(100); // Existing Fixed Asset Capacity Utilization (%)

  // Computations
  const deltaSales = (baseSales * salesGrowth) / 100;
  const projectedSales = baseSales + deltaSales; // S1
  const fullCapacitySales = baseSales / (capacityUtil / 100);
  const isCapacityConstrained = projectedSales > fullCapacitySales;

  // Asset requirement calculation:
  // If at 100% capacity, all assets grow proportionally with delta S
  // If excess capacity exists, only current assets grow proportionally, fixed assets only if projectedSales > fullCapacitySales
  const requiredAssetIncrease = (deltaSales * assetRatio) / 100;
  const spontaneousFinancing = (deltaSales * spontaneousLiabRatio) / 100;
  const projectedNetIncome = (projectedSales * profitMargin) / 100;
  const retentionRatio = 1 - payoutRatio / 100;
  const additionToRetainedEarnings = projectedNetIncome * retentionRatio;

  // AFN Equation
  const afn = requiredAssetIncrease - spontaneousFinancing - additionToRetainedEarnings;

  // Self-supporting growth rate (growth rate at which AFN = 0, assuming 100% capacity)
  // 0 = (A0*/S0)*g*S0 - (L0*/S0)*g*S0 - M*S0*(1+g)*(1-payout)
  // g * [ (A0*/S0) - (L0*/S0) - M*(1-payout) ] = M*(1-payout)
  const num = (profitMargin / 100) * retentionRatio;
  const den = (assetRatio / 100) - (spontaneousLiabRatio / 100) - num;
  const selfSupportingGrowth = den > 0 ? (num / den) * 100 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#2E5C8A]/10 text-[#2E5C8A] mb-2 mono">
              Session 3 • Pro Forma Financial Modeling
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Financial Statement Projections &amp; Additional Funds Needed (AFN)
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              When sales expand, operating assets must grow to support production. Some financing arises spontaneously
              from vendors and accrued wages. The rest must come from retained earnings or{" "}
              <strong>external capital markets (AFN)</strong>.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Self-Funded Growth</span>
            <span className="text-sm font-black text-[#2E5C8A] block mt-0.5">
              {selfSupportingGrowth > 0 ? `${selfSupportingGrowth.toFixed(1)}%` : "N/A"}
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">Zero External Financing</span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">The AFN Equation Mechanics</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            The fundamental corporate capital requirement relationship:
          </p>
          <div className="mt-2 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] text-[11px] font-mono text-[#211E19]">
            AFN = (A<sub>0</sub>*/S<sub>0</sub>)ΔS - (L<sub>0</sub>*/S<sub>0</sub>)ΔS - M·S<sub>1</sub>·(1 - Payout)
          </div>
          <ul className="text-xs text-[#686254] mt-2.5 space-y-1">
            <li>• <strong>Required Asset Increase:</strong> Cash, inventory, receivables, and equipment needed to generate ΔS.</li>
            <li>• <strong>Spontaneous Financing:</strong> Accounts payable and accruals that naturally rise with volume.</li>
            <li>• <strong>Internal Retained Earnings:</strong> Profit kept in the business rather than paid out as dividends.</li>
          </ul>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Spontaneous vs Non-Spontaneous</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            A critical distinction tested in corporate finance examinations:
          </p>
          <div className="mt-2 text-xs space-y-1.5">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#3D7A52]">Spontaneous Liabilities (L<sub>0</sub>*):</strong> Trade payables, accrued wages, taxes payable. They rise automatically with sales without management action.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#BB3B2E]">Non-Spontaneous Liabilities:</strong> Notes payable, bank loans, corporate bonds, preferred and common equity. They require explicit financing agreements!
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Capacity Constraints &amp; Lumpy Assets</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            In the real world, assets do not scale continuously.
          </p>
          <div className="mt-2 text-xs space-y-2 text-[#686254]">
            <p>
              • <strong>Excess Capacity:</strong> If plant currently runs at 80%, sales can expand by 25% (1 / 0.8 = 1.25) before any new fixed assets are needed.
            </p>
            <p>
              • <strong>Lumpy Capex:</strong> Steel mills, chip fabs, and auto assembly lines cannot be added in fractions. Adding one blast furnace creates huge upfront AFN followed by years of excess capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive AFN Simulator */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#2E5C8A] uppercase tracking-wider mono">Interactive Simulator</span>
            <h3 className="text-xl font-black text-[#211E19]">
              Additional Funds Needed (AFN) Forecasting Workbench
            </h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Simulate revenue growth targets, operational capital intensity, and retention policies to predict external financing requirements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBaseSales(2000);
                setSalesGrowth(20);
                setAssetRatio(60);
                setSpontaneousLiabRatio(12);
                setProfitMargin(6);
                setPayoutRatio(40);
                setCapacityUtil(100);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono"
            >
              Baseline Model
            </button>
            <button
              onClick={() => {
                setBaseSales(2000);
                setSalesGrowth(35);
                setAssetRatio(70);
                setSpontaneousLiabRatio(10);
                setProfitMargin(4);
                setPayoutRatio(60);
                setCapacityUtil(95);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#BB3B2E]/10 hover:bg-[#BB3B2E]/20 border border-[#BB3B2E]/30 text-[#BB3B2E] transition mono"
            >
              Liquidity Crunch Scenario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
              Pro Forma Growth &amp; Financial Ratios
            </div>

            {/* Base Sales */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="forecasting-base-sales-slider">Current Base Sales (S<sub>0</sub>):</label>
                <span className="font-mono text-[#8C6A2E]">₹{baseSales.toLocaleString()} Cr</span>
              </div>
              <input
                id="forecasting-base-sales-slider"
                type="range"
                min="500"
                max="5000"
                step="100"
                value={baseSales}
                onChange={(e) => setBaseSales(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
              />
            </div>

            {/* Sales Growth Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="forecasting-sales-growth-slider">Projected Sales Growth (g):</label>
                <span className="font-mono text-[#2E5C8A]">+{salesGrowth}% (ΔS: ₹{deltaSales.toFixed(1)} Cr)</span>
              </div>
              <input
                id="forecasting-sales-growth-slider"
                type="range"
                min="0"
                max="50"
                step="1"
                value={salesGrowth}
                onChange={(e) => setSalesGrowth(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
              />
            </div>

            {/* Capital Intensity Ratio */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="forecasting-asset-ratio-slider">Capital Intensity (A<sub>0</sub>* / S<sub>0</sub>):</label>
                <span className="font-mono text-[#211E19]">{assetRatio}% of Sales</span>
              </div>
              <input
                id="forecasting-asset-ratio-slider"
                type="range"
                min="30"
                max="90"
                step="2"
                value={assetRatio}
                onChange={(e) => setAssetRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#211E19]"
              />
            </div>

            {/* Spontaneous Liabilities Ratio */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="forecasting-spontaneous-liab-slider">Spontaneous Liab (L<sub>0</sub>* / S<sub>0</sub>):</label>
                <span className="font-mono text-[#3D7A52]">{spontaneousLiabRatio}% of Sales</span>
              </div>
              <input
                id="forecasting-spontaneous-liab-slider"
                type="range"
                min="5"
                max="25"
                step="1"
                value={spontaneousLiabRatio}
                onChange={(e) => setSpontaneousLiabRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
              />
            </div>

            {/* Profit Margin & Payout */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#EAE5D8]">
              <div>
                <label htmlFor="forecasting-profit-margin-input" className="text-[11px] font-semibold text-[#686254] block">Profit Margin (M %):</label>
                <input
                  id="forecasting-profit-margin-input"
                  type="number"
                  step="0.5"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="forecasting-payout-ratio-input" className="text-[11px] font-semibold text-[#686254] block">Dividend Payout (%):</label>
                <input
                  id="forecasting-payout-ratio-input"
                  type="number"
                  step="5"
                  value={payoutRatio}
                  onChange={(e) => setPayoutRatio(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
            </div>

            {/* Existing Capacity Utilization */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="forecasting-capacity-util-slider">Existing Capacity Utilization:</label>
                <span className="font-mono text-[#686254]">{capacityUtil}%</span>
              </div>
              <input
                id="forecasting-capacity-util-slider"
                type="range"
                min="70"
                max="100"
                step="5"
                value={capacityUtil}
                onChange={(e) => setCapacityUtil(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#686254]"
              />
              <span className="text-[10px] text-[#9A927E] block mt-0.5">
                Full Capacity Sales = ₹{fullCapacitySales.toFixed(0)} Cr ({isCapacityConstrained ? "Bottleneck Exceeded" : "Surplus Capacity Available"})
              </span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* AFN Summary Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                afn <= 0
                  ? "bg-[#3D7A52]/10 border-[#3D7A52]/30 text-[#211E19]"
                  : "bg-[#8C6A2E]/10 border-[#8C6A2E]/30 text-[#211E19]"
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider mono text-[#686254] block">
                  Financing Verdict
                </span>
                <h4 className="text-lg font-black mt-0.5">
                  {afn > 0
                    ? `External Financing Needed: ₹${afn.toFixed(1)} Cr`
                    : `Self-Financing Surplus: ₹${Math.abs(afn).toFixed(1)} Cr`}
                </h4>
                <p className="text-xs text-[#686254] mt-0.5">
                  {afn > 0
                    ? "Firm must issue new debt, draw bank credit lines, or issue equity to avoid liquidity default."
                    : "Internally generated retained earnings exceed asset growth requirements. Excess cash can retire debt or fund share buybacks."}
                </p>
              </div>
              <div className="text-right pl-4">
                <span className="text-xs text-[#686254] font-medium block">AFN Requirement</span>
                <span
                  className={`text-2xl font-black font-mono ${
                    afn > 0 ? "text-[#8C6A2E]" : "text-[#3D7A52]"
                  }`}
                >
                  {afn > 0 ? "+" : ""}₹{afn.toFixed(1)} Cr
                </span>
              </div>
            </div>

            {/* 3 Pillars of AFN Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">
                  1. Required Assets
                </span>
                <span className="text-base font-black font-mono text-[#BB3B2E] mt-0.5 block">
                  +₹{requiredAssetIncrease.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">
                  ΔS × {assetRatio}%
                </span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">
                  2. Spontaneous Liab
                </span>
                <span className="text-base font-black font-mono text-[#3D7A52] mt-0.5 block">
                  -₹{spontaneousFinancing.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">
                  ΔS × {spontaneousLiabRatio}%
                </span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">
                  3. Retained Earnings
                </span>
                <span className="text-base font-black font-mono text-[#2E5C8A] mt-0.5 block">
                  -₹{additionToRetainedEarnings.toFixed(1)} Cr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">
                  S<sub>1</sub> × {profitMargin}% × {(100 - payoutRatio)}%
                </span>
              </div>
            </div>

            {/* Dynamic Visual Financing Stack Bar */}
            <div className="bg-white border border-[#DCD5C4] rounded-xl p-4">
              <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block mb-2 mono">
                Asset Financing Source Stack (Percentage of Required New Assets)
              </span>
              <div className="w-full h-8 bg-[#EAE5D8] rounded-lg overflow-hidden flex font-mono text-[10px] text-white font-bold">
                {requiredAssetIncrease > 0 && (
                  <>
                    <div
                      style={{
                        width: `${Math.min(100, (spontaneousFinancing / requiredAssetIncrease) * 100)}%`,
                      }}
                      className="bg-[#3D7A52] flex items-center justify-center transition-all duration-300"
                      title="Spontaneous Liabilities"
                    >
                      {spontaneousFinancing / requiredAssetIncrease > 0.15 && "Spontaneous"}
                    </div>
                    <div
                      style={{
                        width: `${Math.min(
                          100 - (spontaneousFinancing / requiredAssetIncrease) * 100,
                          (additionToRetainedEarnings / requiredAssetIncrease) * 100
                        )}%`,
                      }}
                      className="bg-[#2E5C8A] flex items-center justify-center transition-all duration-300"
                      title="Retained Earnings"
                    >
                      {additionToRetainedEarnings / requiredAssetIncrease > 0.15 && "Retained Earnings"}
                    </div>
                    {afn > 0 && (
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (afn / requiredAssetIncrease) * 100
                          )}%`,
                        }}
                        className="bg-[#8C6A2E] flex items-center justify-center transition-all duration-300"
                        title="External AFN"
                      >
                        {afn / requiredAssetIncrease > 0.15 && "AFN (External Debt/Equity)"}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#686254] mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3D7A52] inline-block" /> Spontaneous (₹{spontaneousFinancing.toFixed(0)} Cr)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E5C8A] inline-block" /> Retained Earnings (₹{additionToRetainedEarnings.toFixed(0)} Cr)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6A2E] inline-block" /> External AFN (₹{Math.max(0, afn).toFixed(0)} Cr)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
