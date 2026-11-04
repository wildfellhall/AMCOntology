import rawLessons from "./content/lessons.json";
import rawQuestions from "./content/questions.json";
import rawFormulaQuestions from "./content/formula-questions.json";
import rawMethods from "./content/method-questions.json";
import rawDiagnostic from "./content/diagnostic.json";
import rawFormulas from "./content/formulas.json";
import legacyQuestions from "./content/legacy-questions.json";
import type { Lesson, Question, Formula } from "./types";
export const lessons = rawLessons as Lesson[];
export const questions = rawQuestions as Question[];
// Keep old items addressable for saved sessions, but never select ordinary
// calculation problems for a new formula drill.
const savedFormulaQuestions = rawFormulaQuestions as Question[];
export const formulaQuestions = savedFormulaQuestions.filter((q) =>
  ["formula", "definition", "matching", "condition"].includes(q.kind),
);
export const formulaChoiceQuestions = formulaQuestions.filter(
  (q) => q.kind === "formula" || q.kind === "definition",
);
export const methodQuestions = rawMethods as Question[];
export const diagnosticQuestions = (rawDiagnostic as string[]).map((id) =>
  questions.find((q) => q.id === id)!,
);
export const formulas = rawFormulas as Formula[];
export const allQuestions = [
  ...questions,
  ...savedFormulaQuestions,
  ...methodQuestions,
  ...(legacyQuestions as Question[]),
];
export const questionById = Object.fromEntries(
  allQuestions.map((q) => [q.id, q]),
);
export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
export const domains = [...new Set(lessons.map((l) => l.domain))];
export const domainColors: Record<string, string> = {
  Foundations: "#79674a",
  Algebra: "#7d6750",
  "Number theory": "#587c7a",
  Geometry: "#9a6b55",
  Counting: "#77708e",
  Probability: "#6c8494",
  Strategy: "#a18343",
  "AMC 12 extensions": "#786370",
};
