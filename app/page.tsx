"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  Search,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu,
  BarChart3,
  Compass,
  PieChart,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  HelpCircle,
} from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface DomainItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  status: "live" | "curated" | "upcoming";
  themeColor: string;
  accentBg: string;
  borderColor: string;
  tagColor: string;
  icon: React.ReactNode;
  repoUrl?: string;
  liveUrl?: string;
  internalUrl?: string;
  secondaryInternalUrl?: string;
  secondaryLabel?: string;
  description: string;
  stats: { label: string; value: string }[];
  frameworks: string[];
  sampleFormulas: { label: string; formula: string }[];
  references: string[];
  learningOutcomes: string[];
}

const DOMAINS: DomainItem[] = [
  {
    id: "ops",
    title: "Operations & Supply Chain",
    subtitle: "Process Flow, Queueing, Inventory & SCM",
    badge: "Live Interactive Session",
    status: "live",
    themeColor: "#2E5C8A",
    accentBg: "rgba(46, 92, 138, 0.08)",
    borderColor: "rgba(46, 92, 138, 0.35)",
    tagColor: "#2E5C8A",
    icon: <Cpu className="w-5 h-5 text-[#2E5C8A]" />,
    repoUrl: "https://github.com/suryateja4104-stark/Operations-Domain-Session",
    liveUrl: "https://suryateja4104-stark.github.io/Operations-Domain-Session/",
    description:
      "A dedicated, scenario-based simulation platform exploring process analysis, bottleneck identification, stochastic inventory models, queueing dynamics, and the bullwhip effect.",
    stats: [
      { label: "Deployment", value: "Live GitHub Pages" },
      { label: "Architecture", value: "Stand-alone Session Workbench" },
      { label: "Core Focus", value: "Quantitative Operations" },
    ],
    frameworks: [
      "Little's Law & Process Flow (I = R × T)",
      "Economic Order Quantity (EOQ) & Safety Stock",
      "Newsvendor Critical Fractile Model",
      "Bullwhip Effect & Supply Chain Feedback Loops",
      "Queueing Models (M/M/1, M/M/c) & Waiting Times",
      "Lean Operations, Kanban & Six Sigma (DMAIC)",
    ],
    sampleFormulas: [
      { label: "Little's Law", formula: "I = R \\times T \\quad \\text{(Inventory = Throughput } \\times \\text{ Flow Time)}" },
      { label: "Optimal Order Quantity (EOQ)", formula: "Q^* = \\sqrt{\\frac{2DS}{H}}" },
      { label: "Newsvendor Critical Fractile", formula: "F(Q^*) = \\frac{C_u}{C_u + C_o} = \\frac{P - C}{(P - C) + (C - V)}" },
      { label: "M/M/1 Average Wait in Queue", formula: "W_q = \\frac{\\lambda}{\\mu(\\mu - \\lambda)}" },
    ],
    references: [
      "Cachon & Terwiesch — Matching Supply with Demand (McGraw-Hill)",
      "Chopra & Meindl — Supply Chain Management: Strategy, Planning, & Operation (Pearson)",
      "Goldratt — The Goal: A Process of Ongoing Improvement",
    ],
    learningOutcomes: [
      "Calculate throughput rate, cycle time, and theoretical bottleneck capacity in multistage processes.",
      "Balance trade-offs between inventory holding costs and ordering/setup costs using EOQ and safety stock.",
      "Minimize single-period mismatch costs (underage vs. overage) in perishable and seasonal demand environments.",
      "Mitigate upstream variance amplification (bullwhip effect) via demand transparency and lead-time compression.",
    ],
  },
  {
    id: "economics",
    title: "Macroeconomics & Policy",
    subtitle: "Aggregate Markets, IS-LM, AS-AD & Policy Crises",
    badge: "Live Masterclass & Arcade",
    status: "live",
    themeColor: "#3D7A52",
    accentBg: "rgba(61, 122, 82, 0.08)",
    borderColor: "rgba(61, 122, 82, 0.35)",
    tagColor: "#3D7A52",
    icon: <TrendingUp className="w-5 h-5 text-[#3D7A52]" />,
    internalUrl: "/economics/",
    secondaryInternalUrl: "/macro/l1-0-foundations/",
    secondaryLabel: "🎮 Foundations Arcade Level",
    description:
      "Comprehensive interactive study guide, dynamic IS-LM & AS-AD policy simulators, and historical crisis playbooks (1991 BoP, 2008 Subprime, 2013 Taper Tantrum).",
    stats: [
      { label: "Modules", value: "8 In-Depth Tabs" },
      { label: "Simulators", value: "6 Live Dynamic Engines" },
      { label: "Curriculum", value: "IIM / Dornbusch & Fischer" },
    ],
    frameworks: [
      "Circular Flow & Four Core Macro Markets",
      "Goods Market Equilibrium & Autonomous Multipliers",
      "Money Market Equilibrium & Liquidity Preference",
      "IS-LM Policy Workbench & Crowding-Out Penalties",
      "AS-AD Equilibrium & Expectations-Augmented Phillips Curve",
      "Dornbusch Exchange Rate Overshooting & Mundell-Fleming",
      "Reserve Bank of India Monetary Policy Cases & FRBM",
    ],
    sampleFormulas: [
      { label: "Autonomous Expenditure Multiplier", formula: "\\alpha = \\frac{1}{1 - c(1 - t) + m}" },
      { label: "IS-LM Effective Multiplier", formula: "\\gamma = \\frac{\\alpha}{1 + \\frac{\\alpha \\cdot b \\cdot k}{h}}" },
      { label: "Expectations-Augmented Phillips Curve", formula: "\\pi = \\pi^e - \\beta(u - u^*) + \\nu" },
      { label: "Taylor Monetary Policy Rule", formula: "i_t = r^* + \\pi_t + 0.5(\\pi_t - \\pi^*) + 0.5(y_t - \\bar{y}_t)" },
    ],
    references: [
      "Dornbusch, Fischer & Startz — Macroeconomics (12th/13th Ed.)",
      "Blanchard — Macroeconomics (Pearson)",
      "RBI Monetary Policy Framework Documents & FRBM Act Guidelines",
    ],
    learningOutcomes: [
      "Derive IS and LM curves mathematically and compute fiscal and monetary equilibrium adjustments.",
      "Analyze policy trade-offs between inflation targeting and output gap closure under supply shocks.",
      "Simulate sovereign balance-of-payments defense, capital mobility trilemmas, and FX reserve interventions.",
    ],
  },
  {
    id: "finance",
    title: "Corporate Finance & Valuation",
    subtitle: "TVM, Capital Budgeting, WACC & DCF Modeling",
    badge: "Under Curation",
    status: "curated",
    themeColor: "#8C6A2E",
    accentBg: "rgba(140, 106, 46, 0.08)",
    borderColor: "rgba(140, 106, 46, 0.35)",
    tagColor: "#8C6A2E",
    icon: <BarChart3 className="w-5 h-5 text-[#8C6A2E]" />,
    description:
      "Core corporate finance principles, capital investment decision rules, enterprise valuation via DCF, cost of capital calculation, and capital structure optimization.",
    stats: [
      { label: "Status", value: "Curated Syllabus" },
      { label: "Interactive Tools", value: "Upcoming DCF & WACC" },
      { label: "Focus", value: "Valuation & Capital Budgeting" },
    ],
    frameworks: [
      "Time Value of Money (TVM), Annuities & Amortization",
      "Capital Budgeting Decision Rules (NPV, IRR, MIRR, Payback)",
      "Discounted Cash Flow (DCF) & FCFF/FCFE Valuation",
      "Weighted Average Cost of Capital (WACC) & CAPM",
      "Modigliani-Miller Propositions & Optimal Capital Structure",
      "Working Capital Management & Cash Conversion Cycle",
    ],
    sampleFormulas: [
      { label: "Net Present Value (NPV)", formula: "\\text{NPV} = \\sum_{t=1}^{T} \\frac{\\text{CF}_t}{(1 + r)^t} - \\text{CF}_0" },
      { label: "CAPM Expected Return", formula: "E(R_i) = R_f + \\beta_i [E(R_m) - R_f]" },
      { label: "Weighted Average Cost of Capital", formula: "\\text{WACC} = \\frac{E}{V} r_e + \\frac{D}{V} r_d(1 - t_c)" },
      { label: "Enterprise Value (Gordon Growth)", formula: "\\text{EV} = \\frac{\\text{FCFF}_1}{\\text{WACC} - g}" },
    ],
    references: [
      "Brealey, Myers, Allen & Mohanty — Principles of Corporate Finance",
      "Damodaran — Investment Valuation: Tools and Techniques for Determining the Value of Any Asset",
      "Berk & DeMarzo — Corporate Finance (Pearson)",
    ],
    learningOutcomes: [
      "Construct robust multi-year free cash flow models and assess sensitivity to terminal growth and discount rates.",
      "Compute cost of equity using CAPM beta unlevering/relevering techniques.",
      "Evaluate financial leverage benefits against distress costs under trade-off and pecking order theories.",
    ],
  },
  {
    id: "marketing",
    title: "Marketing Management & Growth",
    subtitle: "STP, 4Ps/7Ps, Unit Economics & Customer LTV",
    badge: "Under Curation",
    status: "curated",
    themeColor: "#BB3B2E",
    accentBg: "rgba(187, 59, 46, 0.08)",
    borderColor: "rgba(187, 59, 46, 0.35)",
    tagColor: "#BB3B2E",
    icon: <PieChart className="w-5 h-5 text-[#BB3B2E]" />,
    description:
      "Strategic marketing management, customer segmentation, targeting and positioning (STP), value proposition design, price elasticity, and customer lifetime value analytics.",
    stats: [
      { label: "Status", value: "Curated Syllabus" },
      { label: "Interactive Tools", value: "Upcoming CLV & Pricing Engine" },
      { label: "Focus", value: "Strategic STP & Growth" },
    ],
    frameworks: [
      "Segmentation, Targeting & Positioning (STP)",
      "Traditional 4Ps & Service Extended 7Ps Mix",
      "Customer Lifetime Value (CLV) & CAC Payback",
      "Price Elasticity, Value-Based Pricing & Skimming",
      "Brand Equity & Keller's Customer-Based Brand Equity (CBBE)",
      "Digital Marketing Funnels (AARRR Pirate Metrics)",
    ],
    sampleFormulas: [
      { label: "Customer Lifetime Value (CLV)", formula: "\\text{CLV} = \\frac{\\text{Margin} \\times \\text{Retention Rate}}{1 + \\text{Discount Rate} - \\text{Retention Rate}} - \\text{CAC}" },
      { label: "Price Elasticity of Demand", formula: "\\epsilon_d = \\frac{\\% \\Delta Q}{\\% \\Delta P} = \\frac{dQ}{dP} \\times \\frac{P}{Q}" },
      { label: "Optimal Markup Rule", formula: "P = \\text{MC} \\times \\left( \\frac{\\epsilon_d}{\\epsilon_d + 1} \\right)" },
    ],
    references: [
      "Kotler, Keller & Chernev — Marketing Management (16th Ed.)",
      "Farris et al. — Marketing Metrics: The Manager's Guide to Measuring Marketing Performance",
      "Aaker — Managing Brand Equity",
    ],
    learningOutcomes: [
      "Synthesize demographic, psychographic, and behavioral customer data to design defensible market segments.",
      "Calibrate optimal pricing points based on demand elasticity and customer willingness-to-pay.",
      "Compute payback periods on marketing spend and forecast retention-driven enterprise revenue.",
    ],
  },
  {
    id: "strategy",
    title: "Strategic Management & Policy",
    subtitle: "Industry Structure, VRIO, Blue Ocean & Corporate M&A",
    badge: "Under Curation",
    status: "curated",
    themeColor: "#273C75",
    accentBg: "rgba(39, 60, 117, 0.08)",
    borderColor: "rgba(39, 60, 117, 0.35)",
    tagColor: "#273C75",
    icon: <Compass className="w-5 h-5 text-[#273C75]" />,
    description:
      "Competitive strategy formulation, industry diagnostics via Porter's Five Forces, resource-based competitive advantages (VRIO), Blue Ocean innovation, and corporate portfolio strategy.",
    stats: [
      { label: "Status", value: "Curated Syllabus" },
      { label: "Interactive Tools", value: "Upcoming Porter & VRIO Matrix" },
      { label: "Focus", value: "Competitive Advantage" },
    ],
    frameworks: [
      "Porter's Five Forces Industry Structure Diagnostics",
      "Resource-Based View (RBV) & VRIO Framework",
      "Blue Ocean Strategy & Value Innovation Curves (ERRC)",
      "Generic Competitive Strategies: Cost Leadership vs. Differentiation",
      "Ansoff Growth Matrix & Product-Market Expansion",
      "Corporate Strategy: BCG Matrix, Vertical Integration & M&A",
    ],
    sampleFormulas: [
      { label: "Herfindahl-Hirschman Index (HHI)", formula: "\\text{HHI} = \\sum_{i=1}^{N} s_i^2 \\quad (s_i = \\% \\text{ Market Share})" },
      { label: "Economic Value Created", formula: "\\text{Value Created} = V - C = (V - P) + (P - C)" },
    ],
    references: [
      "Michael E. Porter — Competitive Strategy & Competitive Advantage",
      "Barney & Hesterly — Strategic Management and Competitive Advantage",
      "Kim & Mauborgne — Blue Ocean Strategy: How to Create Uncontested Market Space",
    ],
    learningOutcomes: [
      "Deconstruct competitive forces determining industry profit pool distribution.",
      "Audit enterprise resources for Valuable, Rare, Inimitable, and Organized (VRIO) sustained moats.",
      "Plot strategy canvases and formulate non-zero-sum value innovation plays.",
    ],
  },
];

export default function MBAHubHomePage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "curated">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);

  // Filtered domains based on filter tab and search
  const filteredDomains = useMemo(() => {
    return DOMAINS.filter((d) => {
      // Filter tab
      if (activeFilter === "live" && d.status !== "live") return false;
      if (activeFilter === "curated" && d.status !== "curated") return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.frameworks.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E9] text-[#211E19]">
      {/* Sticky Executive Top Bar */}
      <header className="tab-header">
        <div className="wrap flex items-center justify-between min-h-[64px] py-2 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#2E5C8A] text-white flex items-center justify-center font-bold text-lg shadow-sm mono">
              MBA
            </div>
            <div className="flex flex-col">
              <span className="brand text-xl leading-tight">
                MBA DOMAINS PORTAL
              </span>
              <span className="text-[10px] font-semibold text-[#686254] tracking-wider uppercase">
                Core Curriculum Study Guides &amp; Interactive Workbenches
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/suryateja4104-stark/Operations-Domain-Session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
            >
              <GithubIcon className="w-3.5 h-3.5 text-[#211E19]" />
              <span className="hidden sm:inline">Operations Repo</span>
            </a>

            <Link
              href="/economics/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#2E5C8A] text-white hover:bg-[#23486d] transition shadow-xs mono"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Macro Guide</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFFFFF] to-[#F4F1E9] border-b border-[#DCD5C4] py-10">
        <div className="wrap space-y-6">
          <div className="space-y-2">
            <div className="eyebrow">
              <span className="dot"></span>
              CORE MBA EXECUTIVE PORTAL • INTERACTIVE STUDY GUIDES &amp; SIMULATORS
            </div>
            <h1 className="display text-3xl sm:text-5xl font-black tracking-tight text-[#211E19]">
              Master the Core Business Disciplines
            </h1>
            <p className="text-sm sm:text-base text-[#686254] max-w-3xl leading-relaxed">
              An integrated, scenario-driven learning suite for MBA students and business leaders.
              Explore quantitative models, interactive policy sandboxes, real-world case simulations,
              and executive study guides across 5 fundamental management disciplines.
            </p>
          </div>

          {/* Key Metrics / Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="dash-card bg-white p-3 border border-[#DCD5C4]">
              <span className="text-[10px] font-bold uppercase text-[#9A927E] block">Core Disciplines</span>
              <span className="text-2xl font-black mono text-[#2E5C8A]">5</span>
              <span className="text-[11px] text-[#686254] block">Ops, Fin, Econ, Mktg, Strat</span>
            </div>

            <div className="dash-card bg-white p-3 border border-[#DCD5C4]">
              <span className="text-[10px] font-bold uppercase text-[#9A927E] block">Active Workbenches</span>
              <span className="text-2xl font-black mono text-[#3D7A52]">2 Live</span>
              <span className="text-[11px] text-[#686254] block">Ops Session + Macro Guide</span>
            </div>

            <div className="dash-card bg-white p-3 border border-[#DCD5C4]">
              <span className="text-[10px] font-bold uppercase text-[#9A927E] block">Analytical Models</span>
              <span className="text-2xl font-black mono text-[#E2571C]">35+</span>
              <span className="text-[11px] text-[#686254] block">Quantitative Frameworks</span>
            </div>

            <div className="dash-card bg-white p-3 border border-[#DCD5C4]">
              <span className="text-[10px] font-bold uppercase text-[#9A927E] block">Pedagogy</span>
              <span className="text-2xl font-black mono text-[#211E19]">Executive</span>
              <span className="text-[11px] text-[#686254] block">Scenario &amp; Decision-First</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
            {/* Filter Tabs */}
            <div className="inline-flex rounded-lg p-1 bg-[#FAF8F2] border border-[#DCD5C4] self-start">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition mono ${
                  activeFilter === "all"
                    ? "bg-[#2E5C8A] text-white shadow-xs"
                    : "text-[#686254] hover:text-[#211E19]"
                }`}
              >
                All Domains (5)
              </button>
              <button
                onClick={() => setActiveFilter("live")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition mono ${
                  activeFilter === "live"
                    ? "bg-[#3D7A52] text-white shadow-xs"
                    : "text-[#686254] hover:text-[#211E19]"
                }`}
              >
                Live Platforms (2)
              </button>
              <button
                onClick={() => setActiveFilter("curated")}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition mono ${
                  activeFilter === "curated"
                    ? "bg-[#BB3B2E] text-white shadow-xs"
                    : "text-[#686254] hover:text-[#211E19]"
                }`}
              >
                Under Curation (3)
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#9A927E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models (e.g. Little, IS-LM, WACC)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-[#DCD5C4] rounded focus:outline-none focus:border-[#2E5C8A] text-[#211E19]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A927E] hover:text-[#211E19]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Domains Content Grid */}
      <main className="wrap py-8 flex-1 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDomains.map((domain) => {
            const isLive = domain.status === "live";

            return (
              <div
                key={domain.id}
                className="dash-card flex flex-col justify-between p-6 bg-white border border-[#DCD5C4] hover:border-[#C7BFA9] hover:shadow-md transition duration-200 relative overflow-hidden"
              >
                {/* Top Accent Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: domain.themeColor }}
                />

                <div className="space-y-4">
                  {/* Card Header: Icon, Titles & Status Badge */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border"
                        style={{
                          backgroundColor: domain.accentBg,
                          borderColor: domain.borderColor,
                        }}
                      >
                        {domain.icon}
                      </div>
                      <div>
                        <h2 className="display text-2xl font-black text-[#211E19] leading-none">
                          {domain.title}
                        </h2>
                        <span className="text-xs font-semibold text-[#686254]">
                          {domain.subtitle}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`status-pill ${
                        isLive ? "ok" : "neutral"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {isLive ? (
                        <Activity className="w-3 h-3 text-[#3D7A52]" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#2E5C8A]" />
                      )}
                      <span>{domain.badge}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#686254] leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Core Frameworks Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#9A927E] tracking-wider block">
                      Core Frameworks &amp; Quantitative Models
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.frameworks.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF8F2] border border-[#DCD5C4] text-[#211E19]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Metric Preview */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#DCD5C4]">
                    {domain.stats.map((s, i) => (
                      <div key={i} className="text-left">
                        <span className="text-[9px] uppercase font-bold text-[#9A927E] block truncate">
                          {s.label}
                        </span>
                        <span className="text-xs font-semibold mono text-[#211E19] block truncate">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 mt-4 border-t border-[#DCD5C4] flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    onClick={() => setSelectedDomain(domain)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#686254] hover:text-[#211E19] transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Syllabus &amp; Formulas</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Operations Custom Actions */}
                    {domain.id === "ops" && (
                      <>
                        {domain.repoUrl && (
                          <a
                            href={domain.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
                            title="Operations-Domain-Session GitHub Repository"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Repo</span>
                          </a>
                        )}

                        {domain.liveUrl && (
                          <a
                            href={domain.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
                            title="Open standalone Operations Session"
                          >
                            <span>Live Standalone</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <Link
                          href="/operations/"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#2E5C8A] text-white hover:bg-[#23486d] transition shadow-xs mono"
                        >
                          <span>Open Guide</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </>
                    )}

                    {/* Economics Custom Actions */}
                    {domain.id === "economics" && (
                      <>
                        {domain.secondaryInternalUrl && (
                          <Link
                            href={domain.secondaryInternalUrl}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FAF8F2] hover:bg-[#EAE5D8] border border-[#C7BFA9] text-[#211E19] transition"
                          >
                            <span>Arcade Level</span>
                          </Link>
                        )}

                        {domain.internalUrl && (
                          <Link
                            href={domain.internalUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#3D7A52] text-white hover:bg-[#2e5d3e] transition shadow-xs mono"
                          >
                            <span>Open Guide</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </>
                    )}

                    {/* Curated Upcoming Domains Actions */}
                    {!isLive && (
                      <button
                        onClick={() => setSelectedDomain(domain)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#FAF8F2] border border-[#C7BFA9] hover:bg-[#EAE5D8] text-[#211E19] transition mono"
                      >
                        <span>Inspect Syllabus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDomains.length === 0 && (
          <div className="dash-card text-center p-12 bg-white border border-[#DCD5C4] rounded">
            <HelpCircle className="w-8 h-8 text-[#9A927E] mx-auto mb-2" />
            <h3 className="display text-lg font-bold text-[#211E19]">
              No matching MBA domains found
            </h3>
            <p className="text-xs text-[#686254] max-w-sm mx-auto mt-1 mb-4">
              Try modifying your search query or reset the filter to view all 5 core disciplines.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 bg-[#2E5C8A] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#23486d] transition mono"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Executive Comparison & Integration Callout */}
        <div className="dash-card bg-gradient-to-r from-white via-[#FAF8F2] to-white p-6 border border-[#C7BFA9] rounded">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="eyebrow">
                <span className="dot"></span>
                INTER-DISCIPLINARY MBA SYNERGIES
              </div>
              <h3 className="display text-2xl font-black text-[#211E19]">
                Connecting Quantitative Operations with Macroeconomic Policy
              </h3>
              <p className="text-xs text-[#686254] leading-relaxed">
                Modern enterprise management requires bidirectional insight: understanding how macroeconomic
                monetary policy shifts (interest rates, exchange rates, inflation) dictate corporate working capital
                and supply chain inventory strategies (holding costs, lead times, and global sourcing contracts).
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <a
                href="https://suryateja4104-stark.github.io/Operations-Domain-Session/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-2.5 bg-[#2E5C8A] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#23486d] transition shadow-xs mono flex items-center justify-center gap-2"
              >
                <span>Launch Operations Workbench</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/economics/"
                className="w-full text-center px-4 py-2.5 bg-[#3D7A52] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#2e5d3e] transition shadow-xs mono flex items-center justify-center gap-2"
              >
                <span>Launch Macro Policy Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Domain Details Modal / Drawer */}
      {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="dash-card max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border border-[#C7BFA9] rounded-lg shadow-xl p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#DCD5C4] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: selectedDomain.accentBg,
                    borderColor: selectedDomain.borderColor,
                  }}
                >
                  {selectedDomain.icon}
                </div>
                <div>
                  <h3 className="display text-2xl font-black text-[#211E19] leading-none">
                    {selectedDomain.title}
                  </h3>
                  <span className="text-xs text-[#686254] font-semibold">
                    {selectedDomain.subtitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDomain(null)}
                className="p-1 rounded-md text-[#9A927E] hover:text-[#211E19] hover:bg-[#FAF8F2] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#9A927E]">
                Domain Overview &amp; Objective
              </h4>
              <p className="text-xs text-[#686254] leading-relaxed">
                {selectedDomain.description}
              </p>
            </div>

            {/* Sample Quantitative Formulas */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#9A927E]">
                Essential Quantitative Formulas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedDomain.sampleFormulas.map((f, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#FAF8F2] border border-[#DCD5C4] rounded space-y-1"
                  >
                    <span className="text-[10px] font-bold uppercase text-[#686254] block">
                      {f.label}
                    </span>
                    <code className="text-[11px] mono text-[#2E5C8A] block font-semibold">
                      {f.formula}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#9A927E]">
                Key Learning Outcomes
              </h4>
              <ul className="space-y-1.5">
                {selectedDomain.learningOutcomes.map((lo, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#686254]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7A52] shrink-0 mt-0.5" />
                    <span>{lo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* References */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#9A927E]">
                Academic &amp; Industry References
              </h4>
              <ul className="space-y-1 text-xs text-[#686254] list-disc list-inside">
                {selectedDomain.references.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Modal Bottom Action CTAs */}
            <div className="pt-4 border-t border-[#DCD5C4] flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedDomain(null)}
                className="px-4 py-2 rounded text-xs font-semibold bg-[#FAF8F2] border border-[#C7BFA9] hover:bg-[#EAE5D8] text-[#211E19] transition"
              >
                Close
              </button>

              {selectedDomain.id === "ops" && selectedDomain.liveUrl && (
                <a
                  href={selectedDomain.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider bg-[#2E5C8A] text-white hover:bg-[#23486d] transition shadow-xs mono flex items-center gap-1.5"
                >
                  <span>Launch Operations Session</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {selectedDomain.id === "economics" && selectedDomain.internalUrl && (
                <Link
                  href={selectedDomain.internalUrl}
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider bg-[#3D7A52] text-white hover:bg-[#2e5d3e] transition shadow-xs mono flex items-center gap-1.5"
                >
                  <span>Open Economics Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#DCD5C4] bg-[#FFFFFF] py-6 mt-12 text-xs text-[#686254]">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E5C8A]"></span>
            <span className="font-semibold text-[#211E19]">MBA Domains Hub</span>
            <span>• Operations • Finance • Economics • Marketing • Strategy</span>
          </div>

          <div className="mono text-[11px] text-[#9A927E]">
            Linked Repos: Operations-Domain-Session &amp; MBA-Guide
          </div>
        </div>
      </footer>
    </div>
  );
}
