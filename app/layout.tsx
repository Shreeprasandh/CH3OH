import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CH3OH — Next-Generation Shared Expense, Asset & Mobility Ledger",
  description: "Minimal, elegant, and tactile expense splitting with bike telemetry and 3D wall calendar.",
  icons: {
    icon: "/logo/logowithouttextandbg.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F2EB] text-[#1C241B] antialiased selection:bg-[#8B9A6E]/20 selection:text-[#1C241B]">
        {children}
      </body>
    </html>
  );
}
