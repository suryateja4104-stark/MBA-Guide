"use client";

import React, { useState, useMemo } from "react";

export default function TabBonds() {
  // Bond inputs
  const [parValue, setParValue] = useState<number>(1000); // ₹ Par / Face Value
  const [couponRate, setCouponRate] = useState<number>(8.0); // % annual coupon
  const [yearsToMaturity, setYearsToMaturity] = useState<number>(10); // Years N
  const [marketYield, setMarketYield] = useState<number>(7.5); // % YTM (rd)
  const [taxRate, setTaxRate] = useState<number>(25); // % Corporate tax rate
  const [isSemiAnnual, setIsSemiAnnual] = useState<boolean>(true);

  // Bond Price Calculation
  const bondPricing = useMemo(() => {
    const m = isSemiAnnual ? 2 : 1;
    const totalPeriods = yearsToMaturity * m;
    const periodicRate = marketYield / 100 / m;
    const periodicCoupon = ((parValue * (couponRate / 100)) / m);

    let price = 0;
    if (periodicRate === 0) {
      price = periodicCoupon * totalPeriods + parValue;
    } else {
      // PV of coupons annuity + PV of par lump sum
      const pvCoupons = periodicCoupon * ((1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate);
      const pvPar = parValue / Math.pow(1 + periodicRate, totalPeriods);
      price = pvCoupons + pvPar;
    }

    const annualCouponTotal = parValue * (couponRate / 100);
    const currentYield = price > 0 ? (annualCouponTotal / price) * 100 : 0;
    const capitalGainsYield = marketYield - currentYield;
    const afterTaxCostOfDebt = marketYield * (1 - taxRate / 100);

    // Approximate Modified Duration
    const deltaY = 0.001; // 10 bps
    const pUp =
      periodicCoupon * ((1 - Math.pow(1 + (periodicRate + deltaY), -totalPeriods)) / (periodicRate + deltaY)) +
      parValue / Math.pow(1 + (periodicRate + deltaY), totalPeriods);
    const pDown =
      periodicCoupon * ((1 - Math.pow(1 + (periodicRate - deltaY), -totalPeriods)) / (periodicRate - deltaY)) +
      parValue / Math.pow(1 + (periodicRate - deltaY), totalPeriods);
    const approxDuration = ((pDown - pUp) / (2 * price * deltaY));

    return {
      price,
      currentYield,
      capitalGainsYield,
      afterTaxCostOfDebt,
      approxDuration,
      status:
        price > parValue + 0.5 ? "Premium" : price < parValue - 0.5 ? "Discount" : "Par",
    };
  }, [parValue, couponRate, yearsToMaturity, marketYield, taxRate, isSemiAnnual]);

  // Generate Price-Yield Curve points for SVG
  const curvePoints = useMemo(() => {
    const points: { ytm: number; price: number }[] = [];
    const m = isSemiAnnual ? 2 : 1;
    const totalPeriods = yearsToMaturity * m;
    const periodicCoupon = (parValue * (couponRate / 100)) / m;

    for (let y = 3; y <= 16; y += 0.5) {
      const pRate = y / 100 / m;
      const p =
        periodicCoupon * ((1 - Math.pow(1 + pRate, -totalPeriods)) / pRate) +
        parValue / Math.pow(1 + pRate, totalPeriods);
      points.push({ ytm: y, price: p });
    }
    return points;
  }, [parValue, couponRate, yearsToMaturity, isSemiAnnual]);

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 220;
  const minPrice = 500;
  const maxPrice = 1800;
  const minYtm = 3;
  const maxYtm = 16;

  const getSvgX = (ytm: number) => ((ytm - minYtm) / (maxYtm - minYtm)) * (svgWidth - 60) + 40;
  const getSvgY = (p: number) => svgHeight - 30 - ((p - minPrice) / (maxPrice - minPrice)) * (svgHeight - 60);

  const polylineStr = curvePoints
    .map((pt) => `${getSvgX(pt.ytm).toFixed(1)},${getSvgY(pt.price).toFixed(1)}`)
    .join(" ");

  const currentX = getSvgX(marketYield);
  const currentY = getSvgY(bondPricing.price);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#2E5C8A]/10 text-[#2E5C8A] mb-2 mono">
              Session 8 • Fixed Income &amp; Debt Capital
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Bond Valuation, Yield to Maturity (YTM) &amp; Cost of Debt
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Bonds represent contractual fixed-income obligations. Bond prices move <strong>inversely to market yields</strong>.
              Because interest expense is tax-deductible, a firm’s effective cost of debt is significantly lower than its nominal YTM.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Bond Status</span>
            <span
              className={`text-xl font-black font-mono block mt-0.5 ${
                bondPricing.status === "Premium"
                  ? "text-[#3D7A52]"
                  : bondPricing.status === "Discount"
                  ? "text-[#BB3B2E]"
                  : "text-[#8C6A2E]"
              }`}
            >
              {bondPricing.status} Bond
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">
              Price: ₹{bondPricing.price.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Price vs Yield Relationship</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Bond pricing follows an inverse convex trajectory:
          </p>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="p-1.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded font-mono">
              Coupon Rate &gt; YTM ⇒ <strong>Price &gt; Par (Premium)</strong>
            </div>
            <div className="p-1.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded font-mono">
              Coupon Rate = YTM ⇒ <strong>Price = Par</strong>
            </div>
            <div className="p-1.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded font-mono">
              Coupon Rate &lt; YTM ⇒ <strong>Price &lt; Par (Discount)</strong>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Price Risk vs Reinvestment Risk</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Interest rate volatility creates two opposing hazards:
          </p>
          <div className="mt-2 text-xs space-y-2 text-[#686254]">
            <p>
              • <strong>Price Risk:</strong> Rising interest rates cause bond prices to plummet. Price risk is highest for <em>long maturity</em> and <em>low coupon</em> bonds.
            </p>
            <p>
              • <strong>Reinvestment Risk:</strong> Falling interest rates force interim coupon cash flows to be reinvested at lower yields. Highest for <em>short maturity</em> and <em>high coupon</em> bonds.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">After-Tax Cost of Debt</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            In corporate capital structure, debt has a distinct tax advantage over equity:
          </p>
          <div className="mt-2.5 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            r<sub>d</sub>(after-tax) = r<sub>d</sub> × (1 - T)
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            If a company issues bonds at 8.0% YTM and faces a 25% tax rate, Uncle Sam effectively subsidizes 2.0%, leaving the company’s net cost at <strong>6.0%</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Bond Valuation & Convexity Workbench */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#2E5C8A] uppercase tracking-wider mono">Interactive Workbench</span>
            <h3 className="text-xl font-black text-[#211E19]">
              Live Bond Pricing, Convexity &amp; Cost of Debt Engine
            </h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Manipulate coupon rates, maturity duration, and market yields to observe the price sensitivity curve and tax shield.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setParValue(1000);
                setCouponRate(8.0);
                setYearsToMaturity(10);
                setMarketYield(7.5);
                setTaxRate(25);
                setIsSemiAnnual(true);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition mono"
            >
              Reset Baseline
            </button>
            <button
              onClick={() => {
                setCouponRate(5.5);
                setMarketYield(11.0);
                setYearsToMaturity(20);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#BB3B2E]/10 hover:bg-[#BB3B2E]/20 border border-[#BB3B2E]/30 text-[#BB3B2E] transition mono"
            >
              Rate Spike Shock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-5 rounded-xl border border-[#EAE5D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#686254] border-b border-[#EAE5D8] pb-2 mono">
              Bond Contract Parameters
            </div>

            {/* Coupon Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="bonds-coupon-rate-slider">Annual Coupon Rate:</label>
                <span className="font-mono text-[#8C6A2E]">{couponRate.toFixed(2)}%</span>
              </div>
              <input
                id="bonds-coupon-rate-slider"
                type="range"
                min="3.0"
                max="14.0"
                step="0.25"
                value={couponRate}
                onChange={(e) => setCouponRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
              />
            </div>

            {/* Market Required Yield (YTM) */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="bonds-market-yield-slider">Market Yield to Maturity (YTM):</label>
                <span className="font-mono text-[#2E5C8A]">{marketYield.toFixed(2)}%</span>
              </div>
              <input
                id="bonds-market-yield-slider"
                type="range"
                min="3.0"
                max="16.0"
                step="0.25"
                value={marketYield}
                onChange={(e) => setMarketYield(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
              />
            </div>

            {/* Years to Maturity */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="bonds-maturity-slider">Years to Maturity (N):</label>
                <span className="font-mono text-[#3D7A52]">{yearsToMaturity} Years</span>
              </div>
              <input
                id="bonds-maturity-slider"
                type="range"
                min="1"
                max="30"
                step="1"
                value={yearsToMaturity}
                onChange={(e) => setYearsToMaturity(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
              />
            </div>

            {/* Par Value & Tax Rate */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#EAE5D8]">
              <div>
                <label htmlFor="bonds-par-value-input" className="text-[11px] font-semibold text-[#686254] block">Par Value (M):</label>
                <input
                  id="bonds-par-value-input"
                  type="number"
                  step="100"
                  value={parValue}
                  onChange={(e) => setParValue(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="bonds-tax-rate-input" className="text-[11px] font-semibold text-[#686254] block">Tax Rate (%):</label>
                <input
                  id="bonds-tax-rate-input"
                  type="number"
                  step="1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
            </div>

            {/* Coupon Frequency Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#211E19]">Payment Frequency:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSemiAnnual(true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded border ${
                    isSemiAnnual ? "bg-[#2E5C8A] text-white border-[#2E5C8A]" : "bg-white text-[#686254]"
                  }`}
                >
                  Semi-Annual (Standard)
                </button>
                <button
                  onClick={() => setIsSemiAnnual(false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded border ${
                    !isSemiAnnual ? "bg-[#2E5C8A] text-white border-[#2E5C8A]" : "bg-white text-[#686254]"
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>
          </div>

          {/* Results Display & SVG Chart */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Price & Cost of Debt Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Clean Bond Price</span>
                <span className="text-lg font-black font-mono text-[#2E5C8A] mt-0.5 block">
                  ₹{bondPricing.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">Par = ₹{parValue}</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Current Yield</span>
                <span className="text-lg font-black font-mono text-[#8C6A2E] mt-0.5 block">
                  {bondPricing.currentYield.toFixed(2)}%
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">Coupon / Price</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Duration Approx</span>
                <span className="text-lg font-black font-mono text-[#3D7A52] mt-0.5 block">
                  {bondPricing.approxDuration.toFixed(1)} yrs
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">Price Sensitivity</span>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">After-Tax r<sub>d</sub></span>
                <span className="text-lg font-black font-mono text-[#BB3B2E] mt-0.5 block">
                  {bondPricing.afterTaxCostOfDebt.toFixed(2)}%
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">YTM × (1 - {taxRate}%)</span>
              </div>
            </div>

            {/* SVG Price-Yield Convex Curve Chart */}
            <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider mono">
                  Convex Price-Yield Sensitivity Curve
                </span>
                <span className="text-[10px] font-mono text-[#2E5C8A]">
                  Current YTM: {marketYield}% | Price: ₹{bondPricing.price.toFixed(1)}
                </span>
              </div>

              <div className="w-full bg-white border border-[#EAE5D8] rounded-lg p-2 flex justify-center">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[480px] h-auto font-mono text-[9px]">
                  {/* Grid Lines */}
                  <line x1="40" y1={svgHeight - 30} x2={svgWidth - 20} y2={svgHeight - 30} stroke="#DCD5C4" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2={svgHeight - 30} stroke="#DCD5C4" strokeWidth="1" />

                  {/* Par Value reference line */}
                  <line
                    x1="40"
                    y1={getSvgY(parValue)}
                    x2={svgWidth - 20}
                    y2={getSvgY(parValue)}
                    stroke="#C7BFA9"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text x={svgWidth - 18} y={getSvgY(parValue) + 3} fill="#9A927E" textAnchor="end">Par (₹{parValue})</text>

                  {/* Convex Curve */}
                  <polyline fill="none" stroke="#2E5C8A" strokeWidth="2.5" points={polylineStr} />

                  {/* Current Point */}
                  <circle cx={currentX} cy={currentY} r="5" fill="#BB3B2E" />
                  <circle cx={currentX} cy={currentY} r="9" fill="#BB3B2E" opacity="0.2" />

                  {/* Axis labels */}
                  <text x={40} y={svgHeight - 12} fill="#686254" textAnchor="middle">3%</text>
                  <text x={svgWidth / 2} y={svgHeight - 12} fill="#686254" textAnchor="middle">Market Yield to Maturity (YTM) →</text>
                  <text x={svgWidth - 20} y={svgHeight - 12} fill="#686254" textAnchor="middle">16%</text>

                  <text x={25} y={30} fill="#686254" textAnchor="middle" transform={`rotate(-90 25 30)`}>Price (₹)</text>
                </svg>
              </div>

              <div className="mt-2 text-[11px] text-[#686254] leading-relaxed">
                Notice the upward curve (convexity): Bond prices gain <em>more</em> when yields fall than they lose when yields rise by the same margin!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
