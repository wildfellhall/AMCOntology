export type Track = 10 | 12;
export type Confidence = "unsure" | "somewhat" | "confident";
export type Mode =
  "lesson" | "mixed" | "review" | "diagnostic" | "formula" | "method";
export interface Source {
  kind: string;
  title: string;
  url?: string;
  attribution?: string;
  verified?: string;
  answer?: string;
}
export interface Question {
  id: string;
  lessonId: string;
  kind: string;
  stem: string;
  prompt?: string;
  context?: string;
  options: string[];
  answer: number;
  pairs?: { left: string; right: string }[];
  solution: string[];
  hints: string[];
  misconception: string;
  level: number;
  family: string;
  source: Source;
  optionRationales?: string[];
  decision?: string;
  skills?: string[];
  demand?: string;
}
export interface Lesson {
  id: string;
  number: number;
  title: string;
  domain: string;
  track: Track;
  summary: string;
  minutes: number;
  prerequisites: string[];
  chapter: number | null;
  sourceConcept: string;
  objectives: string[];
  teaching: string[];
  derivation: string[];
  pitfall: string;
  visual: string;
  examples: Question[];
  questionIds: string[];
  path?: "reference" | "competition";
  sections?: { title: string; paragraphs: string[] }[];
  techniques?: string[];
  reference?: { book: string; chapter: number; pages: string };
  activity?: { prompt: string; answer: string; steps: string[] };
}
export interface Formula {
  lessonId: string;
  tex: string;
  name: string;
  use: string;
  condition: string;
}
export interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  lessonId: string;
  family: string;
  mode: Mode;
  correct: boolean;
  assisted: boolean;
  skipped: boolean;
  confidence: Confidence;
  at: number;
}
export interface Answer {
  selected: number | number[] | null;
  correct: boolean;
  assisted: boolean;
  skipped: boolean;
  confidence: Confidence;
  at: number;
}
export interface Session {
  id: string;
  title: string;
  mode: Mode;
  questionIds: string[];
  index: number;
  createdAt: number;
  completedAt?: number;
  answers: Record<string, Answer>;
  aids: Record<string, { hints: number; revealed: boolean }>;
}
export interface State {
  version: 1;
  settings: {
    track: Track;
    sessionSize: number;
    anchor: string;
    name?: string;
    accent?: "blue" | "plum" | "graphite";
  };
  attempts: Attempt[];
  lessons: Record<string, { read: boolean; lastOpened: number; notes: string }>;
  reviews: Record<
    string,
    { due: number; intervalIndex: number; lastReviewedAt: number }
  >;
  sessions: Record<string, Session>;
  notes: Record<string, string>;
  bookmarks: string[];
  diagnosticAt?: number;
}
