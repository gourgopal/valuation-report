import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SyncProvider } from "@/components/providers/SyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valuation PWA",
  description: "Offline-first Valuation Calculation Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  );
}
