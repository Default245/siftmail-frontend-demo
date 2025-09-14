
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        }
      }
    },
    fontFamily: {
      sans: ["ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Inter","Noto Sans","Helvetica Neue","Arial","sans-serif"]
    }
  },
  plugins: [],
}
'
bash -lc '
set -e
# 1) Enter the project (tries common paths, then local folder)
cd ~/sift-brand-kit/siftmail-mvp/apps/web/sift-full-demo 2>/dev/null || cd sift-full-demo 2>/dev/null || { echo "❌ Could not find sift-full-demo"; exit 1; }

# 2) Free port 3000
kill -9 $(lsof -ti:3000) 2>/dev/null || true

# 3) Ensure Tailwind & PostCSS are ESM
node -e "
  const fs=require(\"fs\");
  const ensureESM=(p,def)=>{ let c=fs.existsSync(p)?fs.readFileSync(p,\"utf8\"):def;
    c=c.replace(/module\\.exports\\s*=\\s*/g,\"export default \");
    if(!/export default/m.test(c)) c=\"export default \"+c;
    fs.writeFileSync(p,c);
  };
  ensureESM(\"tailwind.config.js\",\"export default { content: ['./app/**/*.{js,ts,jsx,tsx}'], theme:{extend:{}}, plugins:[] }\");
  ensureESM(\"postcss.config.js\",\"export default { plugins:{ tailwindcss:{}, autoprefixer:{} } }\");
  console.log(\"✅ Patched tailwind/postcss to ESM\");
"

# 4) Minimal app files (overwrites these four intentionally)
mkdir -p app app/api/health app/api/classify
[ -f app/globals.css ] || cat > app/globals.css <<\"CSS\"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --brand:#0ea5e9; }
body { background:#fafafa; color:#0f172a; font-family: ui-sans-serif, system-ui; }
CSS

cat > app/layout.tsx <<\"TSX\"
import \"./globals.css\";
export const metadata = { title: \"SIFT — demo\", description: \"Spam & scam filter demo\" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang=\"en\"><body>{children}</body></html>;
}
TSX

cat > app/page.tsx <<\"TSX\"
'use client';
import { useState } from 'react';
export default function Page(){
  const [text,setText]=useState(''); const [score,setScore]=useState<number|null>(null); const [err,setErr]=useState<string>();
  async function onSubmit(e:React.FormEvent){e.preventDefault(); setErr(undefined); setScore(null);
    try{ const r=await fetch('/api/classify',{method:'POST',body:text}); const j=await r.json(); setScore(j.spamScore);}catch(e:any){setErr(String(e?.message||e));}}
  return (<main style={{maxWidth:900,margin:'40px auto',padding:'16px'}}>
    <h1 style={{fontSize:28,fontWeight:800,letterSpacing:.5}}>SIFT</h1>
    <p style={{margin:'6px 0 12px'}}>spam & scam filter demo</p>
    <form onSubmit={onSubmit}>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder=\"Paste an email or message...\" rows={6} style={{width:'100%',padding:12}}/>
      <button type=\"submit\" style={{marginTop:10,padding:'8px 12px',border:'1px solid var(--brand)'}}>Classify</button>
      <a href=\"/api/health\" style={{marginLeft:12}}>Health</a>
    </form>
    {err && <p style={{color:'crimson'}}>Error: {err}</p>}
    {score!=null && <p style={{marginTop:10}}>Spam score: {(score*100).toFixed(1)}%</p>}
  </main>);
}
TSX

cat > app/api/health/route.ts <<\"TS\"
export async function GET(){ return new Response('ok',{status:200}); }
TS

cat > app/api/classify/route.ts <<\"TS\"
export async function POST(req: Request){
  const text = (await req.text() || '').toLowerCase();
  const bad = ['viagra','free money','casino','crypto','loan','winner','xxx','click here'];
  const hit = bad.some(w=>text.includes(w));
  const base = Math.min(0.98, text.length/800);
  const noise = (Math.random()-0.5)*0.1;
  const spamScore = Math.max(0, Math.min(1, (hit?0.6:0.15) + base*0.4 + noise));
  return Response.json({ spamScore });
}
TS

# 5) Clean install & start
rm -rf node_modules .next package-lock.json pnpm-lock.yaml yarn.lock
npm install
npx next@15 dev -p 3000
'
