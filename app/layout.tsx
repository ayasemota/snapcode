import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnapCode - QR Code Generator',
  description: 'Generate QR codes for URLs, text, and contact information instantly',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}