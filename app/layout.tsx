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
      <body className={`${sora.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
