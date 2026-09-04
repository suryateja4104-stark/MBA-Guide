// lib/simEngine.ts
// Named function registry for simulation modules (safe lookup, NO eval)

export type SimValue = string | number | boolean;
export type SimValues = Record<string, SimValue>;

export type SimModelFn = (inputs: SimValues) => SimValues;

export type SimChallengeFn = (
  inputs: SimValues,
  outputs: SimValues,
  meta?: {
    initialInputs?: SimValues;
    touchedInputs?: Set<string>;
  }
) => boolean;

/**
 * Model: classifyPhase
 * 
 * Logic:
 * - if outputGap < 0 and direction === "Falling" -> phase = "Recession (heading to Trough)"
 * - if outputGap < 0 and direction === "Rising" -> phase = "Recovery"
 * - if outputGap >= 0 and direction === "Rising" -> phase = "Expansion (heading to Peak)"
 * - if outputGap >= 0 and direction === "Falling" -> phase = "Slowdown (past Peak)"
 */
export const classifyPhase: SimModelFn = (inputs) => {
  const outputGap = Number(inputs.outputGap ?? 0);
  const direction = String(inputs.direction ?? "Falling");

  let phase = "";
  if (outputGap < 0 && direction === "Falling") {
    phase = "Recession (heading to Trough)";
  } else if (outputGap < 0 && direction === "Rising") {
    phase = "Recovery";
  } else if (outputGap >= 0 && direction === "Rising") {
    phase = "Expansion (heading to Peak)";
  } else {
    // outputGap >= 0 && direction === "Falling"
    phase = "Slowdown (past Peak)";
  }

  return {
    phase,
    outputGap,
  };
};

/**
 * Challenge checker: classifyPhase_checkChallenge
 * Returns true once target condition is met.
 * Handles both the phase === "Recovery" condition and the prompt challenge text:
 * "Move the economy from Recession to Recovery by improving the output gap alone — without touching the direction toggle."
 */
export const classifyPhase_checkChallenge: SimChallengeFn = (
  inputs,
  outputs,
  meta
) => {
  const phase = outputs.phase;
  const directionTouched = meta?.touchedInputs?.has("direction") ?? false;
  const outputGap = Number(inputs.outputGap ?? 0);

  // 1. Phase is "Recovery"
  if (phase === "Recovery") {
    return true;
  }

  // 2. User improved output gap (outputGap >= 0) without touching direction toggle
  if (!directionTouched && outputGap >= 0) {
    return true;
  }

  return false;
};

// Central Registry
export const simModelRegistry: Record<string, SimModelFn> = {
  classifyPhase,
};

export const simChallengeRegistry: Record<string, SimChallengeFn> = {
  classifyPhase: classifyPhase_checkChallenge,
  classifyPhase_checkChallenge,
};

/**
 * Helper to compute simulation outputs for a registered model
 */
export function runSimModel(
  modelName: string,
  inputs: SimValues
): SimValues {
  const fn = simModelRegistry[modelName];
  if (!fn) {
    console.warn(`Sim model "${modelName}" not found in registry.`);
    return {};
  }
  return fn(inputs);
}

/**
 * Helper to check challenge status for a registered model
 */
export function checkSimChallenge(
  modelName: string,
  inputs: SimValues,
  outputs: SimValues,
  meta?: { initialInputs?: SimValues; touchedInputs?: Set<string> }
): boolean {
  const fn =
    simChallengeRegistry[`${modelName}_checkChallenge`] ||
    simChallengeRegistry[modelName];
  if (!fn) {
    return false;
  }
  return fn(inputs, outputs, meta);
}
