import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gig Sahayak — Support for your workday",
  description: "Simple, practical AI support for Indian gig workers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
