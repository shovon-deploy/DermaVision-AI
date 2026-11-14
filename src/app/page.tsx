"use client";

import { useEffect, useRef, useState } from "react";
import Disclaimer from "@/components/Disclaimer";
import ResultCard from "@/components/ResultCard";
import { MAX_BYTES, predict, type PredictResponse } from "@/lib/api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function validate(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please choose a JPEG or PNG image.";
  if (file.size > MAX_BYTES) return "The file is larger than 10 MB.";
  return null;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // release the preview URL when it is replaced or when the page is left
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function choose(chosen: File | undefined) {
    if (!chosen) return;
    setResult(null);
    const problem = validate(chosen);
    if (problem) {
      setError(problem);
      setFile(null);
      setPreview(null);
      return;
    }
    setError(null);
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await predict(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <Disclaimer />

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="upload-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 id="upload-heading" className="text-lg font-semibold">
            1. Upload a dermoscopic image
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            JPEG or PNG, up to 10 MB. The image is analyzed and then discarded. It is not stored.
          </p>

          <input
            ref={inputRef}
            id="file"
            type="file"
            accept="image/jpeg,image/png"
            aria-label="Dermoscopic image file"
            className="peer sr-only"
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <label
            htmlFor="file"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              choose(e.dataTransfer.files?.[0]);
            }}
            className={`mt-4 flex min-h-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900 ${
              dragging ? "border-slate-900 bg-slate-100" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="The selected lesion" className="max-h-64 rounded-md object-contain" />
                <span className="text-slate-500">Click or drop another image to replace it</span>
              </>
            ) : (
              <span className="text-slate-600">Drag and drop an image here, or click to choose one</span>
            )}
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={analyze}
              disabled={!file || loading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze image"}
            </button>
            {(file || result) && (
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Start over
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
        </section>

        <section
          aria-labelledby="result-heading"
          aria-live="polite"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 id="result-heading" className="text-lg font-semibold">
            2. Result
          </h2>
          <div className="mt-4">
            {result ? (
              <ResultCard result={result} />
            ) : (
              <p className="text-sm text-slate-500">
                {loading ? "Analyzing the image..." : "The result will appear here after you analyze an image."}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
