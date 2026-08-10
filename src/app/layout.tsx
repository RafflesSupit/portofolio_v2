import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/ui/cursor";
import "./globals.css";

// Serif display face — free stand-in for PP Migra (the reference's paid
// heading typeface). Pairs a sans body with a serif display, the actual
// character of the estrela.studio reference, instead of an all-sans pairing.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://rafflessupit.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Raffles Supit - Backend Engineer",
  description:
    "Backend Engineer focused on scalable, secure microservices - RESTful APIs, distributed systems, and cloud-ready architecture with Laravel, Spring Boot, and Python.",
  keywords: [
    "Raffles Supit",
    "Backend Engineer",
    "Microservices",
    "Laravel",
    "Spring Boot",
    "PostgreSQL",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Raffles Supit" }],
  openGraph: {
    title: "Raffles Supit - Backend Engineer",
    description:
      "Backend Engineer focused on scalable, secure microservices - RESTful APIs, distributed systems, and cloud-ready architecture.",
    url: siteUrl,
    siteName: "Raffles Supit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raffles Supit - Backend Engineer",
    description:
      "Backend Engineer focused on scalable, secure microservices - RESTful APIs, distributed systems, and cloud-ready architecture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-bg focus:text-body-sm"
        >
          Skip to content
        </a>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
