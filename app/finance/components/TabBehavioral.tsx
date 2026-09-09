"use client";

import React, { useState } from "react";

export default function TabBehavioral() {
  // Quiz state for Behavioral Biases
  const [q1Choice, setQ1Choice] = useState<string | null>(null);
  const [q2Choice, setQ2Choice] = useState<string | null>(null);
  const [emhSelectedScenario, setEmhSelectedScenario] = useState<number>(0);

  // Corporate Governance Alignment Audit Checklist
  const [govChecks, setGovChecks] = useState<Record<string, boolean>>({
    independentBoard: true,
    evaIncentives: true,
    clawbackPolicy: false,
    noPoisonPill: true,
    separateCeoChair: false,
  });

  const toggleGov = (key: string) => {
    setGovChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const govScore = Object.values(govChecks).filter(Boolean).length * 20;

  const emhScenarios = [
    {
      title: "Technical Charting (Head & Shoulders)",
      strategy: "An analyst tracks 50-day and 200-day moving averages and candlestick patterns to beat the market.",
      weakResult: "Fails: Past prices and trading volume are already fully impounded into the current market price.",
      semiResult: "Fails: Public information subsumes past trading history.",
      strongResult: "Fails completely.",
      verdict: "Violates Weak-Form EMH.",
    },
    {
      title: "Fundamental Analysis of Annual Reports",
      strategy: "A fund manager reads 10-K filings, parses footnotes, and builds DCF models to discover undervalued equities.",
      weakResult: "Possible: If markets are only weak-form efficient, fundamental research can generate abnormal alpha.",
      semiResult: "Fails: Markets adjust to new public financial disclosures within seconds of release.",
      strongResult: "Fails completely.",
      verdict: "Test of Semi-Strong Form EMH.",
    },
    {
      title: "Trading on Boardroom Merger Leak",
      strategy: "A senior executive buys call options 2 days before the board announces a multi-billion dollar acquisition.",
      weakResult: "Highly profitable.",
      semiResult: "Highly profitable (Public does not know yet).",
      strongResult: "Fails under Strong-Form EMH, but in reality generates huge illegal alpha. Confirms real markets are NOT Strong-Form efficient!",
      verdict: "Rejection of Strong-Form EMH.",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Banner */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#BB3B2E]/10 text-[#BB3B2E] mb-2 mono">
              Sessions 14 &amp; 15 • Market Efficiency &amp; Corporate Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#211E19] tracking-tight">
              Market Efficiency, Behavioral Finance &amp; Governance
            </h2>
            <p className="text-sm text-[#686254] mt-1 max-w-3xl leading-relaxed">
              Standard corporate finance assumes rational markets. Behavioral finance demonstrates that human cognitive
              biases and agency conflicts distort asset prices and corporate investments.
            </p>
          </div>
          <div className="bg-white border border-[#C7BFA9] rounded-lg p-3 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-[#686254] uppercase tracking-wider block">Governance Score</span>
            <span
              className={`text-2xl font-black font-mono block mt-0.5 ${
                govScore >= 80 ? "text-[#3D7A52]" : govScore >= 60 ? "text-[#8C6A2E]" : "text-[#BB3B2E]"
              }`}
            >
              {govScore}%
            </span>
            <span className="text-[10px] text-[#9A927E] block mt-0.5">Shareholder Alignment</span>
          </div>
        </div>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#2E5C8A]/15 text-[#2E5C8A] flex items-center justify-center font-bold text-sm mb-3 mono">
            01
          </div>
          <h3 className="text-base font-bold text-[#211E19]">The Three Forms of EMH</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Eugene Fama’s Efficient Market Hypothesis classifications:
          </p>
          <div className="mt-2 text-xs space-y-1.5">
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong>Weak-Form:</strong> All past prices and volume reflected. Technical charting cannot earn abnormal alpha.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong>Semi-Strong Form:</strong> All public news and accounting data reflected. Fundamental analysis cannot beat index.
            </div>
            <div className="p-2 bg-[#FAF8F2] border border-[#EAE5D8] rounded">
              <strong>Strong-Form:</strong> All public AND private insider info reflected. Even insiders cannot earn excess returns.
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#BB3B2E]/15 text-[#BB3B2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            02
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Prospect Theory &amp; Loss Aversion</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Kahneman &amp; Tversky discovered that human utility curves are asymmetric around the status quo:
          </p>
          <div className="mt-2 p-2.5 bg-[#FAF8F2] border border-[#EAE5D8] rounded text-xs text-[#686254] leading-relaxed">
            A financial loss of <strong>₹10,000 hurts 2 to 2.5 times more</strong> than a gain of ₹10,000 gives pleasure. This leads to the <em>Disposition Effect</em>: investors sell winners too quickly to lock in gains and hold losers indefinitely hoping to break even!
          </div>
        </div>

        <div className="bg-white border border-[#DCD5C4] rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#8C6A2E]/15 text-[#8C6A2E] flex items-center justify-center font-bold text-sm mb-3 mono">
            03
          </div>
          <h3 className="text-base font-bold text-[#211E19]">Agency Theory &amp; Governance</h3>
          <p className="text-xs text-[#686254] mt-2 leading-relaxed">
            Conflicts between principals (shareholders) and agents (managers):
          </p>
          <div className="mt-2 text-xs space-y-1.5 text-[#686254]">
            <p>• <strong>Empire Building:</strong> Expanding corporate revenue and acquiring other firms to boost CEO status, even when destroying EVA.</p>
            <p>• <strong>Alignment Fixes:</strong> Long-term equity options, tying executive bonuses to ROIC &gt; WACC, independent board majorities, and active institutional shareholder voting.</p>
          </div>
        </div>
      </div>

      {/* Interactive Workbench: Behavioral Diagnostics & EMH Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* EMH Interactive Classifier */}
        <div className="lg:col-span-6 bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#2E5C8A] uppercase tracking-wider mono">Interactive Lab</span>
            <h3 className="text-lg font-black text-[#211E19]">EMH Market Efficiency Scenario Analyzer</h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Select an investment strategy to observe which market efficiency forms are challenged.
            </p>

            <div className="flex gap-2 mt-4">
              {emhScenarios.map((sc, idx) => (
                <button
                  key={sc.title}
                  onClick={() => setEmhSelectedScenario(idx)}
                  className={`flex-1 p-2 text-xs font-bold rounded border text-center transition ${
                    emhSelectedScenario === idx
                      ? "bg-[#2E5C8A] text-white border-[#2E5C8A] shadow-xs"
                      : "bg-[#FAF8F2] text-[#686254] border-[#DCD5C4] hover:bg-[#EAE5D8]"
                  }`}
                >
                  Scenario {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-[#FAF8F2] border border-[#EAE5D8] rounded-xl space-y-2">
              <h4 className="text-sm font-black text-[#211E19]">
                {emhScenarios[emhSelectedScenario].title}
              </h4>
              <p className="text-xs text-[#686254]">
                {emhScenarios[emhSelectedScenario].strategy}
              </p>
              <div className="pt-2 border-t border-[#EAE5D8] space-y-1.5 text-xs">
                <div className="p-1.5 bg-white rounded border border-[#DCD5C4]">
                  <strong className="text-[#2E5C8A]">Under Weak-Form:</strong> {emhScenarios[emhSelectedScenario].weakResult}
                </div>
                <div className="p-1.5 bg-white rounded border border-[#DCD5C4]">
                  <strong className="text-[#8C6A2E]">Under Semi-Strong:</strong> {emhScenarios[emhSelectedScenario].semiResult}
                </div>
                <div className="p-1.5 bg-white rounded border border-[#DCD5C4]">
                  <strong className="text-[#3D7A52]">Verdict:</strong> {emhScenarios[emhSelectedScenario].verdict}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Behavioral Bias Diagnostic Quiz */}
        <div className="lg:col-span-6 bg-white border border-[#DCD5C4] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#BB3B2E] uppercase tracking-wider mono">Self-Diagnosis</span>
            <h3 className="text-lg font-black text-[#211E19]">Behavioral Bias Diagnostic Lab</h3>
            <p className="text-xs text-[#686254] mt-0.5">
              Choose your managerial response to uncover your unconscious behavioral tendencies.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              {/* Question 1 */}
              <div className="p-3 bg-[#FAF8F2] border border-[#EAE5D8] rounded-lg">
                <p className="font-bold text-[#211E19]">
                  1. You bought a tech stock at ₹1,000. It is now trading at ₹650 due to deteriorating fundamentals. What do you do?
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setQ1Choice("hold")}
                    className={`p-2 rounded border text-left font-medium transition ${
                      q1Choice === "hold"
                        ? "bg-[#BB3B2E] text-white border-[#BB3B2E]"
                        : "bg-white text-[#211E19] border-[#C7BFA9]"
                    }`}
                  >
                    Hold until it returns to ₹1,000 break-even
                  </button>
                  <button
                    onClick={() => setQ1Choice("sell")}
                    className={`p-2 rounded border text-left font-medium transition ${
                      q1Choice === "sell"
                        ? "bg-[#3D7A52] text-white border-[#3D7A52]"
                        : "bg-white text-[#211E19] border-[#C7BFA9]"
                    }`}
                  >
                    Sell immediately and redeploy in best ideas
                  </button>
                </div>
                {q1Choice === "hold" && (
                  <p className="mt-2 text-[11px] text-[#BB3B2E] font-semibold">
                    ⚠️ Diagnosis: Anchoring Bias &amp; Disposition Effect (Loss Aversion). Holding a declining asset just to avoid admitting a loss destroys portfolio compounding.
                  </p>
                )}
              </div>

              {/* Question 2 */}
              <div className="p-3 bg-[#FAF8F2] border border-[#EAE5D8] rounded-lg">
                <p className="font-bold text-[#211E19]">
                  2. Your R&amp;D team presents a high-risk acquisition. Independent analysts project a 60% failure rate, but you are certain your leadership can make it succeed.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setQ2Choice("bid")}
                    className={`p-2 rounded border text-left font-medium transition ${
                      q2Choice === "bid"
                        ? "bg-[#BB3B2E] text-white border-[#BB3B2E]"
                        : "bg-white text-[#211E19] border-[#C7BFA9]"
                    }`}
                  >
                    Proceed with acquisition aggressively
                  </button>
                  <button
                    onClick={() => setQ2Choice("audit")}
                    className={`p-2 rounded border text-left font-medium transition ${
                      q2Choice === "audit"
                        ? "bg-[#3D7A52] text-white border-[#3D7A52]"
                        : "bg-white text-[#211E19] border-[#C7BFA9]"
                    }`}
                  >
                    Demand adversarial risk audit &amp; margin of safety
                  </button>
                </div>
                {q2Choice === "bid" && (
                  <p className="mt-2 text-[11px] text-[#BB3B2E] font-semibold">
                    ⚠️ Diagnosis: Overconfidence &amp; Optimism Bias (Hubris Hypothesis). The primary cause of value-destroying corporate M&amp;A!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Governance Alignment Audit Checklist */}
      <div className="bg-[#FAF8F2] border border-[#DCD5C4] rounded-xl p-6 shadow-sm">
        <span className="text-xs font-bold text-[#8C6A2E] uppercase tracking-wider mono block">
          Corporate Governance Checklist
        </span>
        <h3 className="text-lg font-black text-[#211E19] mt-0.5">
          Executive Agency Alignment Audit
        </h3>
        <p className="text-xs text-[#686254] mt-0.5">
          Toggle key governance safeguards to see how board structure and compensation alignment impact shareholder value protection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <label className="flex items-center gap-2.5 p-3 bg-white border border-[#DCD5C4] rounded-lg cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={govChecks.independentBoard}
              onChange={() => toggleGov("independentBoard")}
              className="w-4 h-4 rounded text-[#8C6A2E] accent-[#8C6A2E]"
            />
            <span><strong>Independent Board Majority:</strong> Non-executive directors supervise management decisions.</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-[#DCD5C4] rounded-lg cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={govChecks.evaIncentives}
              onChange={() => toggleGov("evaIncentives")}
              className="w-4 h-4 rounded text-[#8C6A2E] accent-[#8C6A2E]"
            />
            <span><strong>EVA-Linked Bonuses:</strong> Executive incentives tied to ROIC &gt; WACC rather than raw revenue.</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-[#DCD5C4] rounded-lg cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={govChecks.clawbackPolicy}
              onChange={() => toggleGov("clawbackPolicy")}
              className="w-4 h-4 rounded text-[#8C6A2E] accent-[#8C6A2E]"
            />
            <span><strong>Clawback Provisions:</strong> Bonuses reclaimed if financial statements are retroactively restated.</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-[#DCD5C4] rounded-lg cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={govChecks.noPoisonPill}
              onChange={() => toggleGov("noPoisonPill")}
              className="w-4 h-4 rounded text-[#8C6A2E] accent-[#8C6A2E]"
            />
            <span><strong>No Poison Pills:</strong> Eliminates entrenched anti-takeover barriers that protect poor CEOs.</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border border-[#DCD5C4] rounded-lg cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={govChecks.separateCeoChair}
              onChange={() => toggleGov("separateCeoChair")}
              className="w-4 h-4 rounded text-[#8C6A2E] accent-[#8C6A2E]"
            />
            <span><strong>Separation of CEO &amp; Chairman:</strong> Prevents executive from supervising their own performance.</span>
          </label>
        </div>
      </div>
    </div>
  );
}
