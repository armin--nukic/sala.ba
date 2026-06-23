"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, Globe2, MapPinned, ShieldCheck, Sparkles, Star, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Venue } from "@/lib/types";
import { VenueCard } from "@/components/VenueCard";

export function HomeClient({ venues }: { venues: Venue[] }) {
  const { t } = useLanguage();
  const featureCards: Array<[string, string, LucideIcon]> = [
    ["Wedding halls", "Kurirana ponuda sala za vjenčanja, dekoraciju i kompletan event flow.", Sparkles],
    ["Sport halls", "Termini, turniri, treninzi i kapaciteti jasno prikazani za brzu odluku.", CalendarCheck],
    ["Diaspora bookings", "Upiti iz inostranstva, online dogovor i jednostavna komunikacija.", Globe2],
    ["Map search", "Google mapa po gradovima pomaže da odmah vidiš lokaciju i kvart.", MapPinned],
    ["Admin protected", "Role-based pristup za korisnike, vlasnike, admin i super admin tim.", ShieldCheck]
  ];

  return (
    <>
      <section className="hero-shell">
        <div className="hero-glow" />
        <div className="container hero-grid">
          <div>
            <motion.span className="eyebrow pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              Marketplace + CRM za event prostore
            </motion.span>
            <motion.h1
              className="display"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.heroTitle}
            </motion.h1>
            <p className="lead">{t.heroText}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/sale" className="btn btn-primary">{t.explore}</Link>
              <Link href="/dashboard" className="btn btn-ghost">{t.openDashboard}</Link>
            </div>
            <div className="hero-stats">
              <span><strong>14+</strong> demo lokacija</span>
              <span><strong>4.8</strong> prosjek recenzija</span>
              <span><strong>24h</strong> odgovor vlasnika</span>
            </div>
          </div>
          <div className="hero-media glass">
            <div className="hero-photo hero-photo-main" />
            <div className="hero-float hero-float-a">
              <Star size={18} fill="currentColor" /> 4.9 recenzije
            </div>
            <div className="hero-float hero-float-b">
              Rezerviši termin
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">{t.featured}</span>
          <h2 className="title">{t.ready}</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
            {venues.slice(0, 3).map((venue) => <VenueCard key={venue.id} venue={venue} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {featureCards.map(([title, text, Icon]) => (
            <div className="glass" style={{ borderRadius: 8, padding: 24 }} key={String(title)}>
              <Icon size={30} color="var(--brand)" />
              <h3>{String(title)}</h3>
              <p className="lead" style={{ fontSize: "1rem" }}>{String(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container glass" style={{ borderRadius: 8, padding: 32, textAlign: "center" }}>
          <span className="eyebrow">{t.why}</span>
          <h2 className="title">{t.whyTitle}</h2>
          <p className="lead">sala.ba spaja lijep marketplace sa praktičnim CRM panelom za timove koji prodaju termine.</p>
          <Link href="/register" className="btn btn-primary">{t.createAccount}</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Recenzije</span>
          <h2 className="title">Šta korisnici traže prije rezervacije</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {["Lokacija i parking su najvažniji za goste iz dijaspore.", "Kod sportskih termina nam treba brz pregled slobodnih datuma.", "Volimo kad odmah vidimo kapacitet, cijenu od i slike sale."].map((text, index) => (
              <div className="glass quote-card" key={text}>
                <div className="stars">★★★★★</div>
                <p>{text}</p>
                <strong>{["Amina, Sarajevo", "Emir, Tuzla", "Lejla, Mostar"][index]}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
