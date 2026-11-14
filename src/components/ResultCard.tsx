import type { PredictResponse } from "@/lib/api";
import { GROUP_STYLE } from "@/lib/classes";

const percent = (p: number) => `${(p * 100).toFixed(1)}%`;

export default function ResultCard({ result }: { result: PredictResponse }) {
  const { prediction, probabilities, uncertain, model, disclaimer } = result;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">Most likely category</p>
        <h3 className="mt-1 text-2xl font-semibold">{prediction.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${GROUP_STYLE[prediction.group]}`}
          >
            {prediction.group}
          </span>
          <span className="text-sm text-slate-600">
            Confidence: <strong>{percent(prediction.confidence)}</strong>
          </span>
        </div>
      </div>

      {uncertain && (
        <p role="status" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Uncertain result.</strong> The model is not confident about this image. Please do not rely on it,
          and ask a doctor to examine the lesion.
        </p>
      )}

      <div>
        <h4 className="text-sm font-semibold">All categories</h4>
        <ul className="mt-2 space-y-2">
          {probabilities.map((p) => (
            <li key={p.code}>
              <div className="flex justify-between gap-3 text-sm">
                <span>{p.name}</span>
                <span className="tabular-nums">{percent(p.probability)}</span>
              </div>
              <div
                className="mt-1 h-2 rounded-full bg-slate-100"
                role="progressbar"
                aria-label={p.name}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(p.probability * 100)}
              >
                <div className="h-2 rounded-full bg-slate-700" style={{ width: `${p.probability * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-500">{disclaimer}</p>
      <p className="text-xs text-slate-400">Model: {model}</p>
    </div>
  );
}
