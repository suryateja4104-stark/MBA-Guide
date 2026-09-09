"use client";

import React, { useState } from "react";

export default function TabTVM() {
  // Mode selection
  const [tvmMode, setTvmMode] = useState<"annuity" | "amortization" | "compounding">("amortization");

  // Amortization State
  const [loanAmount, setLoanAmount] = useState<number>(50); // ₹ Lakhs
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.5); // % annual
  const [loanTermYears, setLoanTermYears] = useState<number>(5); // Years

  // Annuity State
  const [annuityPmt, setAnnuityPmt] = useState<number>(100000); // ₹
  const [annuityRate, setAnnuityRate] = useState<number>(8); // %
  const [annuityYears, setAnnuityYears] = useState<number>(10);
  const [isAnnuityDue, setIsAnnuityDue] = useState<boolean>(false);

  // Compounding / EAR State
  const [pvSingle, setPvSingle] = useState<number>(100000);
  const [nomRate, setNomRate] = useState<number>(9);
  const [compFreq, setCompFreq] = useState<number>(12); // Monthly = 12, Semi = 2, Annual = 1
  const [compYears, setCompYears] = useState<number>(5);

  // Amortization Computations
  const r = loanInterestRate / 100;
  const n = loanTermYears;
  const annualPayment =
    r > 0 ? (loanAmount * 100000 * r) / (1 - Math.pow(1 + r, -n)) : (loanAmount * 100000) / n;

  // Build Schedule
  const schedule = [];
  let currentBalance = loanAmount * 100000;
  let totalInterest = 0;
  for (let year = 1; year <= loanTermYears; year++) {
    const interestPaid = currentBalance * r;
    const principalPaid = annualPayment - interestPaid;
    const endBalance = Math.max(0, currentBalance - principalPaid);
    totalInterest += interestPaid;
    schedule.push({
      year,
      startBalance: currentBalance,
      payment: annualPayment,
      interestPaid,
      principalPaid,
      endBalance,
    });
    currentBalance = endBalance;
  }

  // Annuity Computations
  const rAnn = annuityRate / 100;
  const pvOrdinary =
    rAnn > 0 ? (annuityPmt * (1 - Math.pow(1 + rAnn, -annuityYears))) / rAnn : annuityPmt * annuityYears;
  const fvOrdinary =
    rAnn > 0 ? (annuityPmt * (Math.pow(1 + rAnn, annuityYears) - 1)) / rAnn : annuityPmt * annuityYears;
  const pvAnnuity = isAnnuityDue ? pvOrdinary * (1 + rAnn) : pvOrdinary;
  const fvAnnuity = isAnnuityDue ? fvOrdinary * (1 + rAnn) : fvOrdinary;

  // Compounding Computations
  const periodicRate = nomRate / 100 / compFreq;
  const totalPeriods = compFreq * compYears;
  const fvSingle = pvSingle * Math.pow(1 + periodicRate, totalPeriods);
  const ear = (Math.pow(1 + periodicRate, compFreq) - 1) * 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#8C6A2E]/10 text-[#8C6A2E] mb-2 mono">
              Sessions 6 &amp; 7 • Valuation Foundations
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Time Value of Money (TVM) &amp; Loan Amortization
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Money has time value because of opportunity cost, risk, and purchasing power erosion. Every financial
              instrument—from bonds and stocks to corporate leaseholds and project capital expenditures—is valued
              by discounting future expected cash flows.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Core Rule</span>
            <span className="text-sm font-black text-[#8C6A2E] block mt-0.5">PV = FV / (1+r)<sup>n</sup></span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">Discounting Compounded Cash</span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Ordinary Annuity vs Annuity Due</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Annuities consist of equal periodic cash flows:
          </p>
          <div className="mt-2 space-y-2 text-xs">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong>Ordinary Annuity:</strong> Payments occur at the <em>end</em> of each period (e.g., corporate bonds, auto loans, mortgages).
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong>Annuity Due:</strong> Payments occur at the <em>beginning</em> of each period (e.g., apartment leases, life insurance premiums).
              <div className="mt-1 font-mono text-[11px] text-[#8C6A2E]">PV<sub>due</sub> = PV<sub>ord</sub> × (1 + r)</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Perpetuities &amp; Terminal Value</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            A perpetuity is an infinite series of constant cash flows:
          </p>
          <div className="mt-2 space-y-1.5 font-mono text-xs">
            <div className="p-2 bg-[#F4F1E9] border border-[#DCD5C4] rounded">
              <strong>Constant:</strong> PV = PMT / r
            </div>
            <div className="p-2 bg-[#F4F1E9] border border-[#DCD5C4] rounded">
              <strong>Growing:</strong> PV = PMT<sub>1</sub> / (r - g)
            </div>
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            *The Gordon Growth perpetuity is the mathematical engine behind terminal value calculations in corporate DCF models!
          </p>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#3D7A52]/15 text-[#3D7A52] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">APR vs Effective Annual Rate (EAR)</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            When compounding occurs more frequently than once a year:
          </p>
          <div className="mt-2 p-2 bg-[#F4F1E9] rounded border border-[#DCD5C4] font-mono text-xs text-center text-[#211E19]">
            EAR = [1 + (r<sub>nom</sub> / m)]<sup>m</sup> - 1
          </div>
          <p className="text-[11px] text-[#686254] mt-2 leading-relaxed">
            A credit card quoting a nominal 18% APR with daily compounding (m = 365) charges an actual Effective Annual Rate of <strong>19.72%</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Workbench: Multi-Mode TVM Suite */}
      <div className="bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#EAE5D8] pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-[#8C6A2E] uppercase tracking-wider mono">Interactive Suite</span>
            <h3 className="text-xl font-black text-[#211E19]">
              Comprehensive TVM, Annuity &amp; Amortization Lab
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 rounded-lg border border-[#EAE5D8]">
            <button
              onClick={() => setTvmMode("amortization")}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                tvmMode === "amortization"
                  ? "bg-[#8C6A2E] text-white shadow-xs"
                  : "text-[#686254] hover:text-[#211E19]"
              }`}
            >
              Loan Amortization
            </button>
            <button
              onClick={() => setTvmMode("annuity")}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                tvmMode === "annuity"
                  ? "bg-[#8C6A2E] text-white shadow-xs"
                  : "text-[#686254] hover:text-[#211E19]"
              }`}
            >
              Annuity Due vs Ordinary
            </button>
            <button
              onClick={() => setTvmMode("compounding")}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                tvmMode === "compounding"
                  ? "bg-[#8C6A2E] text-white shadow-xs"
                  : "text-[#686254] hover:text-[#211E19]"
              }`}
            >
              Compounding &amp; EAR
            </button>
          </div>
        </div>

        {/* Mode 1: Loan Amortization */}
        {tvmMode === "amortization" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF8F2] p-4 rounded-xl border border-[#EAE5D8]">
              <div>
                <label htmlFor="tvm-loan-amount-slider" className="text-xs font-semibold text-[#211E19] block">
                  Loan Principal: <span className="font-mono text-[#8C6A2E]">₹{loanAmount} Lakhs</span>
                </label>
                <input
                  id="tvm-loan-amount-slider"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#8C6A2E]"
                />
              </div>
              <div>
                <label htmlFor="tvm-loan-interest-slider" className="text-xs font-semibold text-[#211E19] block">
                  Annual Interest Rate: <span className="font-mono text-[#2E5C8A]">{loanInterestRate}%</span>
                </label>
                <input
                  id="tvm-loan-interest-slider"
                  type="range"
                  min="4"
                  max="18"
                  step="0.25"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#2E5C8A]"
                />
              </div>
              <div>
                <label htmlFor="tvm-loan-term-slider" className="text-xs font-semibold text-[#211E19] block">
                  Loan Term: <span className="font-mono text-[#3D7A52]">{loanTermYears} Years</span>
                </label>
                <input
                  id="tvm-loan-term-slider"
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCD5C4] rounded-lg appearance-none cursor-pointer mt-1.5 accent-[#3D7A52]"
                />
              </div>
            </div>

            {/* Key Payment Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Equal Annual Payment (PMT)</span>
                <span className="text-lg font-black font-mono text-[#8C6A2E] mt-0.5 block">
                  ₹{annualPayment.toLocaleString("en-IN", { maximumFractionDigits: 0 })} / yr
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">Total Outflow: ₹{(annualPayment * n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Total Interest Over Life</span>
                <span className="text-lg font-black font-mono text-[#BB3B2E] mt-0.5 block">
                  ₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">{((totalInterest / (loanAmount * 100000)) * 100).toFixed(1)}% of Principal</span>
              </div>
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-lg p-3">
                <span className="text-[10px] font-bold text-[#686254] uppercase tracking-wider block">Payment Structure Shift</span>
                <span className="text-xs font-semibold text-[#211E19] mt-1 block">
                  Yr 1 Interest: {((schedule[0]?.interestPaid / annualPayment) * 100).toFixed(0)}% → Yr {n} Interest: {((schedule[schedule.length - 1]?.interestPaid / annualPayment) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-[#9A927E] block mt-0.5">Principal portion expands over time</span>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="overflow-x-auto border border-[#DCD5C4] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F2] text-[#686254] font-mono border-b border-[#DCD5C4]">
                  <tr>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">Beginning Balance</th>
                    <th className="p-2.5">Total Payment</th>
                    <th className="p-2.5">Interest Paid</th>
                    <th className="p-2.5">Principal Paid</th>
                    <th className="p-2.5">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F2] font-mono">
                  {schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-[#FAF8F2]/60">
                      <td className="p-2.5 font-bold text-[#211E19]">Yr {row.year}</td>
                      <td className="p-2.5 text-[#686254]">₹{row.startBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 font-bold text-[#8C6A2E]">₹{row.payment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 text-[#BB3B2E]">₹{row.interestPaid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 text-[#3D7A52]">₹{row.principalPaid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 font-bold text-[#211E19]">₹{row.endBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mode 2: Annuities */}
        {tvmMode === "annuity" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FAF8F2] p-4 rounded-xl border border-[#EAE5D8]">
              <div>
                <label htmlFor="tvm-annuity-pmt-input" className="text-xs font-semibold text-[#211E19] block">Periodic Payment (PMT):</label>
                <input
                  id="tvm-annuity-pmt-input"
                  type="number"
                  step="10000"
                  value={annuityPmt}
                  onChange={(e) => setAnnuityPmt(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="tvm-annuity-rate-input" className="text-xs font-semibold text-[#211E19] block">Interest Rate (%):</label>
                <input
                  id="tvm-annuity-rate-input"
                  type="number"
                  step="0.5"
                  value={annuityRate}
                  onChange={(e) => setAnnuityRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="tvm-annuity-years-input" className="text-xs font-semibold text-[#211E19] block">Number of Periods (N):</label>
                <input
                  id="tvm-annuity-years-input"
                  type="number"
                  value={annuityYears}
                  onChange={(e) => setAnnuityYears(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#211E19] block">Timing of Payment:</label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setIsAnnuityDue(false)}
                    className={`px-2.5 py-1 text-xs font-bold rounded border ${
                      !isAnnuityDue ? "bg-[#8C6A2E] text-white border-[#8C6A2E]" : "bg-white text-[#686254]"
                    }`}
                  >
                    Ordinary (End)
                  </button>
                  <button
                    onClick={() => setIsAnnuityDue(true)}
                    className={`px-2.5 py-1 text-xs font-bold rounded border ${
                      isAnnuityDue ? "bg-[#3D7A52] text-white border-[#3D7A52]" : "bg-white text-[#686254]"
                    }`}
                  >
                    Due (Begin)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#686254] mono">Present Value (PV)</span>
                <div className="text-2xl font-black font-mono text-[#2E5C8A] mt-1">
                  ₹{pvAnnuity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-[#686254] mt-2">
                  Lump sum required today earning {annuityRate}% to withdraw ₹{annuityPmt.toLocaleString()} annually for {annuityYears} years.
                  {isAnnuityDue && <span className="block mt-1 text-[#3D7A52] font-semibold">Includes +{annuityRate}% timing multiplier for Annuity Due.</span>}
                </p>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#686254] mono">Future Value (FV)</span>
                <div className="text-2xl font-black font-mono text-[#3D7A52] mt-1">
                  ₹{fvAnnuity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-[#686254] mt-2">
                  Accumulated retirement wealth if you deposit ₹{annuityPmt.toLocaleString()} annually at {annuityRate}% for {annuityYears} years.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Compounding & EAR */}
        {tvmMode === "compounding" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FAF8F2] p-4 rounded-xl border border-[#EAE5D8]">
              <div>
                <label htmlFor="tvm-single-pv-input" className="text-xs font-semibold text-[#211E19] block">Initial Deposit (PV):</label>
                <input
                  id="tvm-single-pv-input"
                  type="number"
                  step="25000"
                  value={pvSingle}
                  onChange={(e) => setPvSingle(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="tvm-nominal-rate-input" className="text-xs font-semibold text-[#211E19] block">Nominal Rate APR (%):</label>
                <input
                  id="tvm-nominal-rate-input"
                  type="number"
                  step="0.5"
                  value={nomRate}
                  onChange={(e) => setNomRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
              <div>
                <label htmlFor="tvm-comp-freq-select" className="text-xs font-semibold text-[#211E19] block">Compounding Frequency:</label>
                <select
                  id="tvm-comp-freq-select"
                  value={compFreq}
                  onChange={(e) => setCompFreq(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                >
                  <option value={1}>Annual (m = 1)</option>
                  <option value={2}>Semi-Annual (m = 2)</option>
                  <option value={4}>Quarterly (m = 4)</option>
                  <option value={12}>Monthly (m = 12)</option>
                  <option value={365}>Daily (m = 365)</option>
                </select>
              </div>
              <div>
                <label htmlFor="tvm-comp-years-input" className="text-xs font-semibold text-[#211E19] block">Years (N):</label>
                <input
                  id="tvm-comp-years-input"
                  type="number"
                  value={compYears}
                  onChange={(e) => setCompYears(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-[#C7BFA9] rounded bg-white font-mono mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#686254] mono">Effective Annual Rate (EAR)</span>
                <div className="text-2xl font-black font-mono text-[#8C6A2E] mt-1">
                  {ear.toFixed(3)}%
                </div>
                <p className="text-xs text-[#686254] mt-2">
                  True annual economic yield after intra-year compounding. Compounding {compFreq} times a year creates a +{(ear - nomRate).toFixed(3)}% yield pickup over nominal rate.
                </p>
              </div>

              <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#686254] mono">Terminal Value (FV)</span>
                <div className="text-2xl font-black font-mono text-[#3D7A52] mt-1">
                  ₹{fvSingle.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-[#686254] mt-2">
                  Total accumulated principal + interest after {compYears} years ({totalPeriods} compounding intervals).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
