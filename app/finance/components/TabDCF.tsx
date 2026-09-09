"use client";

import React, { useState, useMemo } from "react";

export default function TabDCF() {
  // Model Parameters
  const [baseFcf, setBaseFcf] = useState<number>(250); // ₹ Crores (FCF0)
  const [fcfGrowth, setFcfGrowth] = useState<number>(15); // % annual growth for 5-year explicit period
  const [wacc, setWacc] = useState<number>(11.0); // % WACC
  const [terminalGrowth, setTerminalGrowth] = useState<number>(4.5); // % g
  const [totalDebt, setTotalDebt] = useState<number>(800); // ₹ Crores
  const [cashEquivalents, setCashEquivalents] = useState<number>(200); // ₹ Crores
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(50); // Crores shares

  // 5-Year Explicit Forecast
  const dcfModel = useMemo(() => {
    const years = [1, 2, 3, 4, 5];
    const discountRate = wacc / 100;
    const g = terminalGrowth / 100;

    let pvExplicitTotal = 0;
    const projections = years.map((yr) => {
      const fcf = baseFcf * Math.pow(1 + fcfGrowth / 100, yr);
      const pv = fcf / Math.pow(1 + discountRate, yr);
      pvExplicitTotal += pv;
      return { yr, fcf, pv };
    });

    // Horizon Value at Year 5: HV5 = FCF5 * (1 + g) / (WACC - g)
    const fcf5 = projections[4].fcf;
    const fcf6 = fcf5 * (1 + g);
    let horizonValue = 0;
    let pvHorizonValue = 0;

    if (discountRate > g) {
      horizonValue = fcf6 / (discountRate - g);
      pvHorizonValue = horizonValue / Math.pow(1 + discountRate, 5);
    }

    const enterpriseValue = pvExplicitTotal + pvHorizonValue;
    const equityValue = enterpriseValue - totalDebt + cashEquivalents;
    const valuePerShare = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;

    return {
      projections,
      pvExplicitTotal,
      horizonValue,
      pvHorizonValue,
      enterpriseValue,
      equityValue,
      valuePerShare,
    };
  }, [baseFcf, fcfGrowth, wacc, terminalGrowth, totalDebt, cashEquivalents, sharesOutstanding]);

  // Sensitivity Matrix (WACC vs Terminal Growth)
  const sensitivityData = useMemo(() => {
    const waccSteps = [wacc - 1.0, wacc - 0.5, wacc, wacc + 0.5, wacc + 1.0];
    const gSteps = [terminalGrowth - 1.0, terminalGrowth - 0.5, terminalGrowth, terminalGrowth + 0.5, terminalGrowth + 1.0];

    return waccSteps.map((w) => {
      const row = gSteps.map((gVal) => {
        const dRate = w / 100;
        const gRate = gVal / 100;
        if (dRate <= gRate) return { w, g: gVal, sharePrice: 0, valid: false };

        let pvExp = 0;
        for (let yr = 1; yr <= 5; yr++) {
          const f = baseFcf * Math.pow(1 + fcfGrowth / 100, yr);
          pvExp += f / Math.pow(1 + dRate, yr);
        }
        const f5 = baseFcf * Math.pow(1 + fcfGrowth / 100, 5);
        const hv = (f5 * (1 + gRate)) / (dRate - gRate);
        const pvHv = hv / Math.pow(1 + dRate, 5);
        const ev = pvExp + pvHv;
        const eqVal = ev - totalDebt + cashEquivalents;
        const price = sharesOutstanding > 0 ? eqVal / sharesOutstanding : 0;
        return { w, g: gVal, sharePrice: price, valid: true };
      });
      return { w, cells: row };
    });
  }, [baseFcf, fcfGrowth, wacc, terminalGrowth, totalDebt, cashEquivalents, sharesOutstanding]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#8C6A2E]/10 text-[#8C6A2E] mb-2 mono">
              Sessions 9, 10 &amp; 11 • Valuation &amp; Financial Markets
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Enterprise DCF Valuation &amp; WACC Sensitivity Matrix
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              The Corporate Valuation Model values the entire firm by discounting Free Cash Flows to the Firm (FCFF)
              at WACC. Deducting net debt unlocks the <strong>intrinsic equity value per share</strong>.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Intrinsic Share Price</span>
            <span className="text-2xl font-black font-mono text-[#8C6A2E] block mt-0.5">
              ₹{dcfModel.valuePerShare.toFixed(1)}
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">Equity Value / Shares</span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Money vs Capital Markets</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Firms raise capital across distinct institutional layers:
          </p>
          <div className="mt-2 text-xs space-y-1.5">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#2E5C8A]">Money Market (&le; 1 Year):</strong> T-Bills, Commercial Paper (CP), Certificates of Deposit (CD). High liquidity, used for working capital needs.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#8C6A2E]">Capital Market (&gt; 1 Year):</strong> Corporate debentures, term loans, common equity. Fuels multi-year capital expenditure.
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">WACC Hurdle Rate Formula</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            The weighted average of each capital source:
          </p>
          <div className="mt-2.5 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            WACC = w<sub>d</sub>·r<sub>d</sub>(1 - T) + w<sub>e</sub>·r<sub>s</sub>
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            • Debt is cheaper due to lower risk and tax deductibility.<br />
            • Equity demands higher return due to residual risk.
          </p>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Horizon Value (Terminal Value)</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Most mature firms derive 65-80% of total enterprise value from cash flows beyond the explicit 5-year forecast:
          </p>
          <div className="mt-2.5 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            HV<sub>N</sub> = [FCF<sub>N</sub>(1 + g)] / (WACC - g)
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            *Crucial rule: The perpetual growth rate <em>g</em> can never exceed long-term macroeconomic GDP growth (typically 3-5%)!
          </p>
        </div>
      </div>

      {/* Interactive DCF Modeler */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#8C6A2E] uppercase tracking-wider mono">Interactive Workbench</span>
            <h3 className="text-xl font-black text-[#211E19]">
              5-Year Corporate DCF &amp; Enterprise-to-Equity Bridge
            </h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Forecast free cash flows, compute terminal values, bridge from Enterprise Value to Equity Value, and run sensitivity matrices.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBaseFcf(250);
                setFcfGrowth(15);
                setWacc(11.0);
                setTerminalGrowth(4.5);
                setTotalDebt(800);
                setCashEquivalents(200);
                setSharesOutstanding(50);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
              DCF &amp; Capital Structure Inputs
            </div>

            {/* Base FCF */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="dcf-base-fcf-slider">Base Year Free Cash Flow (FCF<sub>0</sub>):</label>
                <span className="font-mono text-[#8C6A2E]">₹{baseFcf} Cr</span>
              </div>
              <input
                id="dcf-base-fcf-slider"
                type="range"
                min="50"
                max="800"
                step="25"
                value={baseFcf}
                onChange={(e) => setBaseFcf(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
              />
            </div>

            {/* 5-Year Growth */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="dcf-fcf-growth-slider">Explicit 5-Year FCF Growth Rate:</label>
                <span className="font-mono text-[#2E5C8A]">+{fcfGrowth}% / yr</span>
              </div>
              <input
                id="dcf-fcf-growth-slider"
                type="range"
                min="0"
                max="35"
                step="1"
                value={fcfGrowth}
                onChange={(e) => setFcfGrowth(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
              />
            </div>

            {/* WACC */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="dcf-wacc-slider">Discount Rate (WACC):</label>
                <span className="font-mono text-[#3D7A52]">{wacc.toFixed(1)}%</span>
              </div>
              <input
                id="dcf-wacc-slider"
                type="range"
                min="8.0"
                max="16.0"
                step="0.5"
                value={wacc}
                onChange={(e) => setWacc(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
              />
            </div>

            {/* Terminal Growth g */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="dcf-terminal-growth-slider">Terminal Growth Rate (g):</label>
                <span className="font-mono text-[#BB3B2E]">{terminalGrowth.toFixed(1)}%</span>
              </div>
              <input
                id="dcf-terminal-growth-slider"
                type="range"
                min="2.0"
                max="6.0"
                step="0.25"
                value={terminalGrowth}
                onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#BB3B2E]"
              />
            </div>

            {/* Balance Sheet Bridge Items */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#EAE5D8]">
              <div>
                <label htmlFor="dcf-debt-input" className="text-[10px] font-semibold text-[#686254] block">Total Debt (Cr):</label>
                <input
                  id="dcf-debt-input"
                  type="number"
                  value={totalDebt}
                  onChange={(e) => setTotalDebt(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="dcf-cash-input" className="text-[10px] font-semibold text-[#686254] block">Cash (Cr):</label>
                <input
                  id="dcf-cash-input"
                  type="number"
                  value={cashEquivalents}
                  onChange={(e) => setCashEquivalents(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="dcf-shares-input" className="text-[10px] font-semibold text-[#686254] block">Shares (Cr):</label>
                <input
                  id="dcf-shares-input"
                  type="number"
                  value={sharesOutstanding}
                  onChange={(e) => setSharesOutstanding(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* 5-Year Explicit Table */}
            <div className="overflow-x-auto border border-[#DCD5C4] rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F2] text-[#686254] border-b border-[#DCD5C4]">
                  <tr>
                    <th className="p-2">Forecast Year</th>
                    <th className="p-2">Yr 1</th>
                    <th className="p-2">Yr 2</th>
                    <th className="p-2">Yr 3</th>
                    <th className="p-2">Yr 4</th>
                    <th className="p-2">Yr 5</th>
                    <th className="p-2 text-[#8C6A2E]">Horizon Val</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F2]">
                  <tr>
                    <td className="p-2 text-[#686254] font-semibold">Nominal FCF (Cr)</td>
                    {dcfModel.projections.map((p) => (
                      <td key={p.yr} className="p-2 font-bold">₹{p.fcf.toFixed(0)}</td>
                    ))}
                    <td className="p-2 font-black text-[#8C6A2E]">₹{dcfModel.horizonValue.toFixed(0)}</td>
                  </tr>
                  <tr className="bg-[#FAF8F2]/60">
                    <td className="p-2 text-[#686254] font-semibold">Present Value (Cr)</td>
                    {dcfModel.projections.map((p) => (
                      <td key={p.yr} className="p-2 text-[#2E5C8A]">₹{p.pv.toFixed(0)}</td>
                    ))}
                    <td className="p-2 font-black text-[#3D7A52]">₹{dcfModel.pvHorizonValue.toFixed(0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Enterprise to Equity Bridge Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Explicit PV</span>
                <span className="text-base font-black font-mono text-[#2E5C8A] mt-0.5 block">
                  ₹{dcfModel.pvExplicitTotal.toFixed(0)} Cr
                </span>
                <span className="text-[9px] text-[#9A927E] block mt-0.5">
                  {((dcfModel.pvExplicitTotal / dcfModel.enterpriseValue) * 100).toFixed(0)}% of EV
                </span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Terminal PV</span>
                <span className="text-base font-black font-mono text-[#3D7A52] mt-0.5 block">
                  ₹{dcfModel.pvHorizonValue.toFixed(0)} Cr
                </span>
                <span className="text-[9px] text-[#9A927E] block mt-0.5">
                  {((dcfModel.pvHorizonValue / dcfModel.enterpriseValue) * 100).toFixed(0)}% of EV
                </span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Enterprise Value</span>
                <span className="text-base font-black font-mono text-[#8C6A2E] mt-0.5 block">
                  ₹{dcfModel.enterpriseValue.toFixed(0)} Cr
                </span>
                <span className="text-[9px] text-[#9A927E] block mt-0.5">Operating Assets</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-2.5">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Equity Value</span>
                <span className="text-base font-black font-mono text-[#211E19] mt-0.5 block">
                  ₹{dcfModel.equityValue.toFixed(0)} Cr
                </span>
                <span className="text-[9px] text-[#9A927E] block mt-0.5">EV - Debt + Cash</span>
              </div>
            </div>

            {/* Sensitivity Matrix: WACC vs Terminal Growth Rate */}
            <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-3">
              <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block mb-2 mono">
                2D Sensitivity Matrix: Share Price (₹) vs WACC &amp; Terminal Growth (g)
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#DCD5C4] text-[10px] text-[#686254]">
                      <th className="p-1.5 text-left">WACC \ g</th>
                      {sensitivityData[0].cells.map((c) => (
                        <th key={c.g} className="p-1.5 text-[#BB3B2E]">{c.g.toFixed(1)}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5D8]">
                    {sensitivityData.map((row) => (
                      <tr key={row.w}>
                        <td className="p-1.5 font-bold text-left text-[#3D7A52]">{row.w.toFixed(1)}%</td>
                        {row.cells.map((cell) => {
                          const isCurrent = Math.abs(cell.w - wacc) < 0.1 && Math.abs(cell.g - terminalGrowth) < 0.1;
                          return (
                            <td
                              key={cell.g}
                              className={`p-1.5 font-bold ${
                                isCurrent
                                  ? "bg-[#8C6A2E] text-white rounded"
                                  : cell.valid
                                  ? "text-[#211E19]"
                                  : "text-[#9A927E]"
                              }`}
                            >
                              {cell.valid ? `₹${cell.sharePrice.toFixed(0)}` : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[10px] text-[#686254] mt-2 leading-relaxed">
                Highlighted cell represents current base case. Notice how a mere 50 bps reduction in WACC or 50 bps increase in terminal growth rate creates massive upside in equity value per share.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
