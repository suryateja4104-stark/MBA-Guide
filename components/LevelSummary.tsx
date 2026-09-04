"use client";

import React from "react";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, Award } from "lucide-react";
import { LevelData, Module } from "@/lib/schema";

interface LevelSummaryProps {
  levelData: LevelData;
  moduleScores: Record<string, number>;
  levelAverage: number;
  onReturnHome: () => void;
  onRestartLevel: () => void;
}

function getModuleTitle(mod: Module): string {
  if (mod.type === "scenario" || mod.type === "sim") {
    return mod.concept;
  }
  if (mod.type === "quiz") {
    return mod.questions[0]?.concept || "Core Concepts Quiz";
  }
  return "Module Assessment";
}

export default function LevelSummary({
  levelData,
  moduleScores,
  levelAverage,
  onReturnHome,
  onRestartLevel,
}: LevelSummaryProps) {
  const isPassed = levelAverage >= 70;

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-2xl shadow-slate-200/50">
        {/* Glow ambient background effect */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPassed ? "bg-emerald-200/50" : "bg-rose-200/40"
          }`}
        />

        {/* Status Header */}
        <div className="text-center space-y-3">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white shadow-xl ${
              isPassed
                ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30"
                : "bg-gradient-to-tr from-rose-500 to-amber-500 shadow-rose-500/25"
            }`}
          >
            {isPassed ? (
              <Trophy className="w-10 h-10" />
            ) : (
              <RotateCcw className="w-10 h-10" />
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Level Assessment Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {levelData.title}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border mt-2">
            {isPassed ? (
              <span className="text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Passed (Level Mastered)
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 border-rose-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                <XCircle className="w-4 h-4 text-rose-600" /> Below 70% Threshold (Retry Recommended)
              </span>
            )}
          </div>
        </div>

        {/* Score Benchmark Gauge / Metric */}
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/70 text-center space-y-2">
          <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
            {levelAverage}%
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Level Average Score
          </p>
          <div className="w-full max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPassed ? "bg-emerald-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, levelAverage))}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Requires ≥ 70% to unlock the subsequent level
          </div>
        </div>

        {/* Module Breakdown List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Module Performance Breakdown
          </h3>

          <div className="space-y-2">
            {levelData.modules.map((mod, idx) => {
              const score = moduleScores[mod.id] ?? 0;
              const passedMod = score >= 70;

              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl glass-panel-subtle flex items-center justify-between gap-4 border border-slate-200/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {getModuleTitle(mod)}
                      </h4>
                      <span className="text-xs uppercase font-medium text-slate-400">
                        Type: {mod.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        passedMod ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {score}%
                    </span>
                    <Award
                      className={`w-4 h-4 ${
                        passedMod ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200/60">
          <button
            onClick={onRestartLevel}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl glass-button-secondary text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Replay Level
          </button>

          <button
            onClick={onReturnHome}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl glass-button-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
