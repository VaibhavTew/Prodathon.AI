import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/format";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Prodathon — The AI Hackathon for College Students", template: "%s · Prodathon" },
  description:
    "Free AI hackathon for college students. Register free, level up with live Zoom workshops, then build something real and compete to win.",
  keywords: ["AI hackathon", "student hackathon", "college hackathon", "AI workshops", "learn AI", "Prodathon"],
  openGraph: {
    type: "website",
    siteName: "Prodathon",
    title: "Prodathon — The AI Hackathon for College Students",
    description: "Register free. Learn live in optional workshops. Build & compete.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F7F7FB", width: "device-width", initialScale: 1 };

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal animations only when JS runs; falls back to visible content after 2.5s if hydration stalls. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-hydrated'))d.classList.remove('js')},2500);",
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn-primary btn-sm">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer site={content.site} />
      </body>
    </html>
  );
}
