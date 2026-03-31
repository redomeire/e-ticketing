import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/cn";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import QueryClientProviderWrapper from "@/providers/QueryClientProvider";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Ticketing System",
  description: "A comprehensive e-ticketing system built with Next.js NextAuth for seamless event management and ticket sales."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryClientProviderWrapper>
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </QueryClientProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
