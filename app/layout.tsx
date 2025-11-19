import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { AppProvider } from "@/lib/AppContext";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ShuttleUNN - Campus Shuttle Payment",
  description: "University of Nigeria Nsukka shuttle payment and tracking system with NFC cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress MetaMask and other extension errors
              window.__NEXT_DISABLE_EXTENSION_ERRORS = true;
              const originalError = console.error;
              console.error = function(...args) {
                const errorStr = String(args[0] || '');
                // Ignore MetaMask and extension-related errors
                if (
                  errorStr.includes('MetaMask') ||
                  errorStr.includes('chrome-extension') ||
                  errorStr.includes('Failed to connect') ||
                  errorStr.includes('inpage.js')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className={`${sora.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
