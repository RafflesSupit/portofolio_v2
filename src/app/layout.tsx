import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/ui/cursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
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

const noFlashScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
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
