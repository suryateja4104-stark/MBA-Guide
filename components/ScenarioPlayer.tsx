"use client";

import React, { useState } from "react";
import { ScenarioModule } from "@/lib/schema";
import { Award, Compass, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

interface ScenarioPlayerProps {
  module: ScenarioModule;
  onComplete: (scorePct: number) => void;
}

export default function ScenarioPlayer({
  module,
  onComplete,
}: ScenarioPlayerProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [cumulativePoints, setCumulativePoints] = useState<number>(0);

  const currentNode = module.nodes[currentNodeId] || {
    text: "Node not found.",
    choices: [],
  };

  const isTerminal = !currentNode.choices || currentNode.choices.length === 0;

  // Calculate final score percentage clamped between 0 and 100
  const finalScorePct = Math.min(
    100,
    Math.max(0, Math.round((cumulativePoints / (module.maxScore || 1)) * 100))
  );

  const handleChoice = (nextId: string, scoreDelta: number) => {
    const newPoints = cumulativePoints + scoreDelta;
    setCumulativePoints(newPoints);
    setCurrentNodeId(nextId);
  };

  const handleRestart = () => {
    setCurrentNodeId("start");
    setCumulativePoints(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
            Scenario
          </span>
          <span className="text-xs font-medium text-slate-500">
            {module.concept}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel-subtle text-slate-700 text-sm font-medium">
          <Award className="w-4 h-4 text-indigo-600" />
          <span>
            Score: <strong className="text-indigo-900">{cumulativePoints}</strong> / {module.maxScore} pts
          </span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Scenario Setup Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-indigo-950 flex gap-3.5 items-start">
          <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-600 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600/90 mb-1">
              Briefing Context
            </h2>
            <p className="text-sm leading-relaxed text-indigo-950/90">
              {module.setup}
            </p>
          </div>
        </div>

        {/* Current Node Narrative */}
        <div className="pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Current Situation
          </div>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            {currentNode.text}
          </p>
        </div>

        {/* Choices or Terminal State */}
        {!isTerminal ? (
          <div className="pt-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Your Recommendation
            </div>
            {currentNode.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleChoice(choice.next, choice.scoreDelta)
                }
                className="w-full text-left p-4 sm:p-4.5 rounded-2xl glass-card-interactive flex items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                    {choice.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          /* Terminal State */
          <div className="pt-4 border-t border-slate-200/60 mt-6 space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-4">
              <div className="p-3 bg-emerald-500 rounded-2xl text-white shrink-0 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-emerald-950">
                  Scenario Completed
                </h3>
                <p className="text-sm text-emerald-800">
                  You earned{" "}
                  <strong>
                    {cumulativePoints} of {module.maxScore} points
                  </strong>{" "}
                  ({finalScorePct}%).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl glass-button-secondary text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Scenario
              </button>

              <button
                onClick={() => onComplete(finalScorePct)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl glass-button-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to Next Module
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
