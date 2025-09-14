
export const metadata = {
  title: "SIFT — spam & scam filter",
  description: "Fast, clean, branded demo for Sift.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
