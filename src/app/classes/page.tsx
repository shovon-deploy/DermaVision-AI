import Disclaimer from "@/components/Disclaimer";
import { CLASS_INFO, GROUP_STYLE } from "@/lib/classes";

export const metadata = { title: "Lesion classes | DermaVision AI" };

export default function Classes() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">The seven lesion classes</h1>
      <p className="text-slate-600">
        DermaVision AI sorts a dermoscopic image into one of the seven categories used in the HAM10000 dataset.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {Object.entries(CLASS_INFO).map(([code, c]) => (
          <li key={code} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold">{c.name}</h2>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${GROUP_STYLE[c.group]}`}
              >
                {c.group}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{code}</p>
            <p className="mt-2 text-sm text-slate-700">{c.about}</p>
          </li>
        ))}
      </ul>
      <Disclaimer />
    </div>
  );
}
