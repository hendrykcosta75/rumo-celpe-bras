import { z } from "zod";
import { countWords } from "./grading/grader";

export const emailSchema = z.string().trim().toLowerCase().email().max(200);
export type EssayError = "empty" | "tooShort" | "tooLong";

/** Regra do diagnóstico (AC-002): 150 a 300 palavras. */
export function checkEssay(text: string, min = 150, max = 300): EssayError | null {
  const n = countWords(text);
  if (n === 0) return "empty";
  if (n < min) return "tooShort";
  if (n > max) return "tooLong";
  return null;
}
