import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3111"),
  title: {
    default: "sala.ba - Sale za svadbe, sport i dogadjaje",
    template: "%s | sala.ba"
  },
  description: "Pronadji idealnu salu za svadbu, sport, proslave i dogadjaje u Bosni i Hercegovini.",
  keywords: [
    "sale za vjencanja",
    "sport sale",
    "rezervacija sale",
    "event prostor",
    "sala.ba",
    "Bosna i Hercegovina",
    "dijaspora rezervacije"
  ],
  authors: [{ name: "sala.ba" }],
  openGraph: {
    title: "sala.ba - Marketplace i CRM za sale",
    description: "Premium marketplace za sale, termine, rezervacije i vlasnike prostora.",
    url: "/",
    siteName: "sala.ba",
    images: [{ url: "/images/hero-event-hall.png", width: 1600, height: 900, alt: "Premium event sala" }],
    locale: "bs_BA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "sala.ba - Sale za svadbe, sport i dogadjaje",
    description: "Brza pretraga sala, rezervacije termina i CRM za vlasnike prostora.",
    images: ["/images/hero-event-hall.png"]
  },
  alternates: {
    canonical: "/",
    languages: {
      bs: "/",
      en: "/?lang=en"
    }
  },
  icons: {
    icon: "/logo-sala.svg",
    apple: "/logo-sala.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
