// lib/schema.ts
// Generic, subject-agnostic content schemas for MBA Revision Arcade

export interface SubjectRegistryItem {
  id: string;
  name: string;
  levels: string[];
}

export interface ContentRegistry {
  subjects: SubjectRegistryItem[];
}

// 1. Scenario Module
export interface ScenarioChoice {
  label: string;
  next: string;
  scoreDelta: number;
}

export interface ScenarioNode {
  text: string;
  choices: ScenarioChoice[]; // Empty choices array = terminal node
}

export interface ScenarioModule {
  type: "scenario";
  id: string;
  concept: string;
  maxScore: number;
  setup: string;
  nodes: Record<string, ScenarioNode>;
}

// 2. Quiz Module
export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
  concept: string;
}

export interface QuizModule {
  type: "quiz";
  id: string;
  timeLimitSec: number;
  questions: QuizQuestion[];
}

// 3. Sim Module
export interface SimSliderInput {
  id: string;
  label: string;
  type: "slider";
  min: number;
  max: number;
  default: number;
  step?: number;
}

export interface SimToggleInput {
  id: string;
  label: string;
  type: "toggle";
  options: [string, string];
  default: string;
}

export type SimInput = SimSliderInput | SimToggleInput;

export type SimChartType = "label" | "gauge" | "line";

export interface SimOutput {
  id: string;
  label: string;
  chartType: SimChartType;
  unit?: string;
  min?: number;
  max?: number;
}

export interface SimModule {
  type: "sim";
  id: string;
  concept: string;
  inputs: SimInput[];
  model: string; // Registered function name in lib/simEngine.ts
  outputs: SimOutput[];
  challenge: string; // Challenge text shown above sandbox
}

export type Module = ScenarioModule | QuizModule | SimModule;

export interface LevelData {
  subject: string;
  level: string;
  title: string;
  modules: Module[];
}

export type ModuleType = Module["type"];
