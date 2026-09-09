"use client";

import React, { useState, useMemo } from "react";

export default function TabRiskReturn() {
  // Mode selection: Portfolio Diversification vs CAPM SML
  const [activeSubMode, setActiveSubMode] = useState<"diversification" | "capm">("capm");

  // CAPM SML State
  const [rfRate, setRfRate] = useState<number>(6.5); // % Risk-Free Rate (e.g. 10Y GOI bond)
  const [marketReturn, setMarketReturn] = useState<number>(13.0); // % Expected Market Return (Nifty 50)
  const [stockBeta, setStockBeta] = useState<number>(1.25); // Stock Beta

  // Portfolio Diversification State
  const [returnA, setReturnA] = useState<number>(15.0); // % Asset A Return
  const [sigmaA, setSigmaA] = useState<number>(22.0); // % Asset A Risk
  const [returnB, setReturnB] = useState<number>(8.0); // % Asset B Return
  const [sigmaB, setSigmaB] = useState<number>(10.0); // % Asset B Risk
  const [weightA, setWeightA] = useState<number>(50); // % Weight in Asset A
  const [correlation, setCorrelation] = useState<number>(0.2); // Correlation rho (-1 to +1)

  // CAPM Calculations
  const marketRiskPremium = marketReturn - rfRate; // RPM
  const requiredReturn = rfRate + stockBeta * marketRiskPremium; // CAPM equation

  // 2-Asset Portfolio Calculations
  const wA = weightA / 100;
  const wB = 1 - wA;
  const portfolioReturn = wA * returnA + wB * returnB;
  const portfolioVariance =
    Math.pow(wA, 2) * Math.pow(sigmaA, 2) +
    Math.pow(wB, 2) * Math.pow(sigmaB, 2) +
    2 * wA * wB * correlation * sigmaA * sigmaB;
  const portfolioRisk = Math.sqrt(Math.max(0, portfolioVariance));
  const weightedAvgRisk = wA * sigmaA + wB * sigmaB;
  const diversificationBenefit = weightedAvgRisk - portfolioRisk;

  // Generate Portfolio Frontier Curve points for SVG
  const frontierPoints = useMemo(() => {
    const pts: { risk: number; ret: number }[] = [];
    for (let wa = 0; wa <= 1.01; wa += 0.05) {
      const wb = 1 - wa;
      const ret = wa * returnA + wb * returnB;
      const v =
        Math.pow(wa, 2) * Math.pow(sigmaA, 2) +
        Math.pow(wb, 2) * Math.pow(sigmaB, 2) +
        2 * wa * wb * correlation * sigmaA * sigmaB;
      const risk = Math.sqrt(Math.max(0, v));
      pts.push({ risk, ret });
    }
    return pts;
  }, [returnA, sigmaA, returnB, sigmaB, correlation]);

  // SML SVG Geometry
  const smlWidth = 460;
  const smlHeight = 220;
  const getSmlX = (beta: number) => (beta / 2.5) * (smlWidth - 60) + 40;
  const getSmlY = (ret: number) => smlHeight - 30 - ((ret - 4) / 18) * (smlHeight - 60);

  // Frontier SVG Geometry
  const fWidth = 460;
  const fHeight = 220;
  const getFrontierX = (r: number) => (r / 30) * (fWidth - 60) + 40;
  const getFrontierY = (ret: number) => fHeight - 30 - ((ret - 5) / 15) * (fHeight - 60);

  const frontierPolyline = frontierPoints
    .map((pt) => `${getFrontierX(pt.risk).toFixed(1)},${getFrontierY(pt.ret).toFixed(1)}`)
    .join(" ");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#3D7A52]/10 text-[#3D7A52] mb-2 mono">
              Sessions 12 &amp; 13 • Modern Portfolio Theory &amp; Asset Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Risk, Return &amp; The Capital Asset Pricing Model (CAPM)
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Investors are inherently risk-averse. Diversification eliminates idiosyncratic firm-specific risk,
              leaving only <strong>systematic market risk (Beta)</strong>. CAPM defines the minimum hurdle rate
              demanded by equity investors to hold a stock.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Cost of Equity (r<sub>s</sub>)</span>
            <span className="text-xl font-black font-mono text-[#3D7A52] block mt-0.5">
              {requiredReturn.toFixed(2)}%
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">
              Hurdle Rate at β = {stockBeta.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Systematic vs Diversifiable Risk</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Total stand-alone risk (σ) consists of two distinct components:
          </p>
          <div className="mt-2 space-y-2 text-xs">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#3D7A52]">Diversifiable Risk:</strong> Caused by lawsuits, strikes, failed R&amp;D. Can be eliminated at zero cost by holding a 30-40 stock portfolio.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong className="text-[#BB3B2E]">Systematic (Market) Risk:</strong> Macro interest rates, inflation, wars, recessions. Affects all firms and cannot be diversified!
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Beta Coefficient (β) Derivation</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Beta measures a stock’s sensitivity to broad market movements:
          </p>
          <div className="mt-2 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            β<sub>i</sub> = (Cov<sub>i,M</sub>) / σ<sub>M</sub><sup>2</sup> = ρ<sub>i,M</sub> × (σ<sub>i</sub> / σ<sub>M</sub>)
          </div>
          <div className="mt-2 text-xs text-[#686254] space-y-1">
            <p>• <strong>β = 1.0:</strong> Stock moves in tandem with the overall market index.</p>
            <p>• <strong>β &gt; 1.0 (e.g. 1.5):</strong> Aggressive stock (tech, luxury); 50% more volatile.</p>
            <p>• <strong>β &lt; 1.0 (e.g. 0.6):</strong> Defensive stock (FMCG, utilities, pharmaceuticals).</p>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Security Market Line (SML)</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            The graphical representation of CAPM:
          </p>
          <div className="mt-2 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            r<sub>i</sub> = r<sub>RF</sub> + β<sub>i</sub> × (r<sub>M</sub> - r<sub>RF</sub>)
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            • <strong>Undervalued Stocks:</strong> Plot <em>above</em> the SML (offering higher expected return than required).<br />
            • <strong>Overvalued Stocks:</strong> Plot <em>below</em> the SML (underperforming their risk hurdle rate).
          </p>
        </div>
      </div>

      {/* Interactive Workbench: SML Playground & Markowitz Diversifier */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#3D7A52] uppercase tracking-wider mono">Interactive Workbench</span>
            <h3 className="text-xl font-black text-[#211E19]">
              CAPM Security Market Line &amp; Portfolio Diversification Lab
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 rounded-lg border border-[#EAE5D8]">
            <button
              onClick={() => setActiveSubMode("capm")}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                activeSubMode === "capm"
                  ? "bg-[#3D7A52] text-white shadow-xs"
                  : "text-[#686254] hover:text-[#211E19]"
              }`}
            >
              CAPM SML Workbench
            </button>
            <button
              onClick={() => setActiveSubMode("diversification")}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                activeSubMode === "diversification"
                  ? "bg-[#3D7A52] text-white shadow-xs"
                  : "text-[#686254] hover:text-[#211E19]"
              }`}
            >
              2-Asset Diversification Frontier
            </button>
          </div>
        </div>

        {/* Submode 1: CAPM SML */}
        {activeSubMode === "capm" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
                CAPM Capital Market Parameters
              </div>

              {/* Stock Beta */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="risk-stock-beta-slider">Stock Beta (β):</label>
                  <span className="font-mono text-[#3D7A52]">{stockBeta.toFixed(2)}</span>
                </div>
                <input
                  id="risk-stock-beta-slider"
                  type="range"
                  min="0.2"
                  max="2.2"
                  step="0.05"
                  value={stockBeta}
                  onChange={(e) => setStockBeta(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
                />
              </div>

              {/* Risk-Free Rate */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="risk-rf-rate-slider">Risk-Free Rate (r<sub>RF</sub>):</label>
                  <span className="font-mono text-[#2E5C8A]">{rfRate.toFixed(2)}% (10Y GOI)</span>
                </div>
                <input
                  id="risk-rf-rate-slider"
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.25"
                  value={rfRate}
                  onChange={(e) => setRfRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
                />
              </div>

              {/* Market Return */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="risk-market-return-slider">Expected Market Return (r<sub>M</sub>):</label>
                  <span className="font-mono text-[#8C6A2E]">{marketReturn.toFixed(2)}% (Nifty 50)</span>
                </div>
                <input
                  id="risk-market-return-slider"
                  type="range"
                  min="9.0"
                  max="18.0"
                  step="0.5"
                  value={marketReturn}
                  onChange={(e) => setMarketReturn(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
                />
              </div>

              <div className="p-3 bg-white border border-[#C7BFA9] rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#686254]">Market Risk Premium (RPM = r<sub>M</sub> - r<sub>RF</sub>):</span>
                  <span className="font-mono font-bold">{marketRiskPremium.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#686254]">Risk Premium on Stock (β × RPM):</span>
                  <span className="font-mono font-bold text-[#3D7A52]">{(stockBeta * marketRiskPremium).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#EAE5D8] font-black">
                  <span className="text-[#211E19]">Cost of Equity (r<sub>s</sub>):</span>
                  <span className="font-mono text-[#3D7A52]">{requiredReturn.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* SML Interactive SVG Chart */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider mono">
                    Security Market Line (SML) Dynamic Graph
                  </span>
                  <span className="text-[10px] font-mono text-[#3D7A52]">
                    Slope = Market Risk Premium ({marketRiskPremium.toFixed(1)}%)
                  </span>
                </div>

                <div className="w-full bg-white border border-[#EAE5D8] rounded-lg p-2 flex justify-center">
                  <svg viewBox={`0 0 ${smlWidth} ${smlHeight}`} className="w-full max-w-[460px] h-auto font-mono text-[9px]">
                    {/* Axes */}
                    <line x1="40" y1={smlHeight - 30} x2={smlWidth - 20} y2={smlHeight - 30} stroke="#DCD5C4" strokeWidth="1" />
                    <line x1="40" y1="20" x2="40" y2={smlHeight - 30} stroke="#DCD5C4" strokeWidth="1" />

                    {/* SML Line: from (Beta=0, r=rfRate) to (Beta=2.2, r=rfRate + 2.2*RPM) */}
                    <line
                      x1={getSmlX(0)}
                      y1={getSmlY(rfRate)}
                      x2={getSmlX(2.2)}
                      y2={getSmlY(rfRate + 2.2 * marketRiskPremium)}
                      stroke="#3D7A52"
                      strokeWidth="2.5"
                    />

                    {/* Market Portfolio Point (Beta = 1.0, r = rM) */}
                    <circle cx={getSmlX(1.0)} cy={getSmlY(marketReturn)} r="4" fill="#2E5C8A" />
                    <text x={getSmlX(1.0) + 6} y={getSmlY(marketReturn) + 3} fill="#2E5C8A" fontWeight="bold">
                      Market (1.0, {marketReturn}%)
                    </text>

                    {/* Current Stock Point */}
                    <circle cx={getSmlX(stockBeta)} cy={getSmlY(requiredReturn)} r="6" fill="#BB3B2E" />
                    <circle cx={getSmlX(stockBeta)} cy={getSmlY(requiredReturn)} r="10" fill="#BB3B2E" opacity="0.25" />
                    <text x={getSmlX(stockBeta) + 8} y={getSmlY(requiredReturn) + 3} fill="#BB3B2E" fontWeight="bold">
                      Stock (β={stockBeta.toFixed(2)}, {requiredReturn.toFixed(1)}%)
                    </text>

                    {/* Axis Labels */}
                    <text x={getSmlX(0)} y={smlHeight - 12} fill="#686254" textAnchor="middle">0.0</text>
                    <text x={getSmlX(1.0)} y={smlHeight - 12} fill="#686254" textAnchor="middle">1.0</text>
                    <text x={getSmlX(2.0)} y={smlHeight - 12} fill="#686254" textAnchor="middle">2.0</text>
                    <text x={smlWidth / 2} y={smlHeight - 12} fill="#686254" textAnchor="middle">Risk (Beta β) →</text>

                    <text x={25} y={30} fill="#686254" textAnchor="middle" transform={`rotate(-90 25 30)`}>Required Return (%)</text>
                  </svg>
                </div>

                <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
                  The SML intercepts the vertical axis at the risk-free rate <strong>{rfRate}%</strong>. The slope equals the Market Risk Premium. If inflation rises, the entire line shifts upward in parallel. If market risk aversion increases, the line rotates steeper.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submode 2: Markowitz 2-Asset Diversification */}
        {activeSubMode === "diversification" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
                2-Asset Portfolio Simulator
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="risk-weight-a-slider">Weight in Asset A (w<sub>A</sub>):</label>
                  <span className="font-mono text-[#3D7A52]">{weightA}% (Asset B: {100 - weightA}%)</span>
                </div>
                <input
                  id="risk-weight-a-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weightA}
                  onChange={(e) => setWeightA(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="risk-correlation-slider">Correlation Coefficient (ρ<sub>AB</sub>):</label>
                  <span className="font-mono text-[#8C6A2E]">{correlation.toFixed(2)}</span>
                </div>
                <input
                  id="risk-correlation-slider"
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.05"
                  value={correlation}
                  onChange={(e) => setCorrelation(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
                />
                <div className="flex justify-between text-[10px] text-[#9A927E] mt-0.5 mono">
                  <span>-1.0 (Perfect Hedge)</span>
                  <span>0.0 (Uncorrelated)</span>
                  <span>+1.0 (No Diversification)</span>
                </div>
              </div>

              {/* Asset A Parameters */}
              <div className="p-2.5 bg-white rounded border border-[#C7BFA9] space-y-2 text-xs">
                <span className="font-bold text-[#211E19] block">Asset A (Equities)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#686254] block">Return %:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={returnA}
                      onChange={(e) => setReturnA(Number(e.target.value))}
                      className="w-full px-1.5 py-0.5 border rounded font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#686254] block">Risk (σ) %:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sigmaA}
                      onChange={(e) => setSigmaA(Number(e.target.value))}
                      className="w-full px-1.5 py-0.5 border rounded font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Asset B Parameters */}
              <div className="p-2.5 bg-white rounded border border-[#C7BFA9] space-y-2 text-xs">
                <span className="font-bold text-[#211E19] block">Asset B (Bonds)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#686254] block">Return %:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={returnB}
                      onChange={(e) => setReturnB(Number(e.target.value))}
                      className="w-full px-1.5 py-0.5 border rounded font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#686254] block">Risk (σ) %:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sigmaB}
                      onChange={(e) => setSigmaB(Number(e.target.value))}
                      className="w-full px-1.5 py-0.5 border rounded font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                  <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Portfolio Return</span>
                  <span className="text-xl font-black font-mono text-[#2E5C8A] mt-0.5 block">{portfolioReturn.toFixed(2)}%</span>
                  <span className="text-[10px] text-[#9A927E] block mt-0.5">Weighted Average</span>
                </div>
                <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                  <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Portfolio Risk (σ<sub>p</sub>)</span>
                  <span className="text-xl font-black font-mono text-[#3D7A52] mt-0.5 block">{portfolioRisk.toFixed(2)}%</span>
                  <span className="text-[10px] text-[#9A927E] block mt-0.5">Weighted Avg: {weightedAvgRisk.toFixed(1)}%</span>
                </div>
                <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                  <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Risk Free Lunch</span>
                  <span className="text-xl font-black font-mono text-[#8C6A2E] mt-0.5 block">
                    {diversificationBenefit > 0 ? `-${diversificationBenefit.toFixed(2)}%` : "0.0%"}
                  </span>
                  <span className="text-[10px] text-[#9A927E] block mt-0.5">Diversification Benefit</span>
                </div>
              </div>

              {/* Markowitz Frontier SVG */}
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider mono">
                    Markowitz 2-Asset Frontier Curve
                  </span>
                  <span className="text-[10px] font-mono text-[#3D7A52]">
                    Current: ({portfolioRisk.toFixed(1)}% Risk, {portfolioReturn.toFixed(1)}% Return)
                  </span>
                </div>

                <div className="w-full bg-white border border-[#EAE5D8] rounded-lg p-2 flex justify-center">
                  <svg viewBox={`0 0 ${fWidth} ${fHeight}`} className="w-full max-w-[460px] h-auto font-mono text-[9px]">
                    {/* Axes */}
                    <line x1="40" y1={fHeight - 30} x2={fWidth - 20} y2={fHeight - 30} stroke="#DCD5C4" strokeWidth="1" />
                    <line x1="40" y1="20" x2="40" y2={fHeight - 30} stroke="#DCD5C4" strokeWidth="1" />

                    {/* Frontier Line */}
                    <polyline fill="none" stroke="#2E5C8A" strokeWidth="2.5" points={frontierPolyline} />

                    {/* Current Portfolio Point */}
                    <circle cx={getFrontierX(portfolioRisk)} cy={getFrontierY(portfolioReturn)} r="6" fill="#BB3B2E" />
                    <circle cx={getFrontierX(portfolioRisk)} cy={getFrontierY(portfolioReturn)} r="10" fill="#BB3B2E" opacity="0.25" />

                    {/* Axis labels */}
                    <text x={40} y={fHeight - 12} fill="#686254" textAnchor="middle">0%</text>
                    <text x={fWidth / 2} y={fHeight - 12} fill="#686254" textAnchor="middle">Portfolio Risk (σ) →</text>
                    <text x={fWidth - 20} y={fHeight - 12} fill="#686254" textAnchor="middle">30%</text>

                    <text x={25} y={30} fill="#686254" textAnchor="middle" transform={`rotate(-90 25 30)`}>Expected Return (%)</text>
                  </svg>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded-xl text-xs text-[#686254] leading-relaxed">
                <strong className="text-[#3D7A52]">Markowitz Insight:</strong> Whenever correlation is less than +1.0, the portfolio frontier bows outward to the left. At ρ = {correlation.toFixed(2)}, combining volatile equities and steady bonds shaves <strong>{diversificationBenefit.toFixed(2)} percentage points</strong> off your total risk without sacrificing your return!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
