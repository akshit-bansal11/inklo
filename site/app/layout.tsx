import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Lato } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE } from "@/lib/nav";
import "./globals.css";

/*
  Lato in three weights: 400 for reading, 700 for labels and buttons, 900 for titles.
  JetBrains Mono for what really is code or terminal output: commands, file paths.
*/
const sans = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans-family",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  display: "swap",
});

const TITLE = "Inklo — local, keyboard-first notes";
const DESCRIPTION =
  "Inklo keeps your notes as plain .md and .txt files in a folder you choose. No account, no sync, no network code. Windows, macOS and Linux. MIT.";

export const metadata: Metadata = {
  // Every relative URL in metadata (Open Graph, canonical) resolves against this.
  metadataBase: new URL(SITE),
  // The landing page's title is the default; app/docs/page.tsx overrides it. The
  // canonical link is each page's own, so a future page never inherits "/" by accident.
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Inklo",
  authors: [{ name: "akshit-bansal11" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Inklo",
  },
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Without JavaScript, motion never animates the blocks in: show them as they are. */}
      <head>
        <noscript>
          <style>
            {
              ".blur-fade{opacity:1!important;filter:none!important;transform:none!important}"
            }
          </style>
        </noscript>
      </head>
      <body className={`${mono.variable} ${sans.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
