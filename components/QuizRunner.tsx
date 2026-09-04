"use client";

import React, { useState, useEffect, useRef } from "react";
import { QuizModule } from "@/lib/schema";
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizRunnerProps {
  module: QuizModule;
  onComplete: (scorePct: number) => void;
}

export default function QuizRunner({ module, onComplete }: QuizRunnerProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Time limit per question. If module specifies timeLimitSec, use it per question (or fallback to 30)
  const questionTimeLimit = module.timeLimitSec || 30;
  const [timeLeft, setTimeLeft] = useState<number>(questionTimeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = module.questions.length;
  const currentQuestion = module.questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (isComplete || isAnswered) return;

    setTimeLeft(questionTimeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isComplete, isAnswered, questionTimeLimit]);

  const handleTimeExpired = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // -1 signifies unanswered / timed out
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || isComplete) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setIsComplete(false);
    setTimeLeft(questionTimeLimit);
  };

  const scorePct = Math.round(
    (correctAnswersCount / (totalQuestions || 1)) * 100
  );

  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/60 shadow-xs">
            Quiz Module
          </span>
          <span className="text-xs font-medium text-slate-500">
            {currentQuestion ? currentQuestion.concept : "Assessment"}
          </span>
        </div>

        {/* Timer Badge */}
        {!isComplete && (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              timeLeft <= 10
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "glass-panel-subtle text-slate-700"
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                timeLeft <= 10 ? "text-rose-600 animate-pulse" : "text-sky-600"
              }`}
            />
            <span>
              <strong>{timeLeft}s</strong> left
            </span>
          </div>
        )}
      </div>

      {/* Main Glass Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {!isComplete ? (
          <>
            {/* Progress Bar & Counter */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-white/60">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Heading */}
            <div className="pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                {currentQuestion.q}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                let cardStyle = "glass-card-interactive cursor-pointer";
                let badgeStyle = "bg-slate-100 text-slate-700";
                let icon = null;

                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    cardStyle =
                      "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm";
                    badgeStyle = "bg-emerald-600 text-white";
                    icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (idx === selectedOption) {
                    cardStyle =
                      "bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm";
                    badgeStyle = "bg-rose-600 text-white";
                    icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                    cardStyle = "opacity-50 border-slate-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-200 ${cardStyle}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-xl font-semibold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {opt}
                      </span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Action */}
            {isAnswered && (
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-4">
                <div className="text-sm font-medium">
                  {selectedOption === currentQuestion.correctIndex ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Correct answer!
                    </span>
                  ) : selectedOption === -1 ? (
                    <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Time expired! Unanswered.
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Incorrect answer.
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl glass-button-primary text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {currentIdx + 1 < totalQuestions ? "Next Question" : "View Results"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Quiz Results Completion */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Quiz Finished!
              </h3>
              <p className="text-sm text-slate-600">
                You answered{" "}
                <strong className="text-slate-900">
                  {correctAnswersCount} out of {totalQuestions}
                </strong>{" "}
                questions correctly.
              </p>
            </div>

            <div className="inline-flex items-baseline gap-1 px-6 py-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
              <span className="text-3xl font-extrabold text-indigo-900">
                {scorePct}%
              </span>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Final Score
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl glass-button-secondary text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Quiz
              </button>

              <button
                onClick={() => onComplete(scorePct)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl glass-button-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
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
