import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saarthi (सारथी) — Daily Companion for Delivery Partners & Drivers",
  description:
    "Practical support for Indian gig workers: unfair account deactivations, earnings & petrol calculator, pay-slip audits, live location sharing, and government welfare schemes.",
  keywords: [
    "gig workers",
    "delivery partners",
    "zomato",
    "swiggy",
    "uber",
    "ola",
    "zepto",
    "blinkit",
    "e-shram",
    "worker rights",
  ],
};

export const viewport: Viewport = {
  themeColor: "#070A12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen selection:bg-emerald-500 selection:text-black font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
