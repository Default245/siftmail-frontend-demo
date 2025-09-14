
export default function ScoreBadge({score}) {
  const level = score >= 0.8 ? "bg-red-500/20 text-red-300 border-red-500/40" :
                score >= 0.5 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                               "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  const label = score >= 0.8 ? "High risk" : score >= 0.5 ? "Medium risk" : "Low risk";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border ${level}`}>
      <span className="font-semibold">{label}</span>
      <span className="opacity-80 text-sm">({Math.round(score*100)}%)</span>
    </span>
  );
}
