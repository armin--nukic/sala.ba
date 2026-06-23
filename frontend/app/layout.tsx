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
    default: "sala.ba - Sale za vjencanja, sport i evente",
    template: "%s | sala.ba"
  },
  description: "Pronadji idealnu salu za vjencanje, sport, proslave, konferencije i dijaspora dogadjaje u Bosni i Hercegovini.",
  keywords: [
    "sale za vjencanja",
    "sale za svadbe",
    "sport sale",
    "sportske dvorane",
    "rezervacija sale",
    "event prostor",
    "sala.ba",
    "sala ice lol",
    "Bosna i Hercegovina",
    "dijaspora rezervacije",
    "Sarajevo sale",
    "Mostar sale",
    "Tuzla sale"
  ],
  applicationName: "sala.ba",
  creator: "sala.ba",
  publisher: "sala.ba",
  category: "events",
  authors: [{ name: "sala.ba" }],
  openGraph: {
    title: "sala.ba - Marketplace za sale i termine",
    description: "Pretraga sala, rezervacije termina i CRM za vlasnike prostora u BiH.",
    url: "/",
    siteName: "sala.ba",
    images: [{ url: "/images/hero-marketplace-v2.png", width: 1600, height: 900, alt: "sala.ba marketplace za event prostore" }],
    locale: "bs_BA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "sala.ba - Sale za vjencanja, sport i evente",
    description: "Brza pretraga sala, rezervacije termina i CRM za vlasnike prostora.",
    images: ["/images/hero-marketplace-v2.png"]
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
