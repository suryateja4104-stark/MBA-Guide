"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LevelData } from "@/lib/schema";
import { recordModuleScore, getLevelAverage, getCompletedModuleScores } from "@/lib/progress";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import QuizRunner from "@/components/QuizRunner";
import SimSandbox from "@/components/SimSandbox";
import ModuleTransition from "@/components/ModuleTransition";
import LevelSummary from "@/components/LevelSummary";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: {
    subject: string;
    level: string;
  };
}

type RunnerStep = "PLAYING_MODULE" | "MODULE_TRANSITION" | "LEVEL_SUMMARY";

export default function LevelRunnerPage({ params }: PageProps) {
  const { subject, level } = params;
  const router = useRouter();

  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentModuleIdx, setCurrentModuleIdx] = useState<number>(0);
  const [runnerStep, setRunnerStep] = useState<RunnerStep>("PLAYING_MODULE");
  const [lastCompletedScore, setLastCompletedScore] = useState<number>(0);
  const [moduleScores, setModuleScores] = useState<Record<string, number>>({});

  // Load level content dynamically
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        // Dynamic import of content JSON
        let content: LevelData | null = null;
        try {
          const mod = (await import(`@/content/${subject}/${level}.json`)) as { default: LevelData } | LevelData;
          content = "default" in mod ? mod.default : mod;
        } catch {
          // Bundler fallback for seed content
          if (subject === "macro" && level === "l1-0-foundations") {
            const seed = (await import("@/content/macro/l1-0-foundations.json")) as { default: LevelData } | LevelData;
            content = "default" in seed ? seed.default : seed;
          }
        }

        if (!content) {
          setError(`Level "${level}" under subject "${subject}" could not be loaded.`);
          return;
        }

        setLevelData(content);

        // Load existing saved scores for this level
        const savedScores = getCompletedModuleScores(subject, level);
        setModuleScores(savedScores);
      } catch (err: unknown) {
        console.error("Failed to load level content", err);
        setError("Error loading level content.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [subject, level]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Loading level scenario...
          </p>
        </div>
      </div>
    );
  }

  if (error || !levelData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Module Not Found</h2>
          <p className="text-sm text-slate-600">{error || "Level content could not be located."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Arcade Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = levelData.modules[currentModuleIdx];
  const isLastModule = currentModuleIdx === levelData.modules.length - 1;

  // Handler when any module finishes its run
  const handleModuleComplete = (scorePct: number) => {
    // 1. Record score to localStorage progress ledger
    recordModuleScore(subject, level, currentModule.id, scorePct);

    // 2. Update local state
    const updated = {
      ...moduleScores,
      [currentModule.id]: scorePct,
    };
    setModuleScores(updated);
    setLastCompletedScore(scorePct);

    // 3. Move to transition screen
    setRunnerStep("MODULE_TRANSITION");
  };

  const handleContinueAfterTransition = () => {
    if (isLastModule) {
      setRunnerStep("LEVEL_SUMMARY");
    } else {
      setCurrentModuleIdx((prev) => prev + 1);
      setRunnerStep("PLAYING_MODULE");
    }
  };

  const handleRestartLevel = () => {
    setCurrentModuleIdx(0);
    setRunnerStep("PLAYING_MODULE");
  };

  // Compute live level average
  const currentAverage = getLevelAverage(subject, level) ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header Navigation */}
      <header className="w-full border-b border-white/40 glass-panel-subtle sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl glass-panel text-slate-600 hover:text-slate-900 transition-colors"
              title="Return to Arcade"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {subject}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500">
                  Module {currentModuleIdx + 1} of {levelData.modules.length}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {levelData.title}
              </h1>
            </div>
          </div>

          {/* Module Step Indicator */}
          <div className="flex items-center gap-2">
            {levelData.modules.map((mod, idx) => {
              const isCompleted = idx < currentModuleIdx || (idx === currentModuleIdx && runnerStep === "LEVEL_SUMMARY");
              const isCurrent = idx === currentModuleIdx && runnerStep !== "LEVEL_SUMMARY";

              return (
                <div
                  key={mod.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isCurrent
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                      : "bg-slate-100 text-slate-400 opacity-60"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                  )}
                  <span className="capitalize hidden sm:inline">{mod.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex items-center justify-center">
        {runnerStep === "PLAYING_MODULE" && (
          <div className="w-full">
            {currentModule.type === "scenario" && (
              <ScenarioPlayer
                key={currentModule.id}
                module={currentModule}
                onComplete={handleModuleComplete}
              />
            )}

            {currentModule.type === "quiz" && (
              <QuizRunner
                key={currentModule.id}
                module={currentModule}
                onComplete={handleModuleComplete}
              />
            )}

            {currentModule.type === "sim" && (
              <SimSandbox
                key={currentModule.id}
                module={currentModule}
                onComplete={handleModuleComplete}
              />
            )}
          </div>
        )}

        {runnerStep === "MODULE_TRANSITION" && (
          <ModuleTransition
            completedModule={currentModule}
            moduleIndex={currentModuleIdx}
            totalModules={levelData.modules.length}
            scorePct={lastCompletedScore}
            onContinue={handleContinueAfterTransition}
          />
        )}

        {runnerStep === "LEVEL_SUMMARY" && (
          <LevelSummary
            levelData={levelData}
            moduleScores={moduleScores}
            levelAverage={currentAverage}
            onReturnHome={() => router.push("/")}
            onRestartLevel={handleRestartLevel}
          />
        )}
      </main>
    </div>
  );
}
