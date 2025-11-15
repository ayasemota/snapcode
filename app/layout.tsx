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
  openGraph: {
    title: "SnapCode - QR Code Generator",
    description:
      "Generate QR codes for URLs, text, and contact information instantly",
    url: "https://yourdomain.com",
    siteName: "SnapCode",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapCode - QR Code Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapCode - QR Code Generator",
    description:
      "Generate QR codes for URLs, text, and contact information instantly",
    images: ["/og-image.png"],
    creator: "@ayasemota",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
