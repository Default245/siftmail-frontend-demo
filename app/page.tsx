"use client";
import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setScore(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setScore(Number(data?.spamScore ?? 0));
    } catch (err: any) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">🚀 SIFT</h1>
        <p className="mt-2 text-slate-300">Spam & scam filter demo • heuristic only • no data stored</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          className="w-full h-40 rounded-lg bg-neutral-900/70 border border-neutral-800 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste an email or message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Classifying…" : "Classify"}
          </button>
          <a className="text-sm text-indigo-400 hover:underline" href="/api/health">Health</a>
        </div>
      </form>

      {error && <p className="text-sm text-red-400">Error: {error}</p>}
      {score !== null && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-sm text-slate-300">Spam score:</p>
          <p className="mt-1 text-2xl font-semibold">
            {(score * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {(score >= 0.7 ? "Likely spam" : score >= 0.4 ? "Suspicious" : "Looks clean")} (demo heuristic)
          </p>
        </div>
      )}
    </section>
  );
}
