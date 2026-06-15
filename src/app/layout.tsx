import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { env } from "@/lib/env";
import "./globals.css";
import "./v0-surfaces.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
});

const monoSerifFallback = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-serif",
});

const v0Sans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const v0Mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const v0Display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Designers Hub",
    template: "%s | Designers Hub",
  },
  description:
    "Structured design community for discussions, critique, showcases, resources, and help threads.",
  openGraph: {
    type: "website",
    siteName: "Designers Hub",
    title: "Designers Hub",
    description:
      "Structured design community for discussions, critique, showcases, resources, and help threads.",
    url: env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Designers Hub",
    description:
      "Structured design community for discussions, critique, showcases, resources, and help threads.",
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
      suppressHydrationWarning
      className={cn(
        "font-sans",
        sans.variable,
        monoSerifFallback.variable,
        v0Sans.variable,
        v0Mono.variable,
        v0Display.variable,
      )}
    >
      <body className="antialiased">
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
