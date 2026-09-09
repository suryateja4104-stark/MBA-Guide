export type FinanceTabKey =
  | "recon"
  | "forecasting"
  | "working-capital"
  | "tvm"
  | "bonds"
  | "risk-return"
  | "dcf-wacc"
  | "behavioral-emh";

export interface TabDefinition {
  id: FinanceTabKey;
  label: string;
  badge?: string;
  sessions: string;
  summary: string;
}

export const FINANCE_TABS: TabDefinition[] = [
  {
    id: "recon",
    label: "Accounting & Intrinsic Value",
    sessions: "Sessions 1 & 2",
    summary: "GAAP vs Cash Flows, NOPAT, NOWC, Free Cash Flow (FCF), ROIC & EVA",
  },
  {
    id: "forecasting",
    label: "Forecasting & AFN Engine",
    sessions: "Session 3",
    summary: "Pro Forma Modeling, Additional Funds Needed (AFN) & Capacity Constraints",
  },
  {
    id: "working-capital",
    label: "Working Capital & Cash Cycles",
    sessions: "Sessions 4 & 5",
    summary: "Operating Cycle, Cash Conversion Cycle (CCC), DSO, DIO, DPO & Policies",
  },
  {
    id: "tvm",
    label: "Time Value of Money & Cash Flows",
    sessions: "Sessions 6 & 7",
    summary: "Compounding, Discounting, Annuities Due vs Ordinary, Perpetuities & Amortization",
  },
  {
    id: "bonds",
    label: "Debt Valuation & Bond Mechanics",
    sessions: "Session 8",
    summary: "Bond Pricing, YTM, Price Risk vs Reinvestment Risk, Duration & After-Tax Cost of Debt",
  },
  {
    id: "risk-return",
    label: "Risk, Return & CAPM",
    sessions: "Sessions 12 & 13",
    summary: "Stand-alone vs Portfolio Risk, Diversification Frontier, Beta & Security Market Line (SML)",
  },
  {
    id: "dcf-wacc",
    label: "DCF & Enterprise Valuation",
    sessions: "Sessions 9, 10 & 11",
    summary: "Money vs Capital Markets, WACC, Multi-Stage FCFF Valuation & Sensitivity Matrix",
  },
  {
    id: "behavioral-emh",
    label: "Market Efficiency & Behavioral Finance",
    badge: "🏛️ Executive Governance",
    sessions: "Sessions 14 & 15",
    summary: "Weak/Semi-Strong/Strong EMH, Behavioral Biases, Heuristics & Agency Conflicts",
  },
];
