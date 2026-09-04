// lib/progress.ts
// LocalStorage progress system for MBA Revision Arcade

import registryData from "@/content/index.json";
import { ContentRegistry } from "./schema";

const registry = registryData as ContentRegistry;

/**
 * Key format: progress:<subject>:<level>:<moduleId>
 */
export function getProgressKey(subject: string, level: string, moduleId: string): string {
  return `progress:${subject}:${level}:${moduleId}`;
}

/**
 * Record a completed module's score percentage (0-100).
 */
export function recordModuleScore(
  subject: string,
  level: string,
  moduleId: string,
  scorePct: number
): void {
  if (typeof window === "undefined") return;
  const clamped = Math.max(0, Math.min(100, Math.round(scorePct)));
  const key = getProgressKey(subject, level, moduleId);
  localStorage.setItem(key, clamped.toString());
}

/**
 * Retrieve a specific module's saved score percentage, or null if not yet attempted.
 */
export function getModuleScore(
  subject: string,
  level: string,
  moduleId: string
): number | null {
  if (typeof window === "undefined") return null;
  const key = getProgressKey(subject, level, moduleId);
  const val = localStorage.getItem(key);
  if (val === null) return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Retrieve all completed module scores for a given level.
 * Returns a dictionary mapping moduleId -> scorePct.
 */
export function getCompletedModuleScores(
  subject: string,
  level: string
): Record<string, number> {
  if (typeof window === "undefined") return {};
  const prefix = `progress:${subject}:${level}:`;
  const scores: Record<string, number> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const moduleId = key.slice(prefix.length);
        const val = localStorage.getItem(key);
        if (val !== null) {
          const parsed = parseFloat(val);
          if (!isNaN(parsed)) {
            scores[moduleId] = parsed;
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to read progress from localStorage", e);
  }

  return scores;
}

/**
 * Level average = mean of that level's module scores
 * (only counting modules attempted so far — does not zero out unattempted ones).
 * Returns null if no modules have been attempted yet.
 */
export function getLevelAverage(subject: string, level: string): number | null {
  const scores = getCompletedModuleScores(subject, level);
  const values = Object.values(scores);
  if (values.length === 0) return null;

  const sum = values.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Level N+1 in a subject unlocks when Level N's average >= 70.
 * First level in every subject (levelIndex === 0) is always unlocked.
 *
 * @param subject - The subject ID (e.g., "macro")
 * @param level - The level ID (e.g., "l1-0-foundations")
 * @param levelIndex - 0-based index of this level within the subject
 * @param subjectLevels - Optional ordered list of level IDs for this subject
 */
export function isLevelUnlocked(
  subject: string,
  level: string,
  levelIndex: number,
  subjectLevels?: string[]
): boolean {
  // First level in every subject is always unlocked
  if (levelIndex <= 0) {
    return true;
  }

  // Determine levels list from argument or registry
  const levels =
    subjectLevels ||
    registry.subjects.find((s) => s.id === subject)?.levels ||
    [];

  if (levelIndex >= levels.length && levels.length > 0) {
    // If out of bounds, check the last known level
    const prevLevelId = levels[levels.length - 1];
    const prevAvg = getLevelAverage(subject, prevLevelId);
    return prevAvg !== null && prevAvg >= 70;
  }

  const prevLevelId = levels[levelIndex - 1];
  if (!prevLevelId) {
    return false;
  }

  const prevAvg = getLevelAverage(subject, prevLevelId);
  return prevAvg !== null && prevAvg >= 70;
}
