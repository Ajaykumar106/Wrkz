import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WRKZ — Work that finds you | Verified freelance marketplace India",
  description: "Verified freelancers in video editing, AI, design. Escrow UPI payout in 30s. AI matches top 5, no spam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#FCFCFD] text-[#0A0A0A] selection:bg-black selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
