"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SimModule } from "@/lib/schema";
import { runSimModel, checkSimChallenge, SimValues, SimValue } from "@/lib/simEngine";
import {
  Sliders,
  Target,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Activity,
  Gauge,
  Sparkles,
} from "lucide-react";

interface SimSandboxProps {
  module: SimModule;
  onComplete: (scorePct: number) => void;
}

export default function SimSandbox({ module, onComplete }: SimSandboxProps) {
  // Initialize default input values
  const initialInputs = useMemo(() => {
    const defaults: SimValues = {};
    module.inputs.forEach((input) => {
      defaults[input.id] = input.default;
    });
    return defaults;
  }, [module.inputs]);

  const [inputs, setInputs] = useState<SimValues>(initialInputs);
  const [touchedInputs, setTouchedInputs] = useState<Set<string>>(new Set());
  const [hasAchievedChallenge, setHasAchievedChallenge] = useState<boolean>(false);

  // Compute outputs live via registry (NO eval)
  const outputs = useMemo(() => {
    return runSimModel(module.model, inputs);
  }, [module.model, inputs]);

  // Check challenge companion function live on state updates
  useEffect(() => {
    if (hasAchievedChallenge) return;

    const achieved = checkSimChallenge(module.model, inputs, outputs, {
      initialInputs,
      touchedInputs,
    });

    if (achieved) {
      setHasAchievedChallenge(true);
    }
  }, [module.model, inputs, outputs, initialInputs, touchedInputs, hasAchievedChallenge]);

  const handleInputChange = (id: string, value: SimValue) => {
    setTouchedInputs((prev) => new Set(prev).add(id));
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const currentScorePct = hasAchievedChallenge ? 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/60 shadow-xs">
            Interactive Simulation
          </span>
          <span className="text-xs font-medium text-slate-500">
            {module.concept}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel-subtle text-slate-700 text-sm font-medium">
          <Activity className="w-4 h-4 text-violet-600" />
          <span>Live Model Sandbox</span>
        </div>
      </div>

      {/* Challenge Goal Banner */}
      <div
        className={`p-5 rounded-3xl transition-all duration-300 border ${
          hasAchievedChallenge
            ? "bg-emerald-50/80 border-emerald-300 shadow-md shadow-emerald-500/10"
            : "bg-amber-50/80 border-amber-200/80"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-2.5 rounded-2xl shrink-0 ${
              hasAchievedChallenge
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-amber-500/20 text-amber-700"
            }`}
          >
            {hasAchievedChallenge ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  hasAchievedChallenge ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                Simulation Challenge
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  hasAchievedChallenge
                    ? "bg-emerald-200/70 text-emerald-900"
                    : "bg-amber-200/60 text-amber-900"
                }`}
              >
                {hasAchievedChallenge ? "Challenge Solved (100%)" : "In Progress (0%)"}
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                hasAchievedChallenge ? "text-emerald-950 font-medium" : "text-amber-950"
              }`}
            >
              {module.challenge}
            </p>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid: Inputs & Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="md:col-span-6 glass-panel rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Input Controls
            </h3>
          </div>

          <div className="space-y-6">
            {module.inputs.map((input) => {
              if (input.type === "slider") {
                const val = Number(inputs[input.id] ?? input.default);
                return (
                  <div key={input.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <label
                        htmlFor={input.id}
                        className="font-medium text-slate-700"
                      >
                        {input.label}
                      </label>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-wide">
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </div>

                    <input
                      id={input.id}
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step || 1}
                      value={val}
                      onChange={(e) =>
                        handleInputChange(input.id, parseFloat(e.target.value))
                      }
                      className="w-full"
                    />

                    <div className="flex justify-between text-xs text-slate-400 px-0.5">
                      <span>{input.min}</span>
                      <span className="text-slate-500 font-medium">0</span>
                      <span>+{input.max}</span>
                    </div>
                  </div>
                );
              }

              if (input.type === "toggle") {
                const currentVal = inputs[input.id] ?? input.default;
                return (
                  <div key={input.id} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">
                      {input.label}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-white/60">
                      {input.options.map((opt) => {
                        const isSelected = currentVal === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange(input.id, opt)}
                            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white text-indigo-700 shadow-sm shadow-slate-300/40"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Right Column: Live Model Visualizations */}
        <div className="md:col-span-6 glass-panel rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 mb-5">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Live Macro Indicators
              </h3>
            </div>

            <div className="space-y-4">
              {module.outputs.map((out) => {
                const outVal = outputs[out.id];

                if (out.chartType === "label") {
                  return (
                    <div
                      key={out.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/50 border border-indigo-100/70"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
                        {out.label}
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-indigo-950 flex items-center gap-2">
                        <span>{outVal ?? "—"}</span>
                      </div>
                    </div>
                  );
                }

                if (out.chartType === "gauge") {
                  const numVal = Number(outVal ?? 0);
                  // Normalize -10 to +10 range to 0% - 100%
                  const min = -10;
                  const max = 10;
                  const percent = Math.min(
                    100,
                    Math.max(0, ((numVal - min) / (max - min)) * 100)
                  );

                  return (
                    <div
                      key={out.id}
                      className="p-5 rounded-2xl glass-panel-subtle border border-slate-200/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          {out.label} Indicator
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            numVal >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {numVal > 0 ? `+${numVal}` : numVal}%
                        </span>
                      </div>

                      {/* Visual gauge bar */}
                      <div className="relative pt-2 pb-1">
                        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex relative border border-slate-200">
                          {/* Contraction zone (left) */}
                          <div className="w-1/2 h-full bg-rose-100/70 border-r border-slate-300" />
                          {/* Expansion zone (right) */}
                          <div className="w-1/2 h-full bg-emerald-100/70" />

                          {/* Marker needle */}
                          <div
                            className="absolute top-0 bottom-0 w-2.5 bg-indigo-600 rounded-full shadow-md -translate-x-1/2 transition-all duration-200"
                            style={{ left: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                          <span>Contraction (-10%)</span>
                          <span>Zero Gap (0%)</span>
                          <span>Expansion (+10%)</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-200/60">
            <button
              onClick={() => onComplete(currentScorePct)}
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasAchievedChallenge
                  ? "glass-button-primary"
                  : "glass-button-secondary hover:bg-slate-100"
              }`}
            >
              {hasAchievedChallenge ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Continue with Perfect Score (100%)
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Finish Simulation & Continue ({currentScorePct}%)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
