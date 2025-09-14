
function scoreText(t) {
  const text = (t || '').toLowerCase();
  if (!text.trim()) return { score: 0.0, reasons: ['empty'] };

  const signals = [
    { re: /(viagra|crypto|casino|loan|sweepstake|giveaway)/g, weight: 0.25, label: 'spam_keyword' },
    { re: /(free money|double your|winner|prize|act now)/g, weight: 0.2, label: 'marketing_bait' },
    { re: /(wire transfer|gift card|western union|zelle)/g, weight: 0.2, label: 'payment_vector' },
    { re: /(urgent|immediately|final notice|limited time)/g, weight: 0.15, label: 'urgency' },
    { re: /(download attachment|open the file|enable macros)/g, weight: 0.15, label: 'attachment_push' },
    { re: /(verify your account|password reset|suspicious activity)/g, weight: 0.2, label: 'phish_account' }
  ];

  let score = 0;
  const reasons = [];
  for (const s of signals) {
    if (s.re.test(text)) {
      score += s.weight;
      reasons.push(s.label);
    }
  }

  // Normalize score [0..1]
  score = Math.max(0, Math.min(1, score));
  return { score, reasons };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const out = scoreText(body?.text || '');
    return Response.json({ ...out, model: 'heuristic:v1' });
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
}
