import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chalk – Prove your teaching impact",
  description: "Record lessons. AI tracks student growth. Your teaching becomes provable evidence for marketing.",
  keywords: ["tutoring", "teaching", "education", "student progress", "tutor marketing", "proof of results"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
