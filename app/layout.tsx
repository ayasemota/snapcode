import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapCode - QR Code Generator",
  description:
    "Generate QR codes for URLs, text, and contact information instantly",
  manifest: "/manifest.json",
  themeColor: "#9333ea",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SnapCode",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}