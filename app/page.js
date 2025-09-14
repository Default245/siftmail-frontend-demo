
'use client';

import {useState} from 'react';
import ScoreBadge from './components/ScoreBadge';

export default function Page() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setResult(null);
    try {
      const r = await fetch('/api/classify', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ text })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container space-y-6">
      <header className="flex items-center gap-3">
        <img src="/logo.svg" width={28} height={28} alt="Sift logo" />
        <h1 className="text-3xl font-extrabold tracking-tight">SIFT</h1>
        <span className="text-slate-400">• spam & scam filter demo</span>
      </header>

      <section className="card space-y-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm text-slate-300">Paste an email / message</label>
          <textarea
            className="w-full h-40 rounded-xl bg-neutral-900/70 border border-white/10 p-3 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-vertical"
            placeholder="Paste text here..."
            value={text}
            onChange={(e)=>setText(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button disabled={busy || !text.trim()} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50">
              {busy ? 'Scoring…' : 'Classify'}
            </button>
            <a href="/health" className="text-sm text-slate-400 hover:text-slate-200 underline/30">Health</a>
          </div>
        </form>

        {error && <p className="text-red-400 text-sm">Error: {error}</p>}

        {result && (
          <div className="space-y-3">
            <ScoreBadge score={result.score} />
            <pre className="text-sm text-slate-300/90 bg-black/30 border border-white/10 rounded-xl p-3 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <footer className="text-xs text-slate-500">
        Demo only • heuristic scoring • no data stored
      </footer>
    </main>
  );
}
