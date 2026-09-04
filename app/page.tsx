"use client";

import React, { useState, useMemo } from "react";

const ActivityIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const RepeatIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

type TabKey =
  | "intro"
  | "goods"
  | "money"
  | "islm"
  | "asad"
  | "cases"
  | "open-crisis"
  | "advanced";

export default function MacroStudyGuideApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("intro");

  // ==========================================
  // TAB 1: OVERVIEW & CORE MARKETS STATE
  // ==========================================
  const [actualGDP, setActualGDP] = useState<number>(310); // ₹ Lakh Crore
  const [potentialGDP, setPotentialGDP] = useState<number>(320); // ₹ Lakh Crore
  const [direction, setDirection] = useState<"Rising" | "Falling">("Falling");

  // Real vs Nominal GDP & Deflator
  const [nominalGDPInput, setNominalGDPInput] = useState<number>(330);
  const [gdpDeflator, setGdpDeflator] = useState<number>(112); // Base = 100
  const realGDPComputed = Math.round((nominalGDPInput / (gdpDeflator / 100)) * 10) / 10;
  const impliedInflation = Math.round((gdpDeflator - 100) * 10) / 10;

  const outputGap = actualGDP - potentialGDP;
  const outputGapPct = Math.round((outputGap / potentialGDP) * 1000) / 10;

  const cyclePhase = useMemo(() => {
    if (outputGap < 0 && direction === "Falling") {
      return {
        name: "Recession (Heading to Trough)",
        status: "bad",
        desc: "Aggregate demand is contracting below productive capacity. Unemployment rises; deflationary pressures build.",
      };
    }
    if (outputGap < 0 && direction === "Rising") {
      return {
        name: "Recovery (Expansionary Upturn)",
        status: "ok",
        desc: "Economic activity is expanding towards potential GDP. Idle labor and capital are being remobilized.",
      };
    }
    if (outputGap >= 0 && direction === "Rising") {
      return {
        name: "Expansion (Heading to Peak / Boom)",
        status: "neutral",
        desc: "Economy is operating above sustainable potential. Demand-pull inflation risks emerge; capacity bottlenecks appear.",
      };
    }
    return {
      name: "Slowdown (Past Peak)",
      status: "neutral",
      desc: "Growth momentum decelerates following tight monetary/fiscal policy or waning demand.",
    };
  }, [outputGap, direction]);

  // ==========================================
  // TAB 2: GOODS MARKET & MULTIPLIER STATE
  // ==========================================
  const [c0, setC0] = useState<number>(40); // Autonomous consumption
  const [mpc, setMpc] = useState<number>(0.75); // Marginal propensity to consume
  const [taxRate, setTaxRate] = useState<number>(0.2); // Tax rate t
  const [inv0, setInv0] = useState<number>(35); // Planned investment I
  const [gov0, setGov0] = useState<number>(45); // Government purchases G
  const [yPotential, setYPotential] = useState<number>(450); // Potential GDP
  const [mpImport, setMpImport] = useState<number>(0.1); // Marginal propensity to import m

  // Autonomous expenditure A_bar = C_bar + I_bar + G_bar
  const autoExpenditure = c0 + inv0 + gov0;
  // Closed Multiplier alpha = 1 / (1 - c * (1 - t))
  const multiplier = 1 / (1 - mpc * (1 - taxRate));
  // Open economy Multiplier = 1 / (1 - c*(1-t) + m)
  const openMultiplier = 1 / (1 - mpc * (1 - taxRate) + mpImport);

  // Equilibrium Income Y = alpha * A_bar
  const eqIncome = Math.round(multiplier * autoExpenditure * 10) / 10;
  const kOutputGap = Math.round((eqIncome - yPotential) * 10) / 10;
  const fiscalGapNeeded = Math.round(((yPotential - eqIncome) / multiplier) * 10) / 10;

  // Balanced Budget expansion delta
  const [bbStimulus, setBbStimulus] = useState<number>(20);

  // ==========================================
  // TAB 3: MONEY MARKET & BANKING STATE
  // ==========================================
  const [reserveMoneyH, setReserveMoneyH] = useState<number>(45); // M0 in ₹ Lakh Cr
  const [cuRatio, setCuRatio] = useState<number>(0.16); // Currency-to-deposit ratio
  const [reRatio, setReRatio] = useState<number>(0.07); // Reserve-to-deposit ratio (CRR + excess)
  const [slrRatio, setSlrRatio] = useState<number>(0.18); // SLR requirement 18%

  // Money Multiplier m = (1 + cu) / (cu + re)
  const moneyMultiplier = Math.round(((1 + cuRatio) / (cuRatio + reRatio)) * 100) / 100;
  const broadMoneyM3 = Math.round(reserveMoneyH * moneyMultiplier * 10) / 10;

  // Demonetization / UPI digital cash migration scenario
  const [digitalMigrationPct, setDigitalMigrationPct] = useState<number>(0);
  const adjustedCuRatio = Math.max(0.05, Math.round((cuRatio * (1 - digitalMigrationPct / 100)) * 100) / 100);
  const adjustedMultiplier = Math.round(((1 + adjustedCuRatio) / (adjustedCuRatio + reRatio)) * 100) / 100;
  const adjustedM3 = Math.round(reserveMoneyH * adjustedMultiplier * 10) / 10;

  // Money Market Equilibrium & LM Graph State
  const [mmMoneySupply, setMmMoneySupply] = useState<number>(65); // Real Money Balances M/P (₹ Lakh Cr)
  const [mmIncomeY, setMmIncomeY] = useState<number>(280); // Real Output Y (₹ Lakh Cr)
  const [mmSensitivityK, setMmSensitivityK] = useState<number>(0.30); // k: Transactions sensitivity
  const [mmSensitivityH, setMmSensitivityH] = useState<number>(10); // h: Speculative interest sensitivity

  // Equilibrium Interest Rate: i = (k*Y - M/P) / h
  const mmEquilInterest = Math.max(
    0.5,
    Math.round(((mmSensitivityK * mmIncomeY - mmMoneySupply) / mmSensitivityH) * 10) / 10
  );

  // LM Slope: k / h
  const mmLmSlope = Math.round((mmSensitivityK / mmSensitivityH) * 1000) / 1000;
  // Shift per unit delta(M/P): (M/P) / k
  const mmHorizontalShift = Math.round((mmMoneySupply / mmSensitivityK) * 10) / 10;

  // ==========================================
  // TAB 4: IS-LM POLICY WORKBENCH STATE
  // ==========================================
  const [isAbar, setIsAbar] = useState<number>(180); // Autonomous spending A_bar
  const [isB, setIsB] = useState<number>(15); // Investment interest sensitivity b
  const isAlpha = 2.5; // Multiplier alpha
  const [lmMoneyStock, setLmMoneyStock] = useState<number>(120); // Real money stock M/P
  const lmK = 0.4; // Income sensitivity of money demand k
  const [lmH, setLmH] = useState<number>(20); // Interest sensitivity of money demand h

  // IS: i = (A_bar / b) - (Y / (alpha * b))
  // LM: i = (k / h)*Y - (M/P)/h
  const denominator = 1 / (isAlpha * isB) + lmK / lmH;
  const islmY = Math.round(((isAbar / isB + lmMoneyStock / lmH) / denominator) * 10) / 10;
  const islmI = Math.round(((lmK / lmH) * islmY - lmMoneyStock / lmH) * 100) / 100;

  // Effective fiscal multiplier gamma = alpha / (1 + (alpha * b * k) / h)
  const gamma = Math.round((isAlpha / (1 + (isAlpha * isB * lmK) / lmH)) * 100) / 100;
  const crowdingOutPenalty = Math.round((1 - gamma / isAlpha) * 100);

  // Preset Scenario Handlers
  const applyIsLmPreset = (preset: "baseline" | "stimulus" | "liquidity-trap" | "reform-1991") => {
    if (preset === "baseline") {
      setIsAbar(180);
      setIsB(15);
      setLmMoneyStock(120);
      setLmH(20);
    } else if (preset === "stimulus") {
      setIsAbar(230); // Higher G
      setLmMoneyStock(150); // Accommodating monetary expansion
      setLmH(20);
    } else if (preset === "liquidity-trap") {
      setIsAbar(140);
      setLmH(50); // Highly elastic money demand (ZLB)
      setLmMoneyStock(160);
    } else if (preset === "reform-1991") {
      setIsAbar(160); // Fiscal consolidation
      setIsB(24); // More sensitive private investment
      setLmMoneyStock(110);
      setLmH(18);
    }
  };

  // ==========================================
  // TAB 5: PHILLIPS CURVE & INFLATION STATE
  // ==========================================
  const [expectedInf, setExpectedInf] = useState<number>(4.0); // % Expected inflation pi_e
  const [nairuU, setNairuU] = useState<number>(5.5); // % Natural rate of unemployment u*
  const [actualU, setActualU] = useState<number>(5.0); // % Actual unemployment u
  const betaSensitivity = 0.8; // Slope beta
  const [supplyShockNu, setSupplyShockNu] = useState<number>(0.0); // Supply shock nu

  // pi = pi_e - beta * (u - u*) + nu
  const inflationPi =
    Math.round((expectedInf - betaSensitivity * (actualU - nairuU) + supplyShockNu) * 10) / 10;

  // Sacrifice Ratio calculation
  const [disinflationGoal, setDisinflationGoal] = useState<number>(2.0); // Reduce inflation by 2%
  const sacrificeRatio = 2.5; // Dornbusch rule of thumb: ~2.5% output loss per 1% disinflation
  const totalOutputLossPct = Math.round(disinflationGoal * sacrificeRatio * 10) / 10;

  // ==========================================
  // TAB 7: ADVANCED TOPICS STATE
  // ==========================================
  // A. Taylor Rule
  const [taylorEquilR, setTaylorEquilR] = useState<number>(2.0); // Real neutral interest rate r*
  const [taylorTargetInf, setTaylorTargetInf] = useState<number>(4.0); // Central Bank target pi*
  const [taylorCurrentInf, setTaylorCurrentInf] = useState<number>(5.4); // Current CPI inflation pi
  const [taylorOutputGap, setTaylorOutputGap] = useState<number>(0.8); // Output gap %
  const [actualPolicyRepo, setActualPolicyRepo] = useState<number>(6.5); // Actual RBI repo rate

  // Taylor Rule Formula: i = r* + pi + 0.5(pi - pi*) + 0.5(y - y*)
  const recommendedTaylorRate =
    Math.round(
      (taylorEquilR +
        taylorCurrentInf +
        0.5 * (taylorCurrentInf - taylorTargetInf) +
        0.5 * taylorOutputGap) *
        100
    ) / 100;
  const policyGap = Math.round((actualPolicyRepo - recommendedTaylorRate) * 100) / 100;

  // B. Mundell-Fleming Model
  const [mfRegime, setMfRegime] = useState<"floating" | "fixed">("floating");
  const [mfFiscalG, setMfFiscalG] = useState<number>(50); // Fiscal expansion
  const [mfMonetaryM, setMfMonetaryM] = useState<number>(50); // Monetary expansion
  const worldRateIf = 4.0; // World interest rate i_f

  // Under floating: fiscal policy has 0 effect on Y (crowded out by FX appreciation); monetary policy has 100% effect!
  // Under fixed: fiscal policy has 100% effect (CB expands M to peg FX); monetary policy has 0% effect!
  const mfOutput = useMemo(() => {
    if (mfRegime === "floating") {
      // Y depends primarily on M (via exchange rate depreciation boosting NX)
      return Math.round(300 + (mfMonetaryM - 50) * 2.8);
    } else {
      // Fixed: Y depends on G (accommodated by money supply expansion)
      return Math.round(300 + (mfFiscalG - 50) * 3.2);
    }
  }, [mfRegime, mfFiscalG, mfMonetaryM]);

  // C. Sovereign Debt Sustainability (Snowball Equation)
  const [debtRatioD, setDebtRatioD] = useState<number>(82); // Debt to GDP ratio % (India ~82%)
  const [realInterestR, setRealInterestR] = useState<number>(3.5); // Real interest rate r %
  const [realGrowthG, setRealGrowthG] = useState<number>(6.5); // Real GDP growth rate g %
  const [primaryDeficitPb, setPrimaryDeficitPb] = useState<number>(1.5); // Primary deficit pb %

  // Delta d = (r - g) * d + pb
  const rgSpread = Math.round((realInterestR - realGrowthG) * 10) / 10;
  const debtSnowballEffect = Math.round(((rgSpread / 100) * debtRatioD) * 100) / 100;
  const deltaDebtRatio = Math.round((debtSnowballEffect + primaryDeficitPb) * 100) / 100;
  const debt5YearProjection = Math.round((debtRatioD + deltaDebtRatio * 5) * 10) / 10;

  // D. Solow-Swan Long-Run Growth Model
  const [solowSavingsRate, setSolowSavingsRate] = useState<number>(0.28); // s = 28%
  const [solowCapitalShare, setSolowCapitalShare] = useState<number>(0.35); // alpha = 0.35
  const [solowDeprecRate, setSolowDeprecRate] = useState<number>(0.05); // delta = 5%
  const [solowPopGrowth, setSolowPopGrowth] = useState<number>(0.015); // n = 1.5%

  // Steady State k* = [ s / (n + delta) ] ^ (1 / (1 - alpha))
  const breakEvenRate = solowDeprecRate + solowPopGrowth;
  const steadyStateK =
    Math.round(
      Math.pow(solowSavingsRate / breakEvenRate, 1 / (1 - solowCapitalShare)) * 100
    ) / 100;
  const steadyStateY = Math.round(Math.pow(steadyStateK, solowCapitalShare) * 100) / 100;
  const steadyStateC = Math.round((1 - solowSavingsRate) * steadyStateY * 100) / 100;
  const goldenRuleSavings = Math.round(solowCapitalShare * 100);

  // E. Dornbusch Exchange Rate Overshooting Model
  const [overshootMoneyShock, setOvershootMoneyShock] = useState<number>(15); // % Money expansion
  const [overshootPriceSpeed, setOvershootPriceSpeed] = useState<number>(0.3); // theta: Price adjustment speed
  const [overshootInterestSens, setOvershootInterestSens] = useState<number>(0.8); // eta: Interest semi-elasticity

  const longRunFxDeprec = overshootMoneyShock;
  const overshootJump =
    Math.round(
      (overshootMoneyShock *
        (1 + 1 / (overshootInterestSens * (overshootPriceSpeed * 2 + 0.4)))) *
        10
    ) / 10;
  const overshootDegree = Math.round((overshootJump - longRunFxDeprec) * 10) / 10;

  // F. Lucas Critique & Time-Inconsistency (Barro-Gordon Model)
  const [cbInflationAversion, setCbInflationAversion] = useState<number>(1.5); // lambda: inflation weight
  const [growthAmbitionK, setGrowthAmbitionK] = useState<number>(1.25); // target output ratio k > 1
  const [cbCredibilityRule, setCbCredibilityRule] = useState<"discretion" | "rule">("discretion");

  const discretionInflation = Math.round(cbInflationAversion * (growthAmbitionK - 1) * 10 * 10) / 10;
  const equilibriumInflation = cbCredibilityRule === "discretion" ? discretionInflation : 0;
  const policyLoss =
    cbCredibilityRule === "discretion"
      ? Math.round(0.5 * Math.pow(discretionInflation, 2) * 10) / 10
      : 0;

  // G. Ricardian Equivalence Proposition
  const [taxCutDeltaT, setTaxCutDeltaT] = useState<number>(50000); // ₹ Cr tax cut
  const [creditConstrainedPct, setCreditConstrainedPct] = useState<number>(40); // % liquidity constrained
  const [consumerMyopiaPct, setConsumerMyopiaPct] = useState<number>(25); // % myopic

  const nonRicardianFraction = Math.min(
    100,
    Math.round(creditConstrainedPct + (100 - creditConstrainedPct) * (consumerMyopiaPct / 100))
  );
  const effectiveStimulus = Math.round((taxCutDeltaT * (nonRicardianFraction / 100) * 0.75) * 10) / 10;
  const ricardianSavingsOffset = Math.round((taxCutDeltaT - effectiveStimulus / 0.75) * 10) / 10;

  // ==========================================
  // TAB: POLICY CASES & DECISIONS STATE
  // ==========================================
  type CaseId = "subprime2008" | "frbm2010" | "taper2013" | "stagflation2022";
  const [selectedCase, setSelectedCase] = useState<CaseId>("subprime2008");

  // CASE 1: 2008 Subprime Contagion Levers
  const [c1RepoCut, setC1RepoCut] = useState<number>(425); // bps
  const [c1CrrCut, setC1CrrCut] = useState<number>(400); // bps
  const [c1FiscalDeficitAllowed, setC1FiscalDeficitAllowed] = useState<number>(6.5); // % of GDP
  const [c1FxStance, setC1FxStance] = useState<"managed" | "burn-reserves" | "free-float">("managed");

  const c1TotalLiquidityInjected = Math.round(c1CrrCut * 1000 + c1RepoCut * 300); // Approx ₹ Cr
  const c1GdpRebound = useMemo(() => {
    const monetaryBoost = (c1RepoCut / 100) * 0.5 + (c1CrrCut / 100) * 0.4;
    const fiscalBoost = (c1FiscalDeficitAllowed - 3.0) * 0.85;
    return Math.min(9.8, Math.max(3.5, Math.round((5.0 + monetaryBoost + fiscalBoost) * 10) / 10));
  }, [c1RepoCut, c1CrrCut, c1FiscalDeficitAllowed]);

  const c1InflationOutcome = useMemo(() => {
    const liquidityPressure = (c1RepoCut / 100) * 0.7 + (c1FiscalDeficitAllowed - 3.0) * 1.1;
    const fxPressure = c1FxStance === "free-float" ? 2.5 : c1FxStance === "managed" ? 1.0 : 0.2;
    return Math.min(14.5, Math.max(4.0, Math.round((4.5 + liquidityPressure + fxPressure) * 10) / 10));
  }, [c1RepoCut, c1FiscalDeficitAllowed, c1FxStance]);

  const c1ExchangeRate = useMemo(() => {
    if (c1FxStance === "burn-reserves") return 44.5;
    if (c1FxStance === "managed") return 48.8;
    return 54.2;
  }, [c1FxStance]);

  // CASE 2: FRBM Budget Deficit Consolidation Levers
  const [c2CapexCut, setC2CapexCut] = useState<number>(30000); // ₹ Cr
  const [c2RevCut, setC2RevCut] = useState<number>(110000); // ₹ Cr
  const [c2TaxHike, setC2TaxHike] = useState<number>(71368); // ₹ Cr
  const [c2RbiStance, setC2RbiStance] = useState<"accommodative" | "neutral" | "tight">("accommodative");

  const c2StaticCut = c2CapexCut + c2RevCut + c2TaxHike;
  const c2GdpContraction = Math.round(
    c2CapexCut * 3.25 +
      c2RevCut * 0.85 +
      c2TaxHike * 1.15 -
      (c2RbiStance === "accommodative" ? 65000 : c2RbiStance === "tight" ? -35000 : 0)
  );
  const c2TaxRevenueLoss = Math.round(c2GdpContraction * 0.16);
  const c2RealizedDeficitCut = c2StaticCut - c2TaxRevenueLoss;
  const c2FinalDeficitPct = Math.max(
    2.1,
    Math.round(((394635 - c2RealizedDeficitCut) / (6108903 - c2GdpContraction)) * 1000) / 10
  );
  const c2GdpGrowthRate = Math.round((8.0 - (c2GdpContraction / 6108903) * 100) * 10) / 10;

  // CASE 3: 2013 Taper Tantrum Levers
  const [c3FcnrSwapWindow, setC3FcnrSwapWindow] = useState<boolean>(true);
  const [c3MsfHikeBps, setC3MsfHikeBps] = useState<number>(200); // bps
  const [c3CapitalControls, setC3CapitalControls] = useState<"targeted" | "strict" | "none">("targeted");

  const c3UsdInflows = useMemo(() => {
    let base = 5;
    if (c3FcnrSwapWindow) base += 34.3;
    if (c3CapitalControls === "strict") base -= 8.0;
    if (c3CapitalControls === "targeted") base += 2.0;
    return Math.round(base * 10) / 10;
  }, [c3FcnrSwapWindow, c3CapitalControls]);

  const c3RupeeTrajectory = useMemo(() => {
    let inr = 68.85;
    if (c3FcnrSwapWindow) inr -= 6.2;
    if (c3MsfHikeBps >= 200) inr -= 1.8;
    else if (c3MsfHikeBps >= 100) inr -= 0.8;
    if (c3CapitalControls === "strict") inr += 3.5;
    return Math.round(inr * 100) / 100;
  }, [c3FcnrSwapWindow, c3MsfHikeBps, c3CapitalControls]);

  const c3CadPct = useMemo(() => {
    let cad = 4.8;
    if (c3CapitalControls === "targeted") cad -= 1.8;
    if (c3CapitalControls === "strict") cad -= 2.2;
    if (c3MsfHikeBps >= 200) cad -= 0.6;
    return Math.max(1.5, Math.round(cad * 10) / 10);
  }, [c3CapitalControls, c3MsfHikeBps]);

  // CASE 4: 2022 Post-Ukraine War Stagflation Levers
  const [c4MpcRepoHike, setC4MpcRepoHike] = useState<number>(250); // bps
  const [c4ExciseCut, setC4ExciseCut] = useState<boolean>(true);
  const [c4FoodExportRestrictions, setC4FoodExportRestrictions] = useState<boolean>(true);

  const c4InflationTrajectory = useMemo(() => {
    let cpi = 7.8;
    cpi -= (c4MpcRepoHike / 100) * 0.65;
    if (c4ExciseCut) cpi -= 0.85;
    if (c4FoodExportRestrictions) cpi -= 0.7;
    return Math.max(4.2, Math.round(cpi * 10) / 10);
  }, [c4MpcRepoHike, c4ExciseCut, c4FoodExportRestrictions]);

  const c4GdpGrowth = useMemo(() => {
    let growth = 7.8;
    growth -= (c4MpcRepoHike / 100) * 0.35;
    if (c4ExciseCut) growth += 0.25;
    if (c4FoodExportRestrictions) growth -= 0.15;
    return Math.round(growth * 10) / 10;
  }, [c4MpcRepoHike, c4ExciseCut, c4FoodExportRestrictions]);

  const c4FiscalCostCr = useMemo(() => {
    let cost = 0;
    if (c4ExciseCut) cost += 100000;
    if (c4FoodExportRestrictions) cost += 15000;
    return cost;
  }, [c4ExciseCut, c4FoodExportRestrictions]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E9] text-[#211E19]">
      {/* Sticky Tab Header */}
      <header className="tab-header">
        <div className="wrap header-flex">
          <div className="brand">
            <div className="w-9 h-9 rounded bg-[#2E5C8A] text-white flex items-center justify-center font-bold text-base shadow-sm mono">
              SG
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">Study Guide</span>
              <span className="text-[10px] font-semibold text-[#686254] tracking-wider uppercase">
                MBA Macroeconomics &amp; Policy Simulation Workbench
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="tab-nav">
            <button
              onClick={() => setActiveTab("intro")}
              className={`nav-tab ${activeTab === "intro" ? "active" : ""}`}
            >
              Overview &amp; Markets
            </button>
            <button
              onClick={() => setActiveTab("goods")}
              className={`nav-tab ${activeTab === "goods" ? "active" : ""}`}
            >
              Goods Market &amp; Multiplier
            </button>
            <button
              onClick={() => setActiveTab("money")}
              className={`nav-tab ${activeTab === "money" ? "active" : ""}`}
            >
              Money Market &amp; Banking
            </button>
            <button
              onClick={() => setActiveTab("islm")}
              className={`nav-tab ${activeTab === "islm" ? "active" : ""}`}
            >
              IS-LM Policy Workbench
            </button>
            <button
              onClick={() => setActiveTab("asad")}
              className={`nav-tab ${activeTab === "asad" ? "active" : ""}`}
            >
              AS-AD &amp; Inflation
            </button>
            <button
              onClick={() => setActiveTab("cases")}
              className={`nav-tab ${activeTab === "cases" ? "active" : ""}`}
              style={{ color: activeTab === "cases" ? "var(--rust)" : undefined }}
            >
              🏛️ Policy Cases &amp; Decisions
            </button>
            <button
              onClick={() => setActiveTab("open-crisis")}
              className={`nav-tab ${activeTab === "open-crisis" ? "active" : ""}`}
            >
              Open Economy &amp; Crises
            </button>
            <button
              onClick={() => setActiveTab("advanced")}
              className={`nav-tab ${activeTab === "advanced" ? "active" : ""}`}
              style={{ color: activeTab === "advanced" ? "var(--orange)" : "#2E5C8A" }}
            >
              ★ Advanced Topics
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="wrap py-8 flex-1 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & CORE MARKETS */}
        {/* ========================================================================= */}
        {activeTab === "intro" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                FOUNDATIONS OF MACROECONOMICS — THE AGGREGATE SYSTEM
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Macroeconomic Environment &amp; The Four Core Markets
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                While microeconomics analyzes the pricing and output decisions of an individual firm,
                macroeconomics investigates the aggregate behavior of the whole economy — output, inflation,
                employment, interest rates, and balance of payments.
              </p>
            </div>

            {/* The Four Markets Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="dash-card">
                <h3 className="card-title">1. Goods Market</h3>
                <p className="text-xs text-[#686254] leading-relaxed mb-3">
                  Equilibrium of aggregate output ($Y$) and total expenditure ($C + I + G + NX$).
                  Determines national output and product price level.
                </p>
                <div className="text-[11px] font-semibold text-[#2E5C8A] mono">
                  Key variable: Output ($Y$)
                </div>
              </div>

              <div className="dash-card">
                <h3 className="card-title">2. Money Market</h3>
                <p className="text-xs text-[#686254] leading-relaxed mb-3">
                  Interaction between real money supply ($M/P$) controlled by Central Bank and real money demand ($L$).
                  Clears via interest rate.
                </p>
                <div className="text-[11px] font-semibold text-[#2E5C8A] mono">
                  Key variable: Interest rate ($i$)
                </div>
              </div>

              <div className="dash-card">
                <h3 className="card-title">3. Bond Market</h3>
                <p className="text-xs text-[#686254] leading-relaxed mb-3">
                  Long-term debt instruments and sovereign government paper. Prices inversely mirror yields:
                  when bond prices rise, interest rates fall.
                </p>
                <div className="text-[11px] font-semibold text-[#2E5C8A] mono">
                  Key variable: Yield / Price ($P_B$)
                </div>
              </div>

              <div className="dash-card">
                <h3 className="card-title">4. Labour Market</h3>
                <p className="text-xs text-[#686254] leading-relaxed mb-3">
                  Firms demand labor up to marginal revenue product; households supply labor.
                  Defines employment level ($N$) and the real wage rate.
                </p>
                <div className="text-[11px] font-semibold text-[#2E5C8A] mono">
                  Key variable: Real Wage ($W/P$)
                </div>
              </div>
            </div>

            {/* Interactive Business Cycle Simulator */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    Business Cycle Phase &amp; Output Gap Simulator
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Formula: Output Gap = Actual GDP ($Y$) − Potential GDP ($Y^*$)
                  </span>
                </div>

                <div
                  className={`status-pill ${
                    cyclePhase.status === "bad"
                      ? "bad"
                      : cyclePhase.status === "ok"
                      ? "ok"
                      : "neutral"
                  }`}
                >
                  <ActivityIcon className="w-3.5 h-3.5" />
                  <span>{cyclePhase.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Actual GDP ($Y$)</label>
                    <div className="readout">
                      <span>{actualGDP}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="260"
                      max="380"
                      step="2"
                      value={actualGDP}
                      onChange={(e) => setActualGDP(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Potential Sustainable GDP ($Y^*$)</label>
                    <div className="readout">
                      <span>{potentialGDP}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="280"
                      max="360"
                      step="2"
                      value={potentialGDP}
                      onChange={(e) => setPotentialGDP(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Growth Direction Momentum</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setDirection("Falling")}
                        className={`py-1.5 px-3 rounded text-xs font-semibold mono transition-all ${
                          direction === "Falling"
                            ? "bg-[#E2571C] text-white shadow-xs"
                            : "bg-white border border-[#DCD5C4] text-[#686254]"
                        }`}
                      >
                        Contraction (Falling)
                      </button>
                      <button
                        onClick={() => setDirection("Rising")}
                        className={`py-1.5 px-3 rounded text-xs font-semibold mono transition-all ${
                          direction === "Rising"
                            ? "bg-[#3D7A52] text-white shadow-xs"
                            : "bg-white border border-[#DCD5C4] text-[#686254]"
                        }`}
                      >
                        Expansion (Rising)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded bg-white border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Output Gap
                      </span>
                      <span
                        className={`text-lg font-bold mono ${
                          outputGap >= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                        }`}
                      >
                        {outputGap > 0 ? `+${outputGap}` : outputGap} ₹ Lakh Cr
                      </span>
                    </div>

                    <div className="p-3 rounded bg-white border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Gap Percentage
                      </span>
                      <span
                        className={`text-lg font-bold mono ${
                          outputGapPct >= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                        }`}
                      >
                        {outputGapPct > 0 ? `+${outputGapPct}` : outputGapPct}%
                      </span>
                    </div>

                    <div className="p-3 rounded bg-white border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Capacity Pressure
                      </span>
                      <span className="text-sm font-bold text-[#2E5C8A] mono">
                        {outputGap >= 0 ? "Excess Demand" : "Idle Capacity"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-[#DCD5C4]">
                    <svg viewBox="0 0 600 120" className="w-full h-24 overflow-visible">
                      <line
                        x1="20"
                        y1="60"
                        x2="580"
                        y2="60"
                        stroke="#9A927E"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text x="30" y="52" fill="#9A927E" fontSize="10" fontFamily="IBM Plex Mono">
                        Potential Trend ($Y^*$)
                      </text>

                      <path
                        d="M 20 60 Q 110 0 200 60 T 380 60 T 560 60"
                        fill="none"
                        stroke="#2E5C8A"
                        strokeWidth="2.5"
                      />

                      {(() => {
                        let cx = 110;
                        let cy = 30;
                        if (outputGap >= 0 && direction === "Rising") {
                          cx = 110;
                          cy = 20;
                        } else if (outputGap >= 0 && direction === "Falling") {
                          cx = 170;
                          cy = 45;
                        } else if (outputGap < 0 && direction === "Falling") {
                          cx = 290;
                          cy = 100;
                        } else {
                          cx = 350;
                          cy = 75;
                        }
                        return (
                          <g>
                            <circle
                              cx={cx}
                              cy={cy}
                              r="7"
                              fill="#E2571C"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              className="animate-pulse"
                            />
                            <text
                              x={cx + 12}
                              y={cy + 4}
                              fill="#E2571C"
                              fontSize="11"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              Current: {actualGDP} Cr
                            </text>
                          </g>
                        );
                      })()}
                    </svg>

                    <div className="flex justify-between text-[10px] text-[#686254] font-medium pt-1 px-1 border-t border-[#FAF8F2]">
                      <span>Phase I: Recovery</span>
                      <span>Phase II: Peak Boom</span>
                      <span>Phase III: Slowdown</span>
                      <span>Phase IV: Trough</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW ADDITION: Real vs Nominal GDP & GDP Deflator Simulator */}
            <div className="dash-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                <div>
                  <h3 className="card-title mb-0">Real vs. Nominal GDP &amp; The GDP Deflator</h3>
                  <span className="text-xs text-[#686254]">
                    Formula: Real GDP = (Nominal GDP / GDP Deflator) × 100
                  </span>
                </div>
                <div className="status-pill neutral">
                  <span>Price Index: {gdpDeflator}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-3 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Nominal GDP (Current Prices)</label>
                    <div className="readout">
                      <span>{nominalGDPInput}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="450"
                      step="5"
                      value={nominalGDPInput}
                      onChange={(e) => setNominalGDPInput(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>GDP Deflator (Base = 100)</label>
                    <div className="readout">
                      <span>{gdpDeflator}</span> (+{impliedInflation}% inflation)
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="150"
                      step="1"
                      value={gdpDeflator}
                      onChange={(e) => setGdpDeflator(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Calculated Real GDP</span>
                    <div className="text-2xl font-black mono text-[#2E5C8A]">
                      {realGDPComputed} ₹ Lakh Cr
                    </div>
                    <p className="text-xs text-[#686254]">
                      Measured at constant base-year prices. Purges the illusion of price inflation.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Inflation Illusion</span>
                    <div className="text-2xl font-black mono text-[#BB3B2E]">
                      {Math.round((nominalGDPInput - realGDPComputed) * 10) / 10} ₹ Lakh Cr
                    </div>
                    <p className="text-xs text-[#686254]">
                      Portion of headline nominal GDP that represents pure price increase without volume growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Flow Matrix */}
            <div className="dash-card">
              <h3 className="card-title">Circular Flow: Leakages vs. Injections Equilibrium</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FAF8F2] rounded border border-[#BB3B2E]/30 space-y-1">
                  <span className="font-bold text-[#BB3B2E] block">Total Leakages ($S + T + M$)</span>
                  <p className="text-[#686254]">
                    Income withdrawn from the domestic expenditure stream: Private Savings ($S$), Net Taxes ($T$),
                    and Foreign Imports ($M$).
                  </p>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded border border-[#3D7A52]/30 space-y-1">
                  <span className="font-bold text-[#3D7A52] block">Total Injections ($I + G + X$)</span>
                  <p className="text-[#686254]">
                    Exogenous demand injections into domestic production: Planned Investment ($I$),
                    Government Purchases ($G$), and Foreign Exports ($X$).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GOODS MARKET & MULTIPLIER */}
        {/* ========================================================================= */}
        {activeTab === "goods" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                SHORT-RUN NATIONAL INCOME DETERMINATION — THE GOODS MARKET
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Keynesian Cross &amp; Expenditure Multiplier
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                In the short run with fixed prices, output is determined by Aggregate Demand ($AD$).
                Firms supply whatever quantity is demanded at the going price. When demand expands by ₹1,
                the multiplier ($\alpha$) magnifies equilibrium income through repeated spending rounds.
              </p>
            </div>

            {/* Model Derivation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="dash-card space-y-2">
                <h3 className="card-title">Consumption Function</h3>
                <div className="formula-box">
                  C = C̄ + c · Y_D = C̄ + c(1 − t)Y
                </div>
                <p className="text-xs text-[#686254] leading-relaxed">
                  Where C̄ is autonomous subsistence consumption, $c$ is the Marginal Propensity
                  to Consume ($0 &lt; c &lt; 1$), and $t$ is the proportional income tax rate.
                </p>
              </div>

              <div className="dash-card space-y-2">
                <h3 className="card-title">Equilibrium Output &amp; Multiplier</h3>
                <div className="formula-box">
                  Y* = α · Ā = [ 1 / (1 − c(1 − t)) ] · (C̄ + Ī + Ḡ)
                </div>
                <p className="text-xs text-[#686254] leading-relaxed">
                  At equilibrium $Y = AD$. The multiplier ($\alpha$) determines how much income shifts
                  in response to an exogenous change in autonomous investment or fiscal spending.
                </p>
              </div>
            </div>

            {/* Interactive Keynesian Cross Simulator */}
            <div className="dash-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    Interactive Keynesian Cross Workbench
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Adjust fiscal levers and MPC to observe equilibrium output shifts
                  </span>
                </div>

                <div
                  className={`status-pill ${
                    kOutputGap >= 0 ? "ok" : "bad"
                  }`}
                >
                  <ActivityIcon className="w-3.5 h-3.5" />
                  <span>
                    {kOutputGap >= 0
                      ? `Inflationary Gap (+${kOutputGap} Cr)`
                      : `Recessionary Gap (${kOutputGap} Cr)`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3.5 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Marginal Propensity to Consume ($c$)</label>
                    <div className="readout">
                      <span>{mpc}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.9"
                      step="0.05"
                      value={mpc}
                      onChange={(e) => setMpc(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Income Tax Rate ($t$)</label>
                    <div className="readout">
                      <span>{Math.round(taxRate * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.05"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Government Purchases ($G$)</label>
                    <div className="readout">
                      <span>{gov0}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={gov0}
                      onChange={(e) => setGov0(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Autonomous Consumption (C̄) &amp; Investment (Ī)</label>
                    <div className="readout">
                      <span>{c0 + inv0}</span> ₹ Lakh Cr (C̄: {c0}, Ī: {inv0})
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      step="5"
                      value={c0 + inv0}
                      onChange={(e) => {
                        const total = Number(e.target.value);
                        setC0(Math.round(total * 0.55));
                        setInv0(Math.round(total * 0.45));
                      }}
                    />
                  </div>

                  <div className="control">
                    <label>Marginal Propensity to Import ($m$)</label>
                    <div className="readout">
                      <span>{mpImport}</span> (Open economy leakage)
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.25"
                      step="0.02"
                      value={mpImport}
                      onChange={(e) => setMpImport(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Potential Output ($Y^*$)</label>
                    <div className="readout">
                      <span>{yPotential}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="600"
                      step="10"
                      value={yPotential}
                      onChange={(e) => setYPotential(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Closed Multiplier ($\alpha$)
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        {Math.round(multiplier * 100) / 100}×
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Open Multiplier (α_open)
                      </span>
                      <span className="text-xl font-bold mono text-[#3D7A52]">
                        {Math.round(openMultiplier * 100) / 100}×
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Equilibrium ($Y^*$)
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        {eqIncome} Cr
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Fiscal Remedy
                      </span>
                      <span className="text-sm font-bold mono text-[#3D7A52]">
                        {fiscalGapNeeded > 0
                          ? `+${fiscalGapNeeded} Cr G`
                          : `${fiscalGapNeeded} Cr G`}
                      </span>
                    </div>
                  </div>

                  {/* SVG Keynesian Cross 45° Line Diagram */}
                  <div className="bg-white p-4 rounded border border-[#DCD5C4]">
                    <svg viewBox="0 0 500 240" className="w-full h-52 overflow-visible">
                      <line x1="40" y1="210" x2="480" y2="210" stroke="#9A927E" strokeWidth="1.5" />
                      <line x1="40" y1="210" x2="40" y2="20" stroke="#9A927E" strokeWidth="1.5" />

                      <text x="440" y="225" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        Output (Y)
                      </text>
                      <text x="15" y="25" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        AD
                      </text>

                      <line x1="40" y1="210" x2="440" y2="30" stroke="#C7BFA9" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="390" y="25" fill="#9A927E" fontSize="9" fontFamily="IBM Plex Mono">
                        45° (AD = Y)
                      </text>

                      {(() => {
                        const yInterceptVal = autoExpenditure;
                        const yMaxVal = autoExpenditure + mpc * (1 - taxRate) * 600;

                        const x0 = 40;
                        const y0 = 210 - (yInterceptVal / 600) * 180;
                        const x1 = 440;
                        const y1 = 210 - (yMaxVal / 600) * 180;

                        const eqX = 40 + (eqIncome / 600) * 400;
                        const eqY = 210 - (eqIncome / 600) * 180;
                        const potX = 40 + (yPotential / 600) * 400;

                        return (
                          <g>
                            <line
                              x1={potX}
                              y1="210"
                              x2={potX}
                              y2="30"
                              stroke="#3D7A52"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                            <text x={potX - 20} y="22" fill="#3D7A52" fontSize="9" fontFamily="IBM Plex Mono">
                              Y* Potential
                            </text>

                            <line
                              x1={x0}
                              y1={y0}
                              x2={x1}
                              y2={y1}
                              stroke="#E2571C"
                              strokeWidth="2.5"
                            />
                            <text x={x1 - 60} y={y1 - 8} fill="#E2571C" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">
                              AD = Ā + c(1-t)Y
                            </text>

                            <circle cx={eqX} cy={eqY} r="5.5" fill="#2E5C8A" stroke="#FFFFFF" strokeWidth="2" />
                            <line x1={eqX} y1={eqY} x2={eqX} y2="210" stroke="#2E5C8A" strokeWidth="1" strokeDasharray="2 2" />
                            <text x={eqX - 25} y={eqY - 10} fill="#2E5C8A" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">
                              Y*={eqIncome}
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW ADDITION: The Balanced Budget Multiplier Theorem */}
            <div className="dash-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                <div>
                  <h3 className="card-title mb-0">Haavelmo&apos;s Balanced Budget Multiplier Theorem ($\alpha_B = 1.0$)</h3>
                  <span className="text-xs text-[#686254]">
                    If $\Delta G = \Delta T$, then $\Delta Y = \Delta G$. Output expands with zero deficit!
                  </span>
                </div>
                <div className="status-pill ok">
                  <span>Balanced Budget Multiplier = 1.00</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4] space-y-3">
                  <div className="control">
                    <label>Equal Change in Spending &amp; Taxes ($\Delta G = \Delta T$)</label>
                    <div className="readout">
                      <span>+{bbStimulus}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={bbStimulus}
                      onChange={(e) => setBbStimulus(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Net Output Expansion ($\Delta Y$)</span>
                    <div className="text-2xl font-black mono text-[#3D7A52]">
                      +{bbStimulus} ₹ Lakh Cr
                    </div>
                    <p className="text-xs text-[#686254]">
                      Because $\Delta Y = \alpha \Delta G - c \alpha \Delta T = \alpha(1 - c)\Delta G = 1 \cdot \Delta G$.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Impact on Fiscal Deficit</span>
                    <div className="text-2xl font-black mono text-[#2E5C8A]">
                      ₹0 (Neutral)
                    </div>
                    <p className="text-xs text-[#686254]">
                      Government debt does not increase because increased revenue matches increased expenditure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MONEY MARKET & BANKING */}
        {/* ========================================================================= */}
        {activeTab === "money" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                CENTRAL BANKING, HIGH-POWERED MONEY &amp; CREDIT CREATION
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Money Market, Reserve Money &amp; The RBI Multiplier
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                Money supply is not created in a vacuum. The Reserve Bank of India (RBI) injects Reserve Money
                ($M_0$ / High-Powered Money $H$), and commercial banks expand this into Broad Money ($M_3$)
                via credit creation, governed by reserve requirements and currency holding behavior.
              </p>
            </div>

            {/* Money Demand Motives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="dash-card">
                <h3 className="card-title">1. Transactions Motive</h3>
                <p className="text-xs text-[#686254] leading-relaxed">
                  Money held for daily purchases and business operations. Proportional to nominal income ($kY$).
                  Higher GDP expands the demand for transaction balances.
                </p>
              </div>

              <div className="dash-card">
                <h3 className="card-title">2. Precautionary Motive</h3>
                <p className="text-xs text-[#686254] leading-relaxed">
                  Buffers against unpredictable contingencies and sudden shocks (e.g. medical emergencies or
                  unexpected payment delays). Also increases with income.
                </p>
              </div>

              <div className="dash-card">
                <h3 className="card-title">3. Speculative / Asset Motive</h3>
                <p className="text-xs text-[#686254] leading-relaxed">
                  Holding cash vs interest-bearing bonds. When interest rates ($i$) are high, the opportunity
                  cost of holding cash is high, so money demand contracts ($-hi$).
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* NEW: MONEY MARKET EQUILIBRIUM & LM CURVE DERIVATION WORKBENCH */}
            {/* ========================================================================= */}
            <div className="dash-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="status-pill ok text-[10px]">Core Foundation</span>
                    <span className="text-xs font-bold text-[#686254] uppercase tracking-wider">
                      Dornbusch &amp; Fischer Chapter 11 • Sessions 6 to 9
                    </span>
                  </div>
                  <h2 className="display text-xl sm:text-2xl font-bold text-[#211E19] mt-1">
                    Money Market Equilibrium &amp; The Derivation of the LM Curve
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Interactive Dual-Panel Model: Money Demand &amp; Supply Clearing (Panel A) ──▶ Derived Upward-Sloping LM Curve (Panel B)
                  </span>
                </div>

                <div className="status-pill ok">
                  <span>Market Clearing Rate: {mmEquilInterest}%</span>
                </div>
              </div>

              {/* Dynamic Connecting Bridge */}
              <div className="p-3 bg-[#FAF8F2] rounded border border-[#DCD5C4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E5C8A]"></span>
                  <span className="font-semibold text-[#211E19]">Panel A (Money Market):</span>
                  <span className="text-[#686254]">Real Money Demand $L(Y, i) = {mmSensitivityK}Y - {mmSensitivityH}i$ clears with Supply $M/P = {mmMoneySupply}$ Cr at $i^* = {mmEquilInterest}\%$.</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[#3D7A52] font-bold">
                  <span>──▶ Projects to LM Point: ({mmIncomeY} Cr, {mmEquilInterest}%)</span>
                </div>
              </div>

              {/* Dual SVG Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel A: Money Market Equilibrium */}
                <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                    <h3 className="font-bold text-xs uppercase text-[#2E5C8A] tracking-wider">
                      Panel A: Money Market Clearing ($M/P$ vs $i$)
                    </h3>
                    <span className="mono text-[11px] text-[#686254]">
                      Equilibrium: $M/P = kY - hi$
                    </span>
                  </div>

                  <div className="relative">
                    <svg viewBox="0 0 460 250" className="w-full h-56 bg-[#FAF8F2] rounded border border-[#DCD5C4]">
                      {/* Axes */}
                      <line x1="50" y1="210" x2="430" y2="210" stroke="#9A927E" strokeWidth="1.5" />
                      <line x1="50" y1="25" x2="50" y2="210" stroke="#9A927E" strokeWidth="1.5" />

                      {/* Axis Labels */}
                      <text x="430" y="225" fill="#686254" fontSize="10" textAnchor="end" fontFamily="monospace">
                        Real Money Balances (M/P)
                      </text>
                      <text x="45" y="20" fill="#686254" fontSize="10" textAnchor="start" fontFamily="monospace">
                        Interest Rate i (%)
                      </text>

                      {/* Y-axis Ticks */}
                      <text x="40" y="213" fill="#9A927E" fontSize="9" textAnchor="end">0%</text>
                      <text x="40" y="150" fill="#9A927E" fontSize="9" textAnchor="end">5%</text>
                      <text x="40" y="90" fill="#9A927E" fontSize="9" textAnchor="end">10%</text>
                      <text x="40" y="35" fill="#9A927E" fontSize="9" textAnchor="end">15%</text>

                      {/* Vertical Real Money Supply Line (M/P) */}
                      {(() => {
                        const xMs = 50 + (mmMoneySupply / 120) * 360;
                        return (
                          <g>
                            <line x1={xMs} y1="30" x2={xMs} y2="210" stroke="#2E5C8A" strokeWidth="3" />
                            <text x={xMs} y="22" fill="#2E5C8A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                              M̄/P̄ ({mmMoneySupply} Cr)
                            </text>
                            <line x1={xMs} y1="210" x2={xMs} y2="216" stroke="#2E5C8A" strokeWidth="1.5" />
                            <text x={xMs} y="228" fill="#2E5C8A" fontSize="9" textAnchor="middle" fontFamily="monospace">
                              {mmMoneySupply}
                            </text>
                          </g>
                        );
                      })()}

                      {/* Downward Sloping Money Demand Curve L(Y, i) */}
                      {(() => {
                        // At i = 14%: L_top = k*Y - 14*h
                        const lTop = mmSensitivityK * mmIncomeY - 14 * mmSensitivityH;
                        const xTop = 50 + (Math.max(5, Math.min(115, lTop)) / 120) * 360;
                        const yTop = 210 - (14 / 15) * 180;

                        // At i = 1%: L_bot = k*Y - 1*h
                        const lBot = mmSensitivityK * mmIncomeY - 1 * mmSensitivityH;
                        const xBot = 50 + (Math.max(5, Math.min(115, lBot)) / 120) * 360;
                        const yBot = 210 - (1 / 15) * 180;

                        return (
                          <g>
                            <line x1={xTop} y1={yTop} x2={xBot} y2={yBot} stroke="#E2571C" strokeWidth="2.5" />
                            <text x={xBot - 10} y={yBot - 6} fill="#E2571C" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              L(Y = {mmIncomeY}, i)
                            </text>
                          </g>
                        );
                      })()}

                      {/* Equilibrium Intersection Crosshair */}
                      {(() => {
                        const xEq = 50 + (mmMoneySupply / 120) * 360;
                        const yEq = 210 - (Math.min(14.5, mmEquilInterest) / 15) * 180;
                        return (
                          <g>
                            {/* Horizontal guide to Y-axis */}
                            <line x1="50" y1={yEq} x2={xEq} y2={yEq} stroke="#BB3B2E" strokeWidth="1" strokeDasharray="3 3" />
                            <circle cx={xEq} cy={yEq} r="5" fill="#BB3B2E" stroke="#FFFFFF" strokeWidth="1.5" />
                            <text x={xEq + 8} y={yEq - 6} fill="#BB3B2E" fontSize="10" fontWeight="bold" fontFamily="monospace">
                              i* = {mmEquilInterest}%
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <p className="text-[11px] text-[#686254] leading-relaxed">
                    <strong>Money Market Equilibrium:</strong> The vertical blue line represents real money supply fixed by the central bank.
                    The downward-sloping orange line represents money demand ($L = kY - hi$). Market clearing determines $i^* = {mmEquilInterest}\%$.
                  </p>
                </div>

                {/* Panel B: The Derived LM Curve */}
                <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                    <h3 className="font-bold text-xs uppercase text-[#3D7A52] tracking-wider">
                      Panel B: The Derived LM Curve ($Y$ vs $i$)
                    </h3>
                    <span className="mono text-[11px] text-[#686254]">
                      Formula: $i = (k/h)Y - (M/P)/h$
                    </span>
                  </div>

                  <div className="relative">
                    <svg viewBox="0 0 460 250" className="w-full h-56 bg-[#FAF8F2] rounded border border-[#DCD5C4]">
                      {/* Axes */}
                      <line x1="50" y1="210" x2="430" y2="210" stroke="#9A927E" strokeWidth="1.5" />
                      <line x1="50" y1="25" x2="50" y2="210" stroke="#9A927E" strokeWidth="1.5" />

                      {/* Axis Labels */}
                      <text x="430" y="225" fill="#686254" fontSize="10" textAnchor="end" fontFamily="monospace">
                        Real National Income / GDP (Y)
                      </text>
                      <text x="45" y="20" fill="#686254" fontSize="10" textAnchor="start" fontFamily="monospace">
                        Interest Rate i (%)
                      </text>

                      {/* Ticks */}
                      <text x="40" y="213" fill="#9A927E" fontSize="9" textAnchor="end">0%</text>
                      <text x="40" y="150" fill="#9A927E" fontSize="9" textAnchor="end">5%</text>
                      <text x="40" y="90" fill="#9A927E" fontSize="9" textAnchor="end">10%</text>
                      <text x="40" y="35" fill="#9A927E" fontSize="9" textAnchor="end">15%</text>

                      {/* Upward Sloping LM Curve */}
                      {(() => {
                        // Plot LM from Y=120 to Y=440
                        // i = (k*Y - M/P) / h
                        const yArr = [120, 200, 280, 360, 440];
                        const points = yArr.map((yVal) => {
                          const iVal = (mmSensitivityK * yVal - mmMoneySupply) / mmSensitivityH;
                          const clampedI = Math.max(0, Math.min(14.8, iVal));
                          const xCoord = 50 + ((yVal - 100) / 350) * 360;
                          const yCoord = 210 - (clampedI / 15) * 180;
                          return `${xCoord},${yCoord}`;
                        });
                        const pathD = `M ${points.join(" L ")}`;

                        return (
                          <g>
                            <path d={pathD} fill="none" stroke="#3D7A52" strokeWidth="3" />
                            <text x="360" y="45" fill="#3D7A52" fontSize="10" fontWeight="bold" fontFamily="monospace">
                              LM (Slope: {mmLmSlope})
                            </text>
                          </g>
                        );
                      })()}

                      {/* Operating Point on LM */}
                      {(() => {
                        const xPt = 50 + ((mmIncomeY - 100) / 350) * 360;
                        const yPt = 210 - (Math.min(14.5, mmEquilInterest) / 15) * 180;
                        return (
                          <g>
                            {/* Vertical Guide down to Y-axis */}
                            <line x1={xPt} y1={yPt} x2={xPt} y2="210" stroke="#3D7A52" strokeWidth="1" strokeDasharray="3 3" />
                            {/* Horizontal Guide to Y-axis */}
                            <line x1="50" y1={yPt} x2={xPt} y2={yPt} stroke="#3D7A52" strokeWidth="1" strokeDasharray="3 3" />

                            <circle cx={xPt} cy={yPt} r="5.5" fill="#3D7A52" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={xPt + 8} y={yPt - 6} fill="#3D7A52" fontSize="10" fontWeight="bold" fontFamily="monospace">
                              Point ({mmIncomeY} Cr, {mmEquilInterest}%)
                            </text>
                            <text x={xPt} y="228" fill="#3D7A52" fontSize="9" textAnchor="middle" fontFamily="monospace">
                              Y = {mmIncomeY}
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <p className="text-[11px] text-[#686254] leading-relaxed">
                    <strong>Derived LM Curve:</strong> Every point on the green LM curve represents a pair of $(Y, i)$ that keeps the money market in equilibrium.
                    Moving $Y$ walks the point along the curve; changing $M/P$ shifts the entire LM curve rightward!
                  </p>
                </div>
              </div>

              {/* Interactive Controls Grid */}
              <div className="p-4 bg-[#FAF8F2] rounded border border-[#DCD5C4] space-y-4">
                <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#211E19]">
                  🎛️ Interactive LM Curve Controls &amp; Shifters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Slider 1: National Income Y */}
                  <div className="control">
                    <label>Real National Income / GDP ($Y$)</label>
                    <div className="readout">
                      <span>{mmIncomeY}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="160"
                      max="440"
                      step="10"
                      value={mmIncomeY}
                      onChange={(e) => setMmIncomeY(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#686254] block mt-1">
                      Moves point <em>along</em> the LM curve by expanding transaction demand.
                    </span>
                  </div>

                  {/* Slider 2: Real Money Supply M/P */}
                  <div className="control">
                    <label>Real Money Supply ($M/P$)</label>
                    <div className="readout">
                      <span>{mmMoneySupply}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      step="2"
                      value={mmMoneySupply}
                      onChange={(e) => setMmMoneySupply(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#2E5C8A] block mt-1">
                      <strong>LM Curve Shifter:</strong> Central Bank injection shifts entire LM curve.
                    </span>
                  </div>

                  {/* Slider 3: Transaction Sensitivity k */}
                  <div className="control">
                    <label>Transactions Sensitivity ($k$)</label>
                    <div className="readout">
                      <span>{mmSensitivityK}</span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max="0.45"
                      step="0.05"
                      value={mmSensitivityK}
                      onChange={(e) => setMmSensitivityK(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#686254] block mt-1">
                      Higher $k$ steepens the LM curve slope ($k/h$).
                    </span>
                  </div>

                  {/* Slider 4: Speculative Sensitivity h */}
                  <div className="control">
                    <label>Interest Sensitivity ($h$)</label>
                    <div className="readout">
                      <span>{mmSensitivityH}</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="22"
                      step="1"
                      value={mmSensitivityH}
                      onChange={(e) => setMmSensitivityH(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#3D7A52] block mt-1">
                      High $h$ flattens LM (Keynesian); low $h$ steepens LM (Classical).
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytical Readouts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                  <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                    Market Clearing Rate ($i^*$)
                  </span>
                  <span className="text-2xl font-black mono text-[#2E5C8A]">
                    {mmEquilInterest}%
                  </span>
                  <span className="text-[10px] text-[#686254] block mt-1">
                    Equilibrium interest rate
                  </span>
                </div>

                <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                  <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                    LM Curve Slope ($k/h$)
                  </span>
                  <span className="text-2xl font-black mono text-[#3D7A52]">
                    {mmLmSlope}
                  </span>
                  <span className="text-[10px] text-[#686254] block mt-1">
                    Change in $i$ per ₹1 Cr $\Delta Y$
                  </span>
                </div>

                <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                  <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                    Horizontal LM Shift
                  </span>
                  <span className="text-2xl font-black mono text-[#E2571C]">
                    {mmHorizontalShift} Cr
                  </span>
                  <span className="text-[10px] text-[#686254] block mt-1">
                    $(M/P) / k$ shift distance
                  </span>
                </div>

                <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                  <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                    Economic Regime
                  </span>
                  <span className="text-sm font-bold mono text-[#211E19] block mt-1">
                    {mmSensitivityH >= 16
                      ? "Keynesian / Flat LM"
                      : mmSensitivityH <= 6
                      ? "Classical / Steep LM"
                      : "Intermediate LM"}
                  </span>
                  <span className="text-[10px] text-[#686254] block mt-1">
                    Elasticity classification
                  </span>
                </div>
              </div>

              {/* Economic Theory Deep Dive */}
              <div className="p-4 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-xs leading-relaxed space-y-2 text-[#686254]">
                <strong className="text-[#211E19] block text-sm">
                  🎓 Dornbusch Derivation Logic — Why Does the LM Curve Behave This Way?
                </strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="font-bold text-[#3D7A52] block">1. Why LM Slopes Upward:</span>
                    <p>
                      When national income rises ($Y \uparrow$), households make more purchases and demand more cash balances ($kY \uparrow$).
                      Because the real money stock ($M/P$) is fixed by the central bank, there is an excess demand for money.
                      To obtain cash, individuals sell bonds, pushing bond prices down and driving interest rates ($i$) up until speculative demand contracts enough to clear the market.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="font-bold text-[#2E5C8A] block">2. What Shifts the LM Curve:</span>
                    <p>
                      When the central bank increases money supply ($M/P \uparrow$ through open market purchases or rate cuts),
                      there is excess liquidity at the initial interest rate. People buy bonds, pushing bond prices up and interest rates down.
                      At every level of income $Y$, the market-clearing interest rate is now lower, shifting the entire LM curve <strong>downward and to the right</strong> by $\Delta(M/P) / k$.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive RBI Money Multiplier Simulator */}
            <div className="dash-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    RBI Money Multiplier &amp; Credit Expansion Engine
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Formula: Broad Money $M_3 = m \times H$, where $m = (1 + cu) / (cu + re)$
                  </span>
                </div>

                <div className="status-pill ok">
                  <RepeatIcon className="w-3.5 h-3.5" />
                  <span>Multiplier: {moneyMultiplier}×</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Reserve Money Base ($H$ / $M_0$)</label>
                    <div className="readout">
                      <span>{reserveMoneyH}</span> ₹ Lakh Cr
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="90"
                      step="2"
                      value={reserveMoneyH}
                      onChange={(e) => setReserveMoneyH(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Currency-to-Deposit Ratio ($cu$)</label>
                    <div className="readout">
                      <span>{cuRatio}</span> ({Math.round(cuRatio * 100)}% of deposits held as cash)
                    </div>
                    <input
                      type="range"
                      min="0.08"
                      max="0.30"
                      step="0.01"
                      value={cuRatio}
                      onChange={(e) => setCuRatio(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Reserve-to-Deposit Ratio ($re$ = CRR + Excess)</label>
                    <div className="readout">
                      <span>{reRatio}</span> ({Math.round(reRatio * 100)}% cash reserves with RBI)
                    </div>
                    <input
                      type="range"
                      min="0.04"
                      max="0.18"
                      step="0.01"
                      value={reRatio}
                      onChange={(e) => setReRatio(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Statutory Liquidity Ratio ($SLR$)</label>
                    <div className="readout">
                      <span>{Math.round(slrRatio * 100)}%</span> in G-Secs
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="0.25"
                      step="0.01"
                      value={slrRatio}
                      onChange={(e) => setSlrRatio(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        High-Powered ($H$)
                      </span>
                      <span className="text-xl font-bold mono text-[#211E19]">
                        {reserveMoneyH} Cr
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Multiplier ($m$)
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        {moneyMultiplier}×
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Broad Money ($M_3$)
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        {broadMoneyM3} Cr
                      </span>
                    </div>
                  </div>

                  {/* Multi-Tier Deposit Expansion Cascade */}
                  <div className="bg-white p-4 rounded border border-[#DCD5C4] space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#686254] block">
                      Fractional Reserve Credit Expansion Waterfall
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                        <span className="font-semibold text-[#211E19]">Round 1: Initial RBI Injection</span>
                        <span className="mono font-bold text-[#2E5C8A]">+{reserveMoneyH} Cr</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                        <span className="font-semibold text-[#211E19]">Bank Reserves Kept (${reRatio * 100}$% CRR)</span>
                        <span className="mono font-bold text-[#BB3B2E]">
                          −{Math.round(reserveMoneyH * reRatio * 10) / 10} Cr locked
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                        <span className="font-semibold text-[#211E19]">SLR In G-Secs (${slrRatio * 100}$%)</span>
                        <span className="mono font-bold text-[#686254]">
                          {Math.round(reserveMoneyH * slrRatio * 10) / 10} Cr sovereign debt
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                        <span className="font-semibold text-[#211E19]">Fresh Private Credit Disbursed</span>
                        <span className="mono font-bold text-[#3D7A52]">
                          +{Math.round(reserveMoneyH * (1 - reRatio - slrRatio) * 10) / 10} Cr
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded bg-[#FAF8F2] border border-[#2E5C8A] font-bold">
                        <span className="text-[#211E19]">Cumulative Broad Money Created ($M_3$)</span>
                        <span className="mono text-base text-[#E2571C]">{broadMoneyM3} Lakh Cr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW ADDITION: Demonetization & UPI Cash Migration Simulator */}
            <div className="dash-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                <div>
                  <h3 className="card-title mb-0">Currency Drain &amp; Digital Payments Shock (UPI Migration / Demonetization)</h3>
                  <span className="text-xs text-[#686254]">
                    Shows how shifting from physical cash to bank deposits lowers $cu$, expanding the banking multiplier
                  </span>
                </div>
                <div className="status-pill ok">
                  <span>Shifted Multiplier: {adjustedMultiplier}×</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4] space-y-3">
                  <div className="control">
                    <label>Cash Migrated to Bank Accounts (%)</label>
                    <div className="readout">
                      <span>{digitalMigrationPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={digitalMigrationPct}
                      onChange={(e) => setDigitalMigrationPct(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#9A927E]">
                      Simulates demonetization or UPI cashless expansion.
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Adjusted Currency Ratio ($cu$)</span>
                    <div className="text-2xl font-black mono text-[#2E5C8A]">
                      {adjustedCuRatio}
                    </div>
                    <p className="text-xs text-[#686254]">
                      Less cash held outside banks $\implies$ more deposits available for lending.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">New Total Money Supply ($M_3$)</span>
                    <div className="text-2xl font-black mono text-[#E2571C]">
                      {adjustedM3} ₹ Lakh Cr (+{Math.round((adjustedM3 - broadMoneyM3) * 10) / 10} Cr)
                    </div>
                    <p className="text-xs text-[#686254]">
                      Without RBI adding ₹1 of new currency, money supply expands purely through deposit retention!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: IS-LM POLICY WORKBENCH */}
        {/* ========================================================================= */}
        {activeTab === "islm" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                SIMULTANEOUS EQUILIBRIUM IN GOODS &amp; MONEY MARKETS — DORNBUSCH &amp; FISCHER MODEL
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                The IS-LM Policy Simulation Workbench
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                The IS curve traces all combinations of interest rates ($i$) and output ($Y$) where the goods market clears.
                The LM curve traces combinations where money demand equals real money supply. Their simultaneous intersection
                defines macroeconomic equilibrium $(Y^*, i^*)$.
              </p>
            </div>

            {/* Quick Historical Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold uppercase text-[#686254] mr-1">Historical Presets:</span>
              <button
                onClick={() => applyIsLmPreset("baseline")}
                className="px-3 py-1 rounded bg-white border border-[#DCD5C4] text-xs font-semibold hover:border-[#2E5C8A] transition-colors"
              >
                Baseline Calm State
              </button>
              <button
                onClick={() => applyIsLmPreset("stimulus")}
                className="px-3 py-1 rounded bg-white border border-[#DCD5C4] text-xs font-semibold text-[#3D7A52] hover:border-[#3D7A52] transition-colors"
              >
                Coordinated Fiscal+Monetary Stimulus
              </button>
              <button
                onClick={() => applyIsLmPreset("liquidity-trap")}
                className="px-3 py-1 rounded bg-white border border-[#DCD5C4] text-xs font-semibold text-[#BB3B2E] hover:border-[#BB3B2E] transition-colors"
              >
                Liquidity Trap / ZLB
              </button>
              <button
                onClick={() => applyIsLmPreset("reform-1991")}
                className="px-3 py-1 rounded bg-white border border-[#DCD5C4] text-xs font-semibold text-[#2E5C8A] hover:border-[#2E5C8A] transition-colors"
              >
                1991 Fiscal Consolidation
              </button>
            </div>

            {/* Core Interactive IS-LM Policy Workbench */}
            <div className="dash-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    Live Dynamic IS-LM Simulator &amp; Crowding-Out Analyzer
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Move policy sliders below to see live curve shifts and intersection equilibrium
                  </span>
                </div>

                <div className="status-pill ok">
                  <span>
                    Equilibrium: Y* = {islmY} Cr, i* = {islmI}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2E5C8A] border-b border-[#DCD5C4] pb-1">
                    Fiscal Policy Levers (IS Curve)
                  </div>

                  <div className="control">
                    <label>Autonomous Spending (Ā = C̄ + Ī + G)</label>
                    <div className="readout">
                      <span>{isAbar}</span> ₹ Cr
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="260"
                      step="5"
                      value={isAbar}
                      onChange={(e) => setIsAbar(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#9A927E]">
                      Increasing Government Spending ($G \uparrow$) shifts IS rightward.
                    </span>
                  </div>

                  <div className="control">
                    <label>Investment Interest Sensitivity ($b$)</label>
                    <div className="readout">
                      <span>{isB}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={isB}
                      onChange={(e) => setIsB(Number(e.target.value))}
                    />
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-[#3D7A52] border-b border-[#DCD5C4] pb-1 pt-2">
                    Monetary Policy Levers (LM Curve)
                  </div>

                  <div className="control">
                    <label>Real Money Stock ($M/P$)</label>
                    <div className="readout">
                      <span>{lmMoneyStock}</span> ₹ Cr
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="200"
                      step="5"
                      value={lmMoneyStock}
                      onChange={(e) => setLmMoneyStock(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-[#9A927E]">
                      RBI Open Market Purchases ($M \uparrow$) shift LM rightward.
                    </span>
                  </div>

                  <div className="control">
                    <label>Money Demand Interest Sensitivity ($h$)</label>
                    <div className="readout">
                      <span>{lmH}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="2"
                      value={lmH}
                      onChange={(e) => setLmH(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Equilibrium Output (Y*)
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        {islmY} Cr
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Interest Rate (i*)
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        {islmI}%
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Crowding-Out Factor
                      </span>
                      <span className="text-xl font-bold mono text-[#BB3B2E]">
                        {crowdingOutPenalty}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border border-[#DCD5C4]">
                    <svg viewBox="0 0 500 280" className="w-full h-64 overflow-visible">
                      <rect x="50" y="20" width="420" height="230" fill="#FAF8F2" opacity="0.6" />
                      <line x1="50" y1="250" x2="480" y2="250" stroke="#9A927E" strokeWidth="1.5" />
                      <line x1="50" y1="250" x2="50" y2="20" stroke="#9A927E" strokeWidth="1.5" />

                      <text x="440" y="268" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        Income (Y)
                      </text>
                      <text x="10" y="25" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        Rate (i%)
                      </text>

                      {(() => {
                        const mapX = (yVal: number) => 50 + (yVal / 600) * 420;
                        const mapY = (iVal: number) => 250 - (iVal / 20) * 230;

                        const isI1 = isAbar / isB - 100 / (isAlpha * isB);
                        const isI2 = isAbar / isB - 500 / (isAlpha * isB);

                        const lmI1 = (lmK / lmH) * 100 - lmMoneyStock / lmH;
                        const lmI2 = (lmK / lmH) * 500 - lmMoneyStock / lmH;

                        const eqPtX = mapX(islmY);
                        const eqPtY = mapY(islmI);

                        return (
                          <g>
                            <line
                              x1={mapX(100)}
                              y1={mapY(isI1)}
                              x2={mapX(500)}
                              y2={mapY(isI2)}
                              stroke="#2E5C8A"
                              strokeWidth="3"
                            />
                            <text
                              x={mapX(500) + 6}
                              y={mapY(isI2) + 4}
                              fill="#2E5C8A"
                              fontSize="11"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              IS
                            </text>

                            <line
                              x1={mapX(100)}
                              y1={mapY(lmI1)}
                              x2={mapX(500)}
                              y2={mapY(lmI2)}
                              stroke="#3D7A52"
                              strokeWidth="3"
                            />
                            <text
                              x={mapX(500) + 6}
                              y={mapY(lmI2) + 4}
                              fill="#3D7A52"
                              fontSize="11"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              LM
                            </text>

                            {islmI >= 0 && islmY >= 0 && (
                              <>
                                <line
                                  x1={eqPtX}
                                  y1={eqPtY}
                                  x2={eqPtX}
                                  y2="250"
                                  stroke="#E2571C"
                                  strokeWidth="1.2"
                                  strokeDasharray="3 3"
                                />
                                <line
                                  x1="50"
                                  y1={eqPtY}
                                  x2={eqPtX}
                                  y2={eqPtY}
                                  stroke="#E2571C"
                                  strokeWidth="1.2"
                                  strokeDasharray="3 3"
                                />

                                <circle
                                  cx={eqPtX}
                                  cy={eqPtY}
                                  r="6"
                                  fill="#E2571C"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                />
                                <text
                                  x={eqPtX + 8}
                                  y={eqPtY - 8}
                                  fill="#E2571C"
                                  fontSize="11"
                                  fontFamily="IBM Plex Mono"
                                  fontWeight="bold"
                                >
                                  E* ({islmY}, {islmI}%)
                                </text>
                              </>
                            )}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AS-AD & PHILLIPS CURVE */}
        {/* ========================================================================= */}
        {activeTab === "asad" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                MEDIUM-RUN MACROECONOMICS — INFLATION &amp; UNEMPLOYMENT
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                AS-AD Model &amp; The Expectations-Augmented Phillips Curve
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                In the short run, nominal wages and prices are sticky, producing an upward-sloping Aggregate Supply (AS) curve
                and an inflation-unemployment tradeoff (Phillips Curve). In the long run, expectations adjust, wages become flexible,
                and the supply curve becomes vertical at the Natural Rate of Unemployment (NAIRU $u^*$).
              </p>
            </div>

            {/* Phillips Curve Formula */}
            <div className="dash-card">
              <h3 className="card-title">Expectations-Augmented Phillips Curve</h3>
              <div className="formula-box">
                π = π^e − β(u − u*) + ν
              </div>
              <p className="text-xs text-[#686254] mt-2 leading-relaxed">
                Where $\pi$ is actual inflation, $\pi^e$ is expected inflation (anchored by central bank credibility),
                $u$ is actual unemployment, $u^*$ is the Non-Accelerating Inflation Rate of Unemployment (NAIRU), and $\nu$ is an adverse supply shock.
              </p>
            </div>

            {/* Interactive Phillips Curve Simulator */}
            <div className="dash-card space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    Phillips Curve &amp; Supply Shock Simulator
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Observe how expectations and commodity price shocks trigger stagflation
                  </span>
                </div>

                <div
                  className={`status-pill ${
                    supplyShockNu > 0 && actualU > nairuU
                      ? "bad"
                      : inflationPi > 6
                      ? "bad"
                      : "ok"
                  }`}
                >
                  <ActivityIcon className="w-3.5 h-3.5" />
                  <span>
                    Current Inflation: {inflationPi}% | Unemployment: {actualU}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Expected Inflation ($\pi^e$)</label>
                    <div className="readout">
                      <span>{expectedInf}</span>%
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      step="0.5"
                      value={expectedInf}
                      onChange={(e) => setExpectedInf(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Actual Unemployment Rate ($u$)</label>
                    <div className="readout">
                      <span>{actualU}</span>%
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      step="0.2"
                      value={actualU}
                      onChange={(e) => setActualU(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Natural Rate of Unemployment / NAIRU ($u^*$)</label>
                    <div className="readout">
                      <span>{nairuU}</span>%
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="8"
                      step="0.2"
                      value={nairuU}
                      onChange={(e) => setNairuU(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Adverse Supply Shock ($\nu$)</label>
                    <div className="readout">
                      <span>+{supplyShockNu}</span>% (e.g. Oil/Energy Spike)
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={supplyShockNu}
                      onChange={(e) => setSupplyShockNu(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-4 rounded border border-[#DCD5C4]">
                    <svg viewBox="0 0 500 240" className="w-full h-56 overflow-visible">
                      <line x1="50" y1="210" x2="480" y2="210" stroke="#9A927E" strokeWidth="1.5" />
                      <line x1="50" y1="210" x2="50" y2="20" stroke="#9A927E" strokeWidth="1.5" />

                      <text x="420" y="225" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        Unemployment (u%)
                      </text>
                      <text x="15" y="25" fill="#686254" fontSize="10" fontFamily="IBM Plex Mono">
                        Inflation (π%)
                      </text>

                      {(() => {
                        const mapU = (uVal: number) => 50 + (uVal / 12) * 420;
                        const mapPi = (piVal: number) => 210 - (piVal / 12) * 180;

                        const lrpcX = mapU(nairuU);
                        const srpcU1 = 3;
                        const srpcPi1 = expectedInf - betaSensitivity * (srpcU1 - nairuU) + supplyShockNu;
                        const srpcU2 = 10;
                        const srpcPi2 = expectedInf - betaSensitivity * (srpcU2 - nairuU) + supplyShockNu;

                        const curX = mapU(actualU);
                        const curY = mapPi(inflationPi);

                        return (
                          <g>
                            <line
                              x1={lrpcX}
                              y1="210"
                              x2={lrpcX}
                              y2="20"
                              stroke="#3D7A52"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={lrpcX + 5}
                              y="30"
                              fill="#3D7A52"
                              fontSize="10"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              LRPC (u*={nairuU}%)
                            </text>

                            <line
                              x1={mapU(srpcU1)}
                              y1={mapPi(srpcPi1)}
                              x2={mapU(srpcU2)}
                              y2={mapPi(srpcPi2)}
                              stroke="#BB3B2E"
                              strokeWidth="2.5"
                            />
                            <text
                              x={mapU(srpcU2) - 30}
                              y={mapPi(srpcPi2) - 8}
                              fill="#BB3B2E"
                              fontSize="10"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              SRPC
                            </text>

                            <line
                              x1="50"
                              y1={mapPi(4)}
                              x2="480"
                              y2={mapPi(4)}
                              stroke="#9A927E"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                            <text x="55" y={mapPi(4) - 4} fill="#9A927E" fontSize="9" fontFamily="IBM Plex Mono">
                              RBI Anchor Target: 4%
                            </text>

                            <circle
                              cx={curX}
                              cy={curY}
                              r="6"
                              fill="#E2571C"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <text
                              x={curX + 8}
                              y={curY - 6}
                              fill="#E2571C"
                              fontSize="11"
                              fontFamily="IBM Plex Mono"
                              fontWeight="bold"
                            >
                              ({actualU}%, {inflationPi}%)
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW ADDITION: The Sacrifice Ratio & Disinflation Cost Calculator */}
            <div className="dash-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                <div>
                  <h3 className="card-title mb-0">The Sacrifice Ratio (Cost of Disinflation)</h3>
                  <span className="text-xs text-[#686254]">
                    Formula: Cumulative output loss per 1% point permanent reduction in inflation
                  </span>
                </div>
                <div className="status-pill bad">
                  <span>Output Loss: −{totalOutputLossPct}% GDP</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4] space-y-3">
                  <div className="control">
                    <label>Target Inflation Reduction ($\Delta \pi$)</label>
                    <div className="readout">
                      <span>−{disinflationGoal}%</span> lower
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.5"
                      value={disinflationGoal}
                      onChange={(e) => setDisinflationGoal(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Empirical Output Cost</span>
                    <div className="text-2xl font-black mono text-[#BB3B2E]">
                      −{totalOutputLossPct}% of 1 Year GDP
                    </div>
                    <p className="text-xs text-[#686254]">
                      Under adaptive expectations, bringing inflation down by {disinflationGoal}% requires running
                      unemployment above NAIRU for multiple quarters.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Lucas Critique / Credibility</span>
                    <div className="text-2xl font-black mono text-[#3D7A52]">
                      Cost $\to$ 0 (Credible Central Bank)
                    </div>
                    <p className="text-xs text-[#686254]">
                      If the central bank has high credibility, rational wage-setters immediately lower $\pi^e$,
                      reducing inflation with minimal output sacrifice!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: POLICY CASES & DECISION SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === "cases" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot" style={{ background: "var(--rust)" }}></span>
                REAL-WORLD MACRO POLICY WAR ROOM — INTERACTIVE DECISION SIMULATOR
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Executive Policy Cases &amp; Crisis Decision Room
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                Assume the role of the RBI Governor and Union Finance Minister during India&apos;s most critical macroeconomic crises.
                Choose your monetary and fiscal policy levers, balance political and economic trade-offs, and observe the immediate transmission,
                multiplier feedback, and long-term consequences.
              </p>
            </div>

            {/* Case Selection Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setSelectedCase("subprime2008")}
                className={`p-3 text-left rounded border transition-all ${
                  selectedCase === "subprime2008"
                    ? "bg-[#FAF8F2] border-[#BB3B2E] shadow-sm ring-1 ring-[#BB3B2E]"
                    : "bg-white border-[#DCD5C4] hover:bg-[#F4F1E9]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#BB3B2E] tracking-wider">
                    Case 1 • Year 2008
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#BB3B2E]"></span>
                </div>
                <h4 className="font-bold text-xs text-[#211E19] leading-snug">
                  2008 Subprime Contagion &amp; Liquidity Freeze
                </h4>
                <p className="text-[11px] text-[#686254] mt-1 line-clamp-2">
                  Lehman collapses; exports drop to -3.5%; FIIs flee; call money rates spike to 20%.
                </p>
              </button>

              <button
                onClick={() => setSelectedCase("frbm2010")}
                className={`p-3 text-left rounded border transition-all ${
                  selectedCase === "frbm2010"
                    ? "bg-[#FAF8F2] border-[#2E5C8A] shadow-sm ring-1 ring-[#2E5C8A]"
                    : "bg-white border-[#DCD5C4] hover:bg-[#F4F1E9]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#2E5C8A] tracking-wider">
                    Case 2 • Year 2010
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#2E5C8A]"></span>
                </div>
                <h4 className="font-bold text-xs text-[#211E19] leading-snug">
                  Meeting FRBM Deficit Target: Austerity Trap
                </h4>
                <p className="text-[11px] text-[#686254] mt-1 line-clamp-2">
                  Deficit at 6.46% of GDP; cut ₹2.11 Lakh Cr to reach 3.0%; Capex vs Subsidies dilemma.
                </p>
              </button>

              <button
                onClick={() => setSelectedCase("taper2013")}
                className={`p-3 text-left rounded border transition-all ${
                  selectedCase === "taper2013"
                    ? "bg-[#FAF8F2] border-[#E2571C] shadow-sm ring-1 ring-[#E2571C]"
                    : "bg-white border-[#DCD5C4] hover:bg-[#F4F1E9]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#E2571C] tracking-wider">
                    Case 3 • Year 2013
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#E2571C]"></span>
                </div>
                <h4 className="font-bold text-xs text-[#211E19] leading-snug">
                  2013 Taper Tantrum: Rupee Freefall
                </h4>
                <p className="text-[11px] text-[#686254] mt-1 line-clamp-2">
                  CAD at 4.8% of GDP; Rupee crashes to 68.85/USD; Rajan takes charge at RBI.
                </p>
              </button>

              <button
                onClick={() => setSelectedCase("stagflation2022")}
                className={`p-3 text-left rounded border transition-all ${
                  selectedCase === "stagflation2022"
                    ? "bg-[#FAF8F2] border-[#3D7A52] shadow-sm ring-1 ring-[#3D7A52]"
                    : "bg-white border-[#DCD5C4] hover:bg-[#F4F1E9]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#3D7A52] tracking-wider">
                    Case 4 • Year 2022
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#3D7A52]"></span>
                </div>
                <h4 className="font-bold text-xs text-[#211E19] leading-snug">
                  2022 Ukraine War: Stagflation Shock
                </h4>
                <p className="text-[11px] text-[#686254] mt-1 line-clamp-2">
                  Crude at $120/bbl; CPI surges to 7.8%; Fed hikes 500 bps; growth recovery fragile.
                </p>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* ACTIVE CASE 1: 2008 SUBPRIME CRISIS */}
            {/* ========================================================================= */}
            {selectedCase === "subprime2008" && (
              <div className="dash-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="status-pill bad text-[10px]">Crisis War Room</span>
                      <span className="text-xs font-bold text-[#686254] uppercase tracking-wider">
                        Role: RBI Governor (Dr. D. Subbarao) &amp; Union Finance Minister
                      </span>
                    </div>
                    <h2 className="display text-2xl font-bold text-[#211E19] mt-1">
                      Case 1: The 2008 Subprime Contagion &amp; Domestic Liquidity Freeze
                    </h2>
                  </div>

                  <div className="mono text-xs p-2 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-[#686254]">
                    Source: Prof. Ganesh Kumar N. &amp; Rashmi Shukla (IIM Indore Case)
                  </div>
                </div>

                {/* Intel Briefing */}
                <div className="p-3.5 bg-[#FAF8F2] rounded border-l-4 border-l-[#BB3B2E] border border-[#DCD5C4] text-xs text-[#686254] leading-relaxed">
                  <strong className="text-[#211E19] block mb-1">Macroeconomic Situation (September 2008):</strong>
                  Lehman Brothers collapses in the US, dragging world GDP growth to -0.7%. In India, foreign institutional investors (FIIs)
                  pull billions out of domestic equity markets to meet parent margin calls, causing the BSE Sensex to crash from 20,000 to 8,995.
                  Indian corporate access to foreign credit (ECBs) vanishes overnight, sparking a run on domestic commercial bank credit.
                  Overnight call money rates spike to 20%, and Indian export growth plummets from +29% to -3.5%.
                </div>

                {/* Levers and Live Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Decision Levers */}
                  <div className="lg:col-span-6 space-y-4 bg-white p-4 rounded border border-[#DCD5C4]">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#2E5C8A]">
                      🎯 Executive Decision Levers
                    </h3>

                    {/* Lever 1: Repo Rate Cut */}
                    <div className="control">
                      <label>1. Policy Repo Rate Cut (Monetary Stance)</label>
                      <div className="readout">
                        <span>Cut by {c1RepoCut} bps (New Repo: {(9.0 - c1RepoCut / 100).toFixed(2)}%)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="25"
                        value={c1RepoCut}
                        onChange={(e) => setC1RepoCut(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#9A927E] block mt-1">
                        Starting Repo Rate was 9.00%. Historical RBI move: slashed by 425 bps to 4.75%.
                      </span>
                    </div>

                    {/* Lever 2: CRR Cut */}
                    <div className="control">
                      <label>2. Cash Reserve Ratio (CRR) Slash</label>
                      <div className="readout">
                        <span>Cut by {c1CrrCut} bps (New CRR: {(9.0 - c1CrrCut / 100).toFixed(2)}%)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="450"
                        step="25"
                        value={c1CrrCut}
                        onChange={(e) => setC1CrrCut(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#9A927E] block mt-1">
                        Starting CRR was 9.00%. Historical RBI move: slashed to 5.00%, injecting ₹1,60,000 Cr directly into banks.
                      </span>
                    </div>

                    {/* Lever 3: Fiscal Stimulus Package */}
                    <div className="control">
                      <label>3. Fiscal Stimulus (Deficit Slippage Allowed)</label>
                      <div className="readout">
                        <span>Target Deficit: {c1FiscalDeficitAllowed}% of GDP</span>
                      </div>
                      <input
                        type="range"
                        min="3.0"
                        max="7.5"
                        step="0.1"
                        value={c1FiscalDeficitAllowed}
                        onChange={(e) => setC1FiscalDeficitAllowed(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#9A927E] block mt-1">
                        FRBM mandated 3.0%. Historical move: 3 stimulus packages slashed excise duties by 4%, driving deficit to 6.46%.
                      </span>
                    </div>

                    {/* Lever 4: FX Market Stance */}
                    <div className="control">
                      <label>4. Foreign Exchange Intervention Strategy</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <button
                          onClick={() => setC1FxStance("managed")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c1FxStance === "managed"
                              ? "bg-[#2E5C8A] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Managed Glide (Sell $30B)
                        </button>
                        <button
                          onClick={() => setC1FxStance("burn-reserves")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c1FxStance === "burn-reserves"
                              ? "bg-[#BB3B2E] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Defend Peg ($70B Burn)
                        </button>
                        <button
                          onClick={() => setC1FxStance("free-float")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c1FxStance === "free-float"
                              ? "bg-[#E2571C] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Pure Free Float (No Sale)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Outcome Dashboard */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#BB3B2E]">
                      📊 Macroeconomic Consequences (Your Strategy)
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          2009-10 GDP Growth Rate
                        </span>
                        <span className="text-2xl font-black mono text-[#2E5C8A]">
                          {c1GdpRebound}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Historical Actual: 8.6% (V-shaped recovery)
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          2009-10 CPI Inflation
                        </span>
                        <span className={`text-2xl font-black mono ${c1InflationOutcome > 8.5 ? "text-[#BB3B2E]" : "text-[#3D7A52]"}`}>
                          {c1InflationOutcome}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Historical Actual: 10.4% (Inflation spike)
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Fiscal Deficit (% of GDP)
                        </span>
                        <span className={`text-2xl font-black mono ${c1FiscalDeficitAllowed > 5.0 ? "text-[#E2571C]" : "text-[#2E5C8A]"}`}>
                          {c1FiscalDeficitAllowed}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Statutory Limit: 3.0% (FRBM Act)
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Rupee Exchange Rate (USD/INR)
                        </span>
                        <span className="text-2xl font-black mono text-[#211E19]">
                          ₹{c1ExchangeRate}
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Pre-crisis level: ₹39.50/USD
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-xs leading-relaxed space-y-2">
                      <div className="flex items-center justify-between font-bold text-[#211E19]">
                        <span>Total Liquidity Pumped into Banking System:</span>
                        <span className="mono text-sm text-[#3D7A52]">
                          ₹{c1TotalLiquidityInjected.toLocaleString()} Crores
                        </span>
                      </div>
                      <p className="text-[#686254]">
                        Through repo rate slashing, CRR releases, and special liquidity windows for mutual funds and NBFCs,
                        the RBI unlocked domestic bank balance sheets, ensuring call money rates fell from 20% back to ~4.0%.
                      </p>
                    </div>

                    {/* Executive Faculty Review */}
                    <div className="p-3.5 bg-white rounded border border-[#DCD5C4] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-[#2E5C8A]">
                          🎓 MBA Faculty Critique &amp; Trade-off Evaluation:
                        </span>
                      </div>

                      {c1FiscalDeficitAllowed >= 6.0 && c1RepoCut >= 350 ? (
                        <p className="text-xs text-[#686254] leading-relaxed">
                          <strong className="text-[#3D7A52]">Super-Charged Keynesian Relief (Historical Match):</strong> You successfully
                          engineered a rapid V-shaped recovery (GDP rebounding to {c1GdpRebound}%), shielding Indian industry from the Great Recession.
                          However, by leaving monetary taps wide open and ballooning the fiscal deficit to {c1FiscalDeficitAllowed}%, you planted the
                          seeds of persistent double-digit food/fuel inflation ({c1InflationOutcome}%) and high twin deficits that triggered India&apos;s
                          2013 CAD crisis.
                        </p>
                      ) : c1FiscalDeficitAllowed <= 4.0 ? (
                        <p className="text-xs text-[#686254] leading-relaxed">
                          <strong className="text-[#BB3B2E]">Austerity-Induced Protracted Slowdown:</strong> By strictly adhering to the 3%
                          FRBM limit during a once-in-a-century global shock, you kept inflation low ({c1InflationOutcome}%), but aggregate demand collapsed.
                          Indian GDP growth languished at {c1GdpRebound}%, industrial production contracted, and widespread private corporate bankruptcies emerged.
                        </p>
                      ) : (
                        <p className="text-xs text-[#686254] leading-relaxed">
                          <strong className="text-[#E2571C]">Cautious Middle Path:</strong> A balanced intervention cushioned growth ({c1GdpRebound}%)
                          while keeping inflation moderate ({c1InflationOutcome}%). However, industrial credit took nearly 2 years longer to recover compared
                          to historical performance.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACTIVE CASE 2: FRBM DEFICIT TARGET */}
            {/* ========================================================================= */}
            {selectedCase === "frbm2010" && (
              <div className="dash-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="status-pill neutral text-[10px]">Fiscal Consolidation War Room</span>
                      <span className="text-xs font-bold text-[#686254] uppercase tracking-wider">
                        Role: Chief Economic Adviser &amp; Finance Minister of India
                      </span>
                    </div>
                    <h2 className="display text-2xl font-bold text-[#211E19] mt-1">
                      Case 2: Meeting Budget Deficit Targets — The Austerity Trap
                    </h2>
                  </div>

                  <div className="mono text-xs p-2 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-[#686254]">
                    Source: Prof. Subhasankar Chattopadhyay (IIM Indore Case Handout)
                  </div>
                </div>

                {/* Intel Briefing */}
                <div className="p-3.5 bg-[#FAF8F2] rounded border-l-4 border-l-[#2E5C8A] border border-[#DCD5C4] text-xs text-[#686254] leading-relaxed">
                  <strong className="text-[#211E19] block mb-1">Macroeconomic Situation (Year 2010):</strong>
                  To avert depression during 2008, the government expanded spending, driving Gross Fiscal Deficit to <strong>6.46% of GDP</strong> (₹3,94,635 Crores on GDP of ₹61,08,903 Crores).
                  The statutory FRBM target requires bringing the deficit down to <strong>3.0% of GDP</strong> (₹1,83,267 Crores).
                  The government must bridge an absolute gap of <strong>₹2,11,368 Crores</strong>. How will you allocate the spending cuts and tax hikes?
                </div>

                {/* Levers and Live Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Decision Levers */}
                  <div className="lg:col-span-6 space-y-4 bg-white p-4 rounded border border-[#DCD5C4]">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#2E5C8A]">
                      🎯 Fiscal Consolidation Allocation (Target: ₹2,11,368 Cr)
                    </h3>

                    {/* Lever 1: Capex Cut */}
                    <div className="control">
                      <label>1. Cut Capital Infrastructure Spending (Capex, Multiplier = 3.25x)</label>
                      <div className="readout">
                        <span>₹{c2CapexCut.toLocaleString()} Cr</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="5000"
                        value={c2CapexCut}
                        onChange={(e) => setC2CapexCut(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#BB3B2E] block mt-1">
                        Politically easy to cut, but severely crushes long-term GDP due to high multiplier (3.25x).
                      </span>
                    </div>

                    {/* Lever 2: Revenue / Subsidy Cut */}
                    <div className="control">
                      <label>2. Cut Revenue Expenditure / Subsidies (Food/Fuel, Multiplier = 0.85x)</label>
                      <div className="readout">
                        <span>₹{c2RevCut.toLocaleString()} Cr</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150000"
                        step="5000"
                        value={c2RevCut}
                        onChange={(e) => setC2RevCut(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#3D7A52] block mt-1">
                        Politically unpopular, but economically superior with lower output drag (0.85x).
                      </span>
                    </div>

                    {/* Lever 3: Tax Hikes */}
                    <div className="control">
                      <label>3. Raise Taxes (Direct &amp; Indirect Tax Rate Hikes, Multiplier = 1.15x)</label>
                      <div className="readout">
                        <span>₹{c2TaxHike.toLocaleString()} Cr</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120000"
                        step="5000"
                        value={c2TaxHike}
                        onChange={(e) => setC2TaxHike(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Reduces household disposable income $Y_d$ and private corporate investment.
                      </span>
                    </div>

                    {/* Lever 4: RBI Monetary Coordination */}
                    <div className="control">
                      <label>4. Monetary Policy Coordination (RBI Stance)</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <button
                          onClick={() => setC2RbiStance("accommodative")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c2RbiStance === "accommodative"
                              ? "bg-[#3D7A52] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Accommodative (-100 bps)
                        </button>
                        <button
                          onClick={() => setC2RbiStance("neutral")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c2RbiStance === "neutral"
                              ? "bg-[#2E5C8A] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Neutral (Hold Rates)
                        </button>
                        <button
                          onClick={() => setC2RbiStance("tight")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c2RbiStance === "tight"
                              ? "bg-[#BB3B2E] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Tight (+50 bps)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Outcome Dashboard */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#2E5C8A]">
                      📊 The Multiplier Feedback &amp; Realized Deficit
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Static Budget Cut Planned
                        </span>
                        <span className="text-xl font-black mono text-[#211E19]">
                          ₹{c2StaticCut.toLocaleString()} Cr
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Target Required: ₹2,11,368 Cr
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Induced GDP Contraction ($\Delta Y$)
                        </span>
                        <span className="text-xl font-black mono text-[#BB3B2E]">
                          -₹{c2GdpContraction.toLocaleString()} Cr
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Via Keynesian Multipliers
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Endogenous Tax Revenue Loss
                        </span>
                        <span className="text-xl font-black mono text-[#E2571C]">
                          -₹{c2TaxRevenueLoss.toLocaleString()} Cr
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Tax base shrinks ($t \times \Delta Y$)
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Realized Net Deficit Cut
                        </span>
                        <span className="text-xl font-black mono text-[#3D7A52]">
                          ₹{c2RealizedDeficitCut.toLocaleString()} Cr
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Actual Deficit: {c2FinalDeficitPct}% of GDP
                        </span>
                      </div>
                    </div>

                    {/* The Austerity Trap Formula Box */}
                    <div className="p-3.5 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-xs leading-relaxed space-y-2">
                      <div className="font-bold text-[#2E5C8A] uppercase tracking-wider text-[11px]">
                        ⚠️ The Mathematical Austerity Trap Theorem:
                      </div>
                      <p className="text-[#686254]">
                        When the government cuts fiscal spending $G$, national income falls by $\Delta Y = \alpha \Delta G$.
                        Because tax revenue depends on national income ($T = tY$), government tax collections automatically plunge
                        by $\Delta T = t \times \Delta Y$.
                      </p>
                      <div className="p-2 bg-white rounded border border-[#DCD5C4] font-mono text-[11px] text-[#211E19]">
                        Realized Deficit Cut = Planned Cut − Tax Drag = ₹{c2StaticCut.toLocaleString()} − ₹{c2TaxRevenueLoss.toLocaleString()} = ₹{c2RealizedDeficitCut.toLocaleString()} Cr
                      </div>
                      <p className="text-[11px] text-[#686254]">
                        This proves that a naive ₹1 spending cut reduces the deficit by significantly less than ₹1, while shrinking GDP growth to <strong>{c2GdpGrowthRate}%</strong>!
                      </p>
                    </div>

                    {/* Faculty Critique */}
                    <div className="p-3.5 bg-white rounded border border-[#DCD5C4] space-y-2">
                      <span className="text-xs font-bold uppercase text-[#2E5C8A] block">
                        🎓 MBA Policy Evaluation:
                      </span>
                      {c2CapexCut > 50000 ? (
                        <p className="text-xs text-[#BB3B2E] leading-relaxed">
                          <strong>High Capex Slash Trap:</strong> Slashing infrastructure capex destroyed India&apos;s productive supply capacity.
                          Because capex has a multiplier of 3.25x, GDP contracted severely, wiping out tax revenue and leaving the deficit at {c2FinalDeficitPct}%!
                        </p>
                      ) : c2RevCut >= 80000 && c2RbiStance === "accommodative" ? (
                        <p className="text-xs text-[#3D7A52] leading-relaxed">
                          <strong>Optimal Quality Consolidation:</strong> By trimming low-multiplier revenue subsidies, preserving infrastructure capex,
                          and coordinating with an accommodative RBI, you minimized output drag (growth {c2GdpGrowthRate}%) and safely brought the deficit down to {c2FinalDeficitPct}%!
                        </p>
                      ) : (
                        <p className="text-xs text-[#686254] leading-relaxed">
                          <strong>Moderate Consolidation:</strong> Deficit reached {c2FinalDeficitPct}% of GDP. Note how the endogenous tax drag ate into your planned budget savings.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACTIVE CASE 3: 2013 TAPER TANTRUM */}
            {/* ========================================================================= */}
            {selectedCase === "taper2013" && (
              <div className="dash-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="status-pill bad text-[10px]">Currency Defense War Room</span>
                      <span className="text-xs font-bold text-[#686254] uppercase tracking-wider">
                        Role: Incoming RBI Governor (Dr. Raghuram Rajan, September 2013)
                      </span>
                    </div>
                    <h2 className="display text-2xl font-bold text-[#211E19] mt-1">
                      Case 3: The 2013 Taper Tantrum &amp; Rupee Freefall (Fragile Five)
                    </h2>
                  </div>

                  <div className="mono text-xs p-2 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-[#686254]">
                    Source: RBI Monetary Policy &amp; Dornbusch Chap. 13 (External Sector)
                  </div>
                </div>

                {/* Intel Briefing */}
                <div className="p-3.5 bg-[#FAF8F2] rounded border-l-4 border-l-[#E2571C] border border-[#DCD5C4] text-xs text-[#686254] leading-relaxed">
                  <strong className="text-[#211E19] block mb-1">Macroeconomic Situation (Summer 2013):</strong>
                  US Fed Chairman Ben Bernanke signals the tapering of quantitative easing. Global bond yields surge, and $12 Billion of foreign capital
                  flees Indian financial markets. India is branded one of the &quot;Fragile Five&quot; due to a massive Current Account Deficit (CAD) of <strong>4.8% of GDP</strong>.
                  The Rupee freefalls from ₹54 to ₹68.85/USD within weeks. Forex reserves dwindle to barely 6 months of imports.
                </div>

                {/* Levers and Live Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6 space-y-4 bg-white p-4 rounded border border-[#DCD5C4]">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#E2571C]">
                      🎯 Rajan&apos;s Policy Counter-Measures
                    </h3>

                    {/* Lever 1: FCNR(B) Swap Window */}
                    <div className="p-3 rounded border border-[#DCD5C4] bg-[#FAF8F2] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-[#211E19]">
                          1. FCNR(B) NRI Dollar Concessional Swap Window
                        </label>
                        <input
                          type="checkbox"
                          checked={c3FcnrSwapWindow}
                          onChange={(e) => setC3FcnrSwapWindow(e.target.checked)}
                          className="w-4 h-4 text-[#E2571C]"
                        />
                      </div>
                      <p className="text-[11px] text-[#686254]">
                        Offer commercial banks a subsidized forward swap fee (3.5% vs market 7.0%) to attract 3-year US dollar deposits from Non-Resident Indians (NRIs).
                      </p>
                    </div>

                    {/* Lever 2: MSF Rate Hike */}
                    <div className="control">
                      <label>2. Marginal Standing Facility (MSF) Rate Squeeze</label>
                      <div className="readout">
                        <span>+{c3MsfHikeBps} bps (MSF: {(8.25 + c3MsfHikeBps / 100).toFixed(2)}%)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="300"
                        step="50"
                        value={c3MsfHikeBps}
                        onChange={(e) => setC3MsfHikeBps(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#9A927E] block mt-1">
                        Historical move: RBI spiked MSF by 200 bps to 10.25%, making it prohibitively expensive for banks to borrow rupees to short the currency.
                      </span>
                    </div>

                    {/* Lever 3: Capital Controls */}
                    <div className="control">
                      <label>3. Capital Controls &amp; Import Duties</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <button
                          onClick={() => setC3CapitalControls("targeted")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c3CapitalControls === "targeted"
                              ? "bg-[#E2571C] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Targeted Gold Tariffs (10%)
                        </button>
                        <button
                          onClick={() => setC3CapitalControls("strict")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c3CapitalControls === "strict"
                              ? "bg-[#BB3B2E] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          Strict Remittance Caps ($75k)
                        </button>
                        <button
                          onClick={() => setC3CapitalControls("none")}
                          className={`py-2 px-2 rounded text-[11px] font-semibold mono transition-all ${
                            c3CapitalControls === "none"
                              ? "bg-[#2E5C8A] text-white shadow-sm"
                              : "bg-[#FAF8F2] text-[#686254] border border-[#DCD5C4]"
                          }`}
                        >
                          No Controls / Free Market
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Outcomes */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#E2571C]">
                      📊 Balance of Payments &amp; Currency Trajectory
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          USD Capital Inflow Mobilized
                        </span>
                        <span className="text-2xl font-black mono text-[#3D7A52]">
                          +${c3UsdInflows} Billion
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Historical FCNR-B: +$34.3 Billion
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Rupee Spot Rate (USD/INR)
                        </span>
                        <span className="text-2xl font-black mono text-[#2E5C8A]">
                          ₹{c3RupeeTrajectory}
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          From peak panic of ₹68.85
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Current Account Deficit (CAD)
                        </span>
                        <span className="text-2xl font-black mono text-[#211E19]">
                          {c3CadPct}% of GDP
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Pre-crisis level: 4.8%
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Cost of Speculation (MSF)
                        </span>
                        <span className="text-2xl font-black mono text-[#BB3B2E]">
                          {(8.25 + c3MsfHikeBps / 100).toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Overnight penalty window
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded border border-[#DCD5C4] space-y-2">
                      <span className="text-xs font-bold uppercase text-[#E2571C] block">
                        🎓 Faculty Analysis — The Rajan Playbook:
                      </span>
                      {c3FcnrSwapWindow && c3MsfHikeBps >= 150 ? (
                        <p className="text-xs text-[#3D7A52] leading-relaxed">
                          <strong>Masterclass in External Crisis Management:</strong> By offering the subsidized FCNR(B) swap window, you pulled in ${c3UsdInflows} Billion
                          of stable dollar deposits without draining RBI reserves. By aggressively hiking MSF, you squeezed speculative currency short-sellers without
                          raising base Repo lending rates for regular manufacturing industries. The Rupee rebounded swiftly to ₹{c3RupeeTrajectory}/USD!
                        </p>
                      ) : (
                        <p className="text-xs text-[#BB3B2E] leading-relaxed">
                          <strong>Inadequate Dollar Cushion:</strong> Without mobilizing NRI dollar swaps or penalizing currency speculators, the Rupee remained
                          under acute depreciation pressure (₹{c3RupeeTrajectory}/USD), leading to imported fuel inflation and sovereign rating downgrade threats.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACTIVE CASE 4: 2022 UKRAINE WAR STAGFLATION */}
            {/* ========================================================================= */}
            {selectedCase === "stagflation2022" && (
              <div className="dash-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="status-pill bad text-[10px]">Supply Shock War Room</span>
                      <span className="text-xs font-bold text-[#686254] uppercase tracking-wider">
                        Role: RBI Monetary Policy Committee &amp; Union Cabinet
                      </span>
                    </div>
                    <h2 className="display text-2xl font-bold text-[#211E19] mt-1">
                      Case 4: The 2022 Russia-Ukraine War — Stagflation &amp; Oil Shock
                    </h2>
                  </div>

                  <div className="mono text-xs p-2 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-[#686254]">
                    Source: Session 13 &amp; 14: AS-AD Supply Shocks &amp; Phillips Curve
                  </div>
                </div>

                {/* Intel Briefing */}
                <div className="p-3.5 bg-[#FAF8F2] rounded border-l-4 border-l-[#3D7A52] border border-[#DCD5C4] text-xs text-[#686254] leading-relaxed">
                  <strong className="text-[#211E19] block mb-1">Macroeconomic Situation (Spring 2022):</strong>
                  Russia invades Ukraine. Brent crude leaps above $120/barrel. Global fertilizer and edible oil prices skyrocket.
                  Domestic CPI inflation leaps to <strong>7.8%</strong>, well beyond the RBI&apos;s statutory 6.0% upper tolerance band.
                  Meanwhile, the post-COVID GDP recovery is delicate, and the US Fed initiates its fastest rate-hiking cycle in 40 years.
                </div>

                {/* Levers and Live Outcomes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6 space-y-4 bg-white p-4 rounded border border-[#DCD5C4]">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#3D7A52]">
                      🎯 Coordinated Policy Levers
                    </h3>

                    {/* Lever 1: MPC Rate Hikes */}
                    <div className="control">
                      <label>1. MPC Policy Repo Rate Hikes (Cumulative)</label>
                      <div className="readout">
                        <span>+{c4MpcRepoHike} bps (Repo: {(4.0 + c4MpcRepoHike / 100).toFixed(2)}%)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="350"
                        step="25"
                        value={c4MpcRepoHike}
                        onChange={(e) => setC4MpcRepoHike(Number(e.target.value))}
                      />
                      <span className="text-[10px] text-[#9A927E] block mt-1">
                        Historical move: Off-cycle 40 bps emergency hike in May 2022, totaling +250 bps to 6.50%.
                      </span>
                    </div>

                    {/* Lever 2: Excise Duty Cuts */}
                    <div className="p-3 rounded border border-[#DCD5C4] bg-[#FAF8F2] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-[#211E19]">
                          2. Slash Central Excise on Petrol (₹8/L) &amp; Diesel (₹6/L)
                        </label>
                        <input
                          type="checkbox"
                          checked={c4ExciseCut}
                          onChange={(e) => setC4ExciseCut(e.target.checked)}
                          className="w-4 h-4 text-[#3D7A52]"
                        />
                      </div>
                      <p className="text-[11px] text-[#686254]">
                        Fiscal supply-side shock absorber: Directly cools transport and food logistics costs, costing ~₹1,00,000 Cr in government revenue.
                      </p>
                    </div>

                    {/* Lever 3: Food Export Restrictions */}
                    <div className="p-3 rounded border border-[#DCD5C4] bg-[#FAF8F2] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-[#211E19]">
                          3. Restrict Exports of Wheat, Broken Rice &amp; Sugar
                        </label>
                        <input
                          type="checkbox"
                          checked={c4FoodExportRestrictions}
                          onChange={(e) => setC4FoodExportRestrictions(e.target.checked)}
                          className="w-4 h-4 text-[#3D7A52]"
                        />
                      </div>
                      <p className="text-[11px] text-[#686254]">
                        Trade intervention: Insulates domestic food markets from global price surges, maintaining food security.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Outcomes */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="card-title text-sm border-b border-[#DCD5C4] pb-2 text-[#3D7A52]">
                      📊 Macroeconomic Results (Soft Landing vs Stagflation)
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Headline CPI Inflation
                        </span>
                        <span className={`text-2xl font-black mono ${c4InflationTrajectory > 6.0 ? "text-[#BB3B2E]" : "text-[#3D7A52]"}`}>
                          {c4InflationTrajectory}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          RBI Tolerance Ceiling: 6.0%
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Real GDP Growth Rate
                        </span>
                        <span className="text-2xl font-black mono text-[#2E5C8A]">
                          {c4GdpGrowth}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Resilient economic expansion
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Fiscal Cost to Union Budget
                        </span>
                        <span className="text-2xl font-black mono text-[#E2571C]">
                          ₹{(c4FiscalCostCr / 1000).toFixed(0)}k Cr
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Excise forgone + food subsidies
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                        <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                          Real Policy Repo Rate
                        </span>
                        <span className="text-2xl font-black mono text-[#211E19]">
                          {(4.0 + c4MpcRepoHike / 100 - c4InflationTrajectory).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-[#686254] block mt-1">
                          Nominal Repo − Inflation
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded border border-[#DCD5C4] space-y-2">
                      <span className="text-xs font-bold uppercase text-[#3D7A52] block">
                        🎓 Faculty Evaluation — The Indian Soft Landing:
                      </span>
                      {c4MpcRepoHike >= 200 && c4ExciseCut ? (
                        <p className="text-xs text-[#3D7A52] leading-relaxed">
                          <strong>Exemplary Supply-Side &amp; Monetary Coordination:</strong> Rather than relying solely on demand-crushing interest rate hikes,
                          the government used fiscal excise cuts to directly lower pump fuel prices, while the RBI front-loaded repo hikes to anchor long-term
                          inflation expectations. The result was an Indian &quot;soft landing&quot; with GDP growth preserved at {c4GdpGrowth}% and CPI cooled to {c4InflationTrajectory}%.
                        </p>
                      ) : (
                        <p className="text-xs text-[#BB3B2E] leading-relaxed">
                          <strong>Persistent Inflation Spike:</strong> Without aggressive rate anchoring or fiscal supply-side tax cuts, imported inflation
                          de-anchored household inflation expectations, resulting in CPI inflation remaining above target ({c4InflationTrajectory}%) and continuous capital flight.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: OPEN ECONOMY & CRISES */}
        {/* ========================================================================= */}
        {activeTab === "open-crisis" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot"></span>
                OPEN ECONOMY MACROECONOMICS &amp; CASE STUDIES — IIM INDORE CURRICULUM
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Monetary Transmission, Fiscal Deficits &amp; The 2008 Crisis
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                Applied macroeconomics investigates real-world transmission bottlenecks, the quality of government
                budget deficits under the FRBM Act, and the contagion mechanisms observed during global financial crises.
              </p>
            </div>

            {/* The Mundell-Fleming Trilemma */}
            <div className="dash-card space-y-3">
              <h3 className="card-title">The Impossible Trinity (The Policy Trilemma)</h3>
              <p className="text-xs text-[#686254] leading-relaxed">
                A country can choose at most TWO of the following three policy objectives simultaneously:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="font-bold text-[#2E5C8A] block mb-1">1. Fixed Exchange Rate</span>
                  <p className="text-[#686254]">
                    Stabilizes import/export currency risk and eliminates speculative volatility in foreign trade.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="font-bold text-[#2E5C8A] block mb-1">2. Free Capital Mobility</span>
                  <p className="text-[#686254]">
                    Allows unhindered international inflows of Foreign Direct Investment (FDI) and Portfolio capital (FPI).
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="font-bold text-[#2E5C8A] block mb-1">3. Independent Monetary Policy</span>
                  <p className="text-[#686254]">
                    Allows Central Bank to set domestic interest rates solely to manage domestic inflation and growth.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded border border-[#2E5C8A] text-xs font-semibold text-[#2E5C8A]">
                India&apos;s Policy Choice: Managed Floating Exchange Rate with capital account management, allowing RBI independent inflation targeting.
              </div>
            </div>

            {/* RBI Monetary Transmission Pipeline */}
            <div className="dash-card space-y-4">
              <h3 className="card-title">RBI Monetary Policy Transmission Flow Pipeline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="text-[10px] font-bold text-[#E2571C] uppercase block mb-1">Stage 1: Anchor</span>
                  <h4 className="font-bold text-sm text-[#211E19]">Policy Repo Rate</h4>
                  <p className="text-[11px] text-[#686254] mt-1">
                    RBI MPC alters repo rate by 25-50 bps during bi-monthly review.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="text-[10px] font-bold text-[#2E5C8A] uppercase block mb-1">Stage 2: Money Market</span>
                  <h4 className="font-bold text-sm text-[#211E19]">Call Money &amp; T-Bills</h4>
                  <p className="text-[11px] text-[#686254] mt-1">
                    Interbank overnight borrowing rates and short-term yields adjust immediately.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="text-[10px] font-bold text-[#2E5C8A] uppercase block mb-1">Stage 3: Banking</span>
                  <h4 className="font-bold text-sm text-[#211E19]">MCLR / EBLR Lending</h4>
                  <p className="text-[11px] text-[#686254] mt-1">
                    Banks reset corporate credit and home loan rates (subject to transmission lag).
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="text-[10px] font-bold text-[#3D7A52] uppercase block mb-1">Stage 4: Real Economy</span>
                  <h4 className="font-bold text-sm text-[#211E19]">Investment &amp; Consumption</h4>
                  <p className="text-[11px] text-[#686254] mt-1">
                    Lower rates lower cost of capital, boosting Capex and auto/home loans.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#FAF8F2] border border-[#DCD5C4]">
                  <span className="text-[10px] font-bold text-[#3D7A52] uppercase block mb-1">Stage 5: Target</span>
                  <h4 className="font-bold text-sm text-[#211E19]">Inflation (4% ± 2%)</h4>
                  <p className="text-[11px] text-[#686254] mt-1">
                    Aggregate Demand shifts; output gap closes; headline CPI moves towards target.
                  </p>
                </div>
              </div>
            </div>

            {/* Indian Macro Case Studies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dash-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                  <h3 className="card-title mb-0">Case Study 1: Meeting Budget Deficit Targets</h3>
                  <span className="status-pill neutral text-[10px]">FRBM Framework</span>
                </div>

                <div className="space-y-2 text-xs text-[#211E19] leading-relaxed">
                  <div className="p-2.5 bg-[#FAF8F2] rounded border border-[#DCD5C4] space-y-1">
                    <span className="font-bold text-[#2E5C8A]">The Deficit Triad</span>
                    <ul className="list-disc pl-4 text-[#686254] space-y-1">
                      <li>
                        <strong>Fiscal Deficit (FD):</strong> Total Borrowing = Total Spending − Non-debt Receipts.
                      </li>
                      <li>
                        <strong>Revenue Deficit (RD):</strong> Current Dissaving = Revenue Spending − Revenue Receipts.
                      </li>
                      <li>
                        <strong>Primary Deficit (PD):</strong> Fiscal Deficit − Interest Payments on past debt.
                      </li>
                    </ul>
                  </div>

                  <p className="text-[#686254]">
                    <strong>Quality of Expenditure:</strong> Borrowing to fund capital expenditure (highways, ports, energy) creates future productive assets with an empirical multiplier of ~2.5x to 3.5x. Borrowing to finance revenue consumption yields a multiplier &lt; 1.0x and leads to a debt trap.
                  </p>
                </div>
              </div>

              <div className="dash-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#DCD5C4] pb-2">
                  <h3 className="card-title mb-0">Case Study 2: The 2008 Subprime Contagion</h3>
                  <span className="status-pill bad text-[10px]">Crisis Transmission</span>
                </div>

                <div className="space-y-2 text-xs text-[#211E19] leading-relaxed">
                  <div className="p-2.5 bg-[#FAF8F2] rounded border border-[#DCD5C4] space-y-1">
                    <span className="font-bold text-[#BB3B2E]">Transmission Channels into India</span>
                    <ul className="list-disc pl-4 text-[#686254] space-y-1">
                      <li>
                        <strong>Financial Freeze:</strong> US credit freeze led FIIs to liquidate Indian equities to cover home liquidity deficits.
                      </li>
                      <li>
                        <strong>Currency Strain:</strong> Dollar outflows triggered sharp rupee depreciation from ~₹40 to ₹50/USD.
                      </li>
                      <li>
                        <strong>Domestic Credit Crunch:</strong> Indian corporates unable to raise external commercial borrowings (ECBs) rushed to domestic banks.
                      </li>
                    </ul>
                  </div>

                  <p className="text-[#686254]">
                    <strong>RBI Response Package:</strong> Drastic reduction of CRR from 9.0% to 5.0%, cutting Repo Rate from 9.0% to 4.75%, activating emergency liquidity windows, and funding fiscal stimulus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ADVANCED TOPICS (NEW DEDICATED EXTENSIVE WORKBENCH) */}
        {/* ========================================================================= */}
        {activeTab === "advanced" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="eyebrow">
                <span className="dot" style={{ background: "#2E5C8A" }}></span>
                ADVANCED QUANTITATIVE MACROECONOMICS &amp; POLICY SIMULATIONS
              </div>
              <h1 className="display text-3xl sm:text-4xl font-black tracking-tight text-[#211E19]">
                Advanced Macroeconomic Models &amp; Quantitative Policy Engines
              </h1>
              <p className="text-sm text-[#686254] max-w-3xl leading-relaxed">
                Explore graduate-level macroeconomic models: the Mundell-Fleming IS-LM-BP open economy framework under perfect capital mobility,
                the Taylor Rule policy reaction function, sovereign debt sustainability snowball dynamics ($r - g$), and the Solow-Swan neoclassical growth model.
              </p>
            </div>

            {/* 1. MUNDELL-FLEMING OPEN ECONOMY SIMULATOR */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    1. Mundell-Fleming IS-LM-BP Simulator (Perfect Capital Mobility)
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Session 16 &amp; 17: Policy effectiveness under Fixed vs Floating Exchange Rates ($i = i_f = {worldRateIf}\%$)
                  </span>
                </div>

                <div className="status-pill neutral">
                  <span>Equilibrium GDP: {mfOutput} Lakh Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Exchange Rate Regime</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setMfRegime("floating")}
                        className={`py-2 px-3 rounded text-xs font-semibold mono transition-all ${
                          mfRegime === "floating"
                            ? "bg-[#2E5C8A] text-white shadow-xs"
                            : "bg-white border border-[#DCD5C4] text-[#686254]"
                        }`}
                      >
                        Flexible (Floating) FX
                      </button>
                      <button
                        onClick={() => setMfRegime("fixed")}
                        className={`py-2 px-3 rounded text-xs font-semibold mono transition-all ${
                          mfRegime === "fixed"
                            ? "bg-[#E2571C] text-white shadow-xs"
                            : "bg-white border border-[#DCD5C4] text-[#686254]"
                        }`}
                      >
                        Fixed (Pegged) FX
                      </button>
                    </div>
                  </div>

                  <div className="control">
                    <label>Fiscal Policy Shift ($\Delta G$)</label>
                    <div className="readout">
                      <span>{mfFiscalG > 50 ? `+${mfFiscalG - 50}` : mfFiscalG - 50}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      step="5"
                      value={mfFiscalG}
                      onChange={(e) => setMfFiscalG(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Monetary Policy Shift ($\Delta M$)</label>
                    <div className="readout">
                      <span>{mfMonetaryM > 50 ? `+${mfMonetaryM - 50}` : mfMonetaryM - 50}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      step="5"
                      value={mfMonetaryM}
                      onChange={(e) => setMfMonetaryM(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-[#FAF8F2] pb-2">
                      <span className="font-bold text-[#2E5C8A]">
                        {mfRegime === "floating" ? "Floating Regime Results" : "Fixed Regime Results"}
                      </span>
                      <span className="mono font-semibold text-[#E2571C]">
                        {mfRegime === "floating"
                          ? "Monetary Policy Dominates"
                          : "Fiscal Policy Dominates"}
                      </span>
                    </div>

                    <div className="text-xs text-[#686254] leading-relaxed space-y-2">
                      {mfRegime === "floating" ? (
                        <>
                          <p>
                            • <strong>Fiscal Policy ($G$) has ZERO impact on output!</strong> When government spending rises,
                            it exerts upward pressure on interest rates ($i &gt; i_f$). Capital rushes in, causing the domestic
                            currency to appreciate. The appreciation destroys Net Exports ($NX \downarrow$), shifting IS completely back.
                          </p>
                          <p>
                            • <strong>Monetary Policy ($M$) is MAXIMALLY effective!</strong> Central bank expansion lowers domestic rates
                            below world rates ($i &lt; i_f$). Capital flees abroad, depreciating the currency ($e \downarrow$). The currency
                            depreciation makes domestic goods cheaper, boosting net exports ($NX \uparrow$) and expanding output to{" "}
                            <strong className="text-[#211E19]">{mfOutput} Cr</strong>.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            • <strong>Fiscal Policy ($G$) is MAXIMALLY effective!</strong> When $G \uparrow$, interest rates rise above
                            world rates. Foreign capital floods in. To defend the fixed exchange rate peg, the Central Bank MUST buy foreign
                            currency and sell domestic currency, expanding money supply ($LM \uparrow$) automatically without any crowding out!
                          </p>
                          <p>
                            • <strong>Monetary Policy ($M$) is COMPLETELY POWERLESS!</strong> Any attempt by the Central Bank to expand credit
                            lowers rates, triggering capital flight. To defend the peg, the Central Bank must immediately burn foreign exchange
                            reserves, contracting money supply right back to the starting point.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. THE TAYLOR RULE MONETARY POLICY BENCH */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    2. The Taylor Rule Monetary Policy Benchmark Engine
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Formula: $i^* = r^* + \pi_t + 0.5(\pi_t - \pi^*) + 0.5(y_t - y^*)$
                  </span>
                </div>

                <div
                  className={`status-pill ${
                    policyGap > 0 ? "bad" : policyGap < 0 ? "bad" : "ok"
                  }`}
                >
                  <span>
                    Stance: {policyGap > 0.5 ? "Overly Hawkish" : policyGap < -0.5 ? "Overly Dovish" : "Optimally Balanced"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3.5 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Current CPI Inflation ($\pi_t$)</label>
                    <div className="readout">
                      <span>{taylorCurrentInf}</span>%
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="9.0"
                      step="0.2"
                      value={taylorCurrentInf}
                      onChange={(e) => setTaylorCurrentInf(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Inflation Target ($\pi^*$)</label>
                    <div className="readout">
                      <span>{taylorTargetInf}</span>% (RBI Target)
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="6.0"
                      step="0.5"
                      value={taylorTargetInf}
                      onChange={(e) => setTaylorTargetInf(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Equilibrium Real Interest Rate ($r^*$)</label>
                    <div className="readout">
                      <span>{taylorEquilR}</span>%
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.25"
                      value={taylorEquilR}
                      onChange={(e) => setTaylorEquilR(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Output Gap Percentage ($y_t - y^*$)</label>
                    <div className="readout">
                      <span>{taylorOutputGap > 0 ? `+${taylorOutputGap}` : taylorOutputGap}</span>%
                    </div>
                    <input
                      type="range"
                      min="-4.0"
                      max="4.0"
                      step="0.2"
                      value={taylorOutputGap}
                      onChange={(e) => setTaylorOutputGap(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Actual Central Bank Repo Rate</label>
                    <div className="readout">
                      <span>{actualPolicyRepo}</span>%
                    </div>
                    <input
                      type="range"
                      min="3.5"
                      max="9.0"
                      step="0.25"
                      value={actualPolicyRepo}
                      onChange={(e) => setActualPolicyRepo(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Taylor Rule Prescribed Rate</span>
                    <div className="text-3xl font-black mono text-[#2E5C8A]">
                      {recommendedTaylorRate}%
                    </div>
                    <p className="text-xs text-[#686254] pt-1">
                      The scientifically warranted policy rate that balances price stability against output stabilization.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded border border-[#DCD5C4] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#9A927E]">Policy Rate Gap</span>
                    <div
                      className={`text-3xl font-black mono ${
                        policyGap > 0 ? "text-[#BB3B2E]" : policyGap < 0 ? "text-[#3D7A52]" : "text-[#211E19]"
                      }`}
                    >
                      {policyGap > 0 ? `+${policyGap}` : policyGap}%
                    </div>
                    <p className="text-xs text-[#686254] pt-1">
                      {policyGap > 0
                        ? "Actual rate is above Taylor Rule: Monetary stance is restrictive/cooling."
                        : "Actual rate is below Taylor Rule: Monetary stance is accommodative/stimulative."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SOVEREIGN DEBT SUSTAINABILITY & SNOWBALL DYNAMICS */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    3. Sovereign Debt Sustainability &amp; Snowball Equation ($(r - g)$ Dynamics)
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Formula: $\Delta d = (r - g) \cdot d + pb$ (Session 18 Note)
                  </span>
                </div>

                <div
                  className={`status-pill ${
                    deltaDebtRatio > 0 ? "bad" : "ok"
                  }`}
                >
                  <span>
                    Trajectory: {deltaDebtRatio > 0 ? `Expanding (+${deltaDebtRatio}%/yr)` : `Consolidating (${deltaDebtRatio}%/yr)`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3.5 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Current Debt-to-GDP Ratio ($d$)</label>
                    <div className="readout">
                      <span>{debtRatioD}</span>% of GDP
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="120"
                      step="2"
                      value={debtRatioD}
                      onChange={(e) => setDebtRatioD(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Real Sovereign Interest Rate ($r$)</label>
                    <div className="readout">
                      <span>{realInterestR}</span>%
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="8.0"
                      step="0.5"
                      value={realInterestR}
                      onChange={(e) => setRealInterestR(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Real GDP Growth Rate ($g$)</label>
                    <div className="readout">
                      <span>{realGrowthG}</span>%
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="9.0"
                      step="0.5"
                      value={realGrowthG}
                      onChange={(e) => setRealGrowthG(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Primary Deficit as % of GDP ($pb$)</label>
                    <div className="readout">
                      <span>{primaryDeficitPb}</span>% (Borrowing ex-interest)
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="5.0"
                      step="0.25"
                      value={primaryDeficitPb}
                      onChange={(e) => setPrimaryDeficitPb(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Growth-Interest Spread ($(r - g)$)
                    </span>
                    <span
                      className={`text-xl font-bold mono ${
                        rgSpread <= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                      }`}
                    >
                      {rgSpread > 0 ? `+${rgSpread}` : rgSpread}%
                    </span>
                    <span className="text-[10px] text-[#686254] block mt-1">
                      {rgSpread <= 0 ? "Favorable growth tailwind" : "Dangerous interest penalty"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Annual Debt Change ($\Delta d$)
                    </span>
                    <span
                      className={`text-xl font-bold mono ${
                        deltaDebtRatio <= 0 ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                      }`}
                    >
                      {deltaDebtRatio > 0 ? `+${deltaDebtRatio}` : deltaDebtRatio}%
                    </span>
                    <span className="text-[10px] text-[#686254] block mt-1">
                      Per annum change in debt ratio
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4] col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      5-Year Debt Projection
                    </span>
                    <span
                      className={`text-xl font-bold mono ${
                        debt5YearProjection <= debtRatioD ? "text-[#3D7A52]" : "text-[#BB3B2E]"
                      }`}
                    >
                      {debt5YearProjection}%
                    </span>
                    <span className="text-[10px] text-[#686254] block mt-1">
                      Target: &le; 60% (FRBM Act)
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-3 p-3 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-xs leading-relaxed text-[#686254]">
                    <strong>Fiscal Wisdom (Session 18):</strong> When India grows faster than its borrowing cost ($g &gt; r$),
                    the debt-to-GDP ratio naturally contracts without spending cuts! However, if growth falls below interest rates
                    ($r &gt; g$), the economy enters a compounding <em>debt snowball</em> where past debt compounds faster than GDP,
                    forcing severe primary surpluses to avoid sovereign default.
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SOLOW-SWAN NEOCLASSICAL LONG-RUN GROWTH WORKBENCH */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    4. Solow-Swan Long-Run Growth Model &amp; The Golden Rule
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Steady State Condition: $s \cdot k^\alpha = (n + \delta)k$
                  </span>
                </div>

                <div className="status-pill ok">
                  <span>Steady-State Output ($y^*$): {steadyStateY}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3.5 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>National Savings / Investment Rate ($s$)</label>
                    <div className="readout">
                      <span>{Math.round(solowSavingsRate * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="0.45"
                      step="0.01"
                      value={solowSavingsRate}
                      onChange={(e) => setSolowSavingsRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Capital Share in Production ($\alpha$)</label>
                    <div className="readout">
                      <span>{solowCapitalShare}</span>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="0.50"
                      step="0.05"
                      value={solowCapitalShare}
                      onChange={(e) => setSolowCapitalShare(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Depreciation Rate ($\delta$)</label>
                    <div className="readout">
                      <span>{Math.round(solowDeprecRate * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.03"
                      max="0.10"
                      step="0.01"
                      value={solowDeprecRate}
                      onChange={(e) => setSolowDeprecRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Population Growth Rate ($n$)</label>
                    <div className="readout">
                      <span>{Math.round(solowPopGrowth * 1000) / 10}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.005"
                      max="0.03"
                      step="0.005"
                      value={solowPopGrowth}
                      onChange={(e) => setSolowPopGrowth(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Capital per Worker ($k^*$)
                    </span>
                    <span className="text-xl font-bold mono text-[#2E5C8A]">
                      {steadyStateK}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Output per Worker ($y^*$)
                    </span>
                    <span className="text-xl font-bold mono text-[#E2571C]">
                      {steadyStateY}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Consumption ($c^*$)
                    </span>
                    <span className="text-xl font-bold mono text-[#3D7A52]">
                      {steadyStateC}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                      Golden Rule (s_gold)
                    </span>
                    <span className="text-xl font-bold mono text-[#211E19]">
                      {goldenRuleSavings}%
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-4 p-3 bg-[#FAF8F2] rounded border border-[#DCD5C4] text-xs leading-relaxed text-[#686254]">
                    <strong>Golden Rule Insight:</strong> Higher savings expands capital and output, but beyond the
                    Golden Rule savings rate (s &gt; α = {goldenRuleSavings}%), capital accumulation requires so much
                    investment to replace depreciation that steady-state consumption per worker actually falls!
                  </div>
                </div>
              </div>
            </div>

            {/* 5. DORNBUSCH EXCHANGE RATE OVERSHOOTING MODEL */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    5. Dornbusch Exchange Rate Overshooting Model
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Dornbusch (1976) &amp; Chapter 13/20: Sticky goods prices vs instantaneous financial asset market clearing
                  </span>
                </div>

                <div className="status-pill bad">
                  <span>Spot Jump: +{overshootJump}% (Overshoot: +{overshootDegree}%)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Money Supply Shock ($\Delta M$)</label>
                    <div className="readout">
                      <span>+{overshootMoneyShock}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={overshootMoneyShock}
                      onChange={(e) => setOvershootMoneyShock(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Price Level Adjustment Speed ($\theta$)</label>
                    <div className="readout">
                      <span>
                        {overshootPriceSpeed} ({overshootPriceSpeed < 0.3 ? "Sticky Prices" : "Flexible Prices"})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.05"
                      value={overshootPriceSpeed}
                      onChange={(e) => setOvershootPriceSpeed(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Money Demand Interest Semi-Elasticity ($\eta$)</label>
                    <div className="readout">
                      <span>{overshootInterestSens}</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="1.5"
                      step="0.1"
                      value={overshootInterestSens}
                      onChange={(e) => setOvershootInterestSens(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Long-Run Equilibrium (&Delta;e_LR)
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        +{longRunFxDeprec}%
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Proportional to $\Delta M$
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Instantaneous Spot Jump
                      </span>
                      <span className="text-xl font-bold mono text-[#BB3B2E]">
                        +{overshootJump}%
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Immediate currency depreciation
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Overshooting Degree
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        +{overshootDegree}%
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Excess volatility spread
                      </span>
                    </div>
                  </div>

                  {/* SVG Overshooting Time Path Diagram */}
                  <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                    <span className="text-xs font-bold text-[#211E19] block mb-2">
                      Time Path of Exchange Rate ($e_t$) Following Monetary Expansion
                    </span>
                    <svg viewBox="0 0 500 140" className="w-full h-32 bg-[#FAF8F2] rounded border border-[#DCD5C4]">
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#9A927E" strokeWidth="1" />
                      <line x1="40" y1="10" x2="40" y2="120" stroke="#9A927E" strokeWidth="1" />
                      <text x="45" y="20" fill="#9A927E" fontSize="10" fontFamily="monospace">Exchange Rate (USD/INR)</text>
                      <text x="440" y="115" fill="#9A927E" fontSize="10" fontFamily="monospace">Time</text>

                      {/* Initial Level */}
                      <line x1="40" y1="90" x2="140" y2="90" stroke="#686254" strokeWidth="2" />
                      <text x="60" y="85" fill="#686254" fontSize="9">e₀ (Initial)</text>

                      {/* Vertical Jump (Overshoot) */}
                      <line x1="140" y1="90" x2="140" y2="25" stroke="#BB3B2E" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="140" cy="25" r="4" fill="#BB3B2E" />
                      <text x="145" y="25" fill="#BB3B2E" fontSize="9" fontWeight="bold">Instantaneous Jump (+{overshootJump}%)</text>

                      {/* Smooth asymptotic path to long run */}
                      <path d="M 140 25 Q 240 45 460 55" fill="none" stroke="#2E5C8A" strokeWidth="2.5" />
                      <line x1="140" y1="55" x2="480" y2="55" stroke="#2E5C8A" strokeWidth="1" strokeDasharray="4 4" />
                      <text x="350" y="50" fill="#2E5C8A" fontSize="9" fontWeight="bold">e_LR (+{longRunFxDeprec}%)</text>

                      <text x="120" y="132" fill="#9A927E" fontSize="9">Shock</text>
                      <text x="260" y="132" fill="#9A927E" fontSize="9">Goods Prices P Adjust &rarr;</text>
                    </svg>
                  </div>

                  <p className="text-xs text-[#686254] leading-relaxed">
                    <strong>Economic Mechanism:</strong> Because goods prices are sticky, a monetary injection drives domestic interest rates below world levels.
                    Under Uncovered Interest Parity ($i - i^* = E[\Delta e]$), the currency must be expected to <em>appreciate</em> in the future.
                    For it to appreciate back to its higher long-run level, it must first jump <strong>above</strong> its long-run equilibrium!
                  </p>
                </div>
              </div>
            </div>

            {/* 6. LUCAS CRITIQUE & TIME-INCONSISTENCY */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    6. The Lucas Critique &amp; Central Bank Time-Inconsistency
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Barro-Gordon (1983) &amp; Kydland-Prescott (1977): Discretion vs Rule-Based Monetary Commitment
                  </span>
                </div>

                <div className="status-pill neutral">
                  <span>Equilibrium Inflation: {equilibriumInflation}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Central Bank Governance Regime</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setCbCredibilityRule("discretion")}
                        className={`py-2 px-3 rounded text-xs font-semibold mono transition-all ${
                          cbCredibilityRule === "discretion"
                            ? "bg-[#BB3B2E] text-white shadow-sm"
                            : "bg-white text-[#686254] border border-[#DCD5C4]"
                        }`}
                      >
                        Pure Discretion
                      </button>
                      <button
                        onClick={() => setCbCredibilityRule("rule")}
                        className={`py-2 px-3 rounded text-xs font-semibold mono transition-all ${
                          cbCredibilityRule === "rule"
                            ? "bg-[#3D7A52] text-white shadow-sm"
                            : "bg-white text-[#686254] border border-[#DCD5C4]"
                        }`}
                      >
                        Credible Rule (Target)
                      </button>
                    </div>
                  </div>

                  <div className="control">
                    <label>Weight on Output vs Inflation ($\lambda$)</label>
                    <div className="readout">
                      <span>{cbInflationAversion}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.25"
                      value={cbInflationAversion}
                      onChange={(e) => setCbInflationAversion(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Political Growth Ambition ($k \cdot y^*$)</label>
                    <div className="readout">
                      <span>{Math.round((growthAmbitionK - 1) * 100)}% above natural capacity</span>
                    </div>
                    <input
                      type="range"
                      min="1.05"
                      max="1.40"
                      step="0.05"
                      value={growthAmbitionK}
                      onChange={(e) => setGrowthAmbitionK(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Equilibrium Inflation
                      </span>
                      <span className={`text-xl font-bold mono ${equilibriumInflation > 0 ? "text-[#BB3B2E]" : "text-[#3D7A52]"}`}>
                        {equilibriumInflation}%
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        {cbCredibilityRule === "discretion" ? "Inflation Bias" : "Zero Inflation Bias"}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Output Gained Above Natural
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        0.0% (y = y*)
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Rational agents anticipate policy
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Social Welfare Loss
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        {policyLoss}
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Deadweight inflation cost
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF8F2] rounded border border-[#DCD5C4] leading-relaxed text-[#686254] space-y-2">
                    <strong className="text-[#211E19] block">The Time-Inconsistency Trap:</strong>
                    If the central bank has discretion, it always has an incentive to generate surprise inflation to push output above its natural level.
                    However, rational workers understand this incentive and demand higher nominal wages in advance ($\pi^e = {discretionInflation}\%$).
                    As a result, output remains exactly at potential $y^*$, but society suffers from permanent high inflation!
                    This is the mathematical justification for <strong>Central Bank Independence</strong> and the <strong>RBI 4% Inflation Targeting Mandate (Urjit Patel Committee)</strong>.
                  </div>
                </div>
              </div>
            </div>

            {/* 7. RICARDIAN EQUIVALENCE PROPOSITION */}
            <div className="dash-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD5C4] pb-3">
                <div>
                  <h2 className="display text-xl font-bold text-[#211E19]">
                    7. Ricardian Equivalence Proposition &amp; Deficit Financing Sandbox
                  </h2>
                  <span className="text-xs text-[#686254]">
                    Robert Barro (1974) &amp; Chapter 20: Do debt-financed tax cuts stimulate consumption?
                  </span>
                </div>

                <div className="status-pill neutral">
                  <span>Effective Stimulus: ₹{effectiveStimulus.toLocaleString()} Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 bg-[#FAF8F2] p-4 rounded border border-[#DCD5C4]">
                  <div className="control">
                    <label>Debt-Financed Tax Cut ($\Delta T$)</label>
                    <div className="readout">
                      <span>₹{taxCutDeltaT.toLocaleString()} Cr</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="100000"
                      step="5000"
                      value={taxCutDeltaT}
                      onChange={(e) => setTaxCutDeltaT(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Liquidity-Constrained Households ($\lambda$)</label>
                    <div className="readout">
                      <span>{creditConstrainedPct}% (Cannot borrow against future)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={creditConstrainedPct}
                      onChange={(e) => setCreditConstrainedPct(Number(e.target.value))}
                    />
                  </div>

                  <div className="control">
                    <label>Consumer Myopia / Short-Horizon (% ignoring future tax)</label>
                    <div className="readout">
                      <span>{consumerMyopiaPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={consumerMyopiaPct}
                      onChange={(e) => setConsumerMyopiaPct(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Net Consumption Stimulus ($\Delta C$)
                      </span>
                      <span className="text-xl font-bold mono text-[#3D7A52]">
                        ₹{effectiveStimulus.toLocaleString()} Cr
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Effective demand boost
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Ricardian Savings Offset
                      </span>
                      <span className="text-xl font-bold mono text-[#2E5C8A]">
                        ₹{ricardianSavingsOffset.toLocaleString()} Cr
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Saved to pay future taxes
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded border border-[#DCD5C4]">
                      <span className="text-[10px] uppercase font-bold text-[#9A927E] block">
                        Effective Keynesian Multiplier
                      </span>
                      <span className="text-xl font-bold mono text-[#E2571C]">
                        {(effectiveStimulus / taxCutDeltaT).toFixed(2)}x
                      </span>
                      <span className="text-[10px] text-[#686254] block mt-1">
                        Pure Ricardian = 0.00x
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF8F2] rounded border border-[#DCD5C4] leading-relaxed text-[#686254] space-y-2">
                    <strong className="text-[#211E19] block">The Modigliani-Miller for Sovereign Budgets:</strong>
                    Under pure Ricardian Equivalence, debt financing does NOT stimulate demand because forward-looking agents know government debt is merely delayed taxation.
                    However, in emerging economies like India with high credit rationing ({creditConstrainedPct}% liquidity-constrained households) and informal sector employment,
                    tax cuts and cash transfers provide a powerful Keynesian multiplier effect because households consume the cash immediately!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCD5C4] bg-[#FFFFFF] py-6 mt-12 text-xs text-[#686254]">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2571C]"></span>
            <span className="font-semibold text-[#211E19]">Study Guide</span>
            <span>• Based on IIM Indore Term-II Core Macroeconomics Curriculum</span>
          </div>

          <div className="mono text-[11px] text-[#9A927E]">
            References: Dornbusch, Fischer &amp; Startz (2018) • RBI Monetary Policy Framework • Taylor Rule &amp; Mundell-Fleming
          </div>
        </div>
      </footer>
    </div>
  );
}
