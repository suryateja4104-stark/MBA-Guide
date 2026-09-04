"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { Module } from "@/lib/schema";

interface ModuleTransitionProps {
  completedModule: Module;
  moduleIndex: number;
  totalModules: number;
  scorePct: number;
  onContinue: () => void;
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

export default function ModuleTransition({
  completedModule,
  moduleIndex,
  totalModules,
  scorePct,
  onContinue,
}: ModuleTransitionProps) {
  const isHighScorer = scorePct >= 70;

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-100/50">
        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Milestone Badge */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
          {scorePct === 100 ? (
            <Sparkles className="w-8 h-8" />
          ) : isHighScorer ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <TrendingUp className="w-8 h-8" />
          )}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Module {moduleIndex + 1} of {totalModules} Completed
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {getModuleTitle(completedModule)}
          </h2>
        </div>

        {/* Score Display */}
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/60 max-w-xs mx-auto">
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-1">
            {scorePct}%
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Module Score Earned
          </p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          {isHighScorer
            ? "Great performance! Your score has been recorded to your progress ledger."
            : "Module finished and recorded. Keep pushing toward the 70% level mastery threshold!"}
        </p>

        {/* Continue Action */}
        <div className="pt-2">
          <button
            onClick={onContinue}
            className="w-full py-3.5 px-6 rounded-2xl glass-button-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            Continue to Next Module
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
