import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'NourishAI - AI-powered meal plans from what\'s already in your fridge',
  description: 'NourishAI generates personalized meal plans and recipes based on dietary restrictions, available ingredients, and nutritional goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
