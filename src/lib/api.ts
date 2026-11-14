import type { Group } from "./classes";

export type Probability = { code: string; name: string; probability: number };

export type PredictResponse = {
  model: string;
  prediction: { code: string; name: string; group: Group; confidence: number };
  uncertain: boolean;
  probabilities: Probability[];
  disclaimer: string;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const MAX_BYTES = 10 * 1024 * 1024; // same limit as the backend

export async function predict(file: File): Promise<PredictResponse> {
  const body = new FormData();
  body.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, { method: "POST", body });
  } catch {
    throw new Error("Could not reach the analysis server. Check that the backend is running.");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const detail = data && typeof data.detail === "string" ? data.detail : null;
    throw new Error(detail ?? `The server returned an error (${res.status}).`);
  }
  return res.json();
}
