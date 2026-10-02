import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "MR. INDIA 2026 — Rampage Gym | Bodybuilding Championship",
  description:
    "Mr. India 2026 by Rampage Gym. Bodybuilding (7 weight classes), Masters 35+, and Men's Physique. Register online with QR payment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${bebas.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15,15,20,0.95)",
              border: "1px solid rgba(245,185,66,0.3)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
