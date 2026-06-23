"use client";

import type { CSSProperties } from "react";
import { CalendarCheck, Clock3, MapPinned, Sparkles, Trophy, UsersRound } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { VenueCard } from "@/components/VenueCard";
import type { Venue } from "@/lib/types";

const copy = {
  bs: {
    Wedding: {
      title: "Sale za vjencanja",
      text: "Elegantne sale za svadbe, gala vecere i kompletne wedding pakete.",
      ribbon: "Wedding edit",
      features: ["Dekoracija i rasvjeta", "Meni po osobi", "Dijaspora video obilazak"],
      flow: ["Odaberi salu", "Posalji datum svadbe", "Vlasnik potvrdi termin"]
    },
    Sport: {
      title: "Sport sale",
      text: "Sportske dvorane i centri za treninge, turnire i rekreativne lige.",
      ribbon: "Tournament ready",
      features: ["Termini po satu", "Tribine i svlacionice", "Turniri i lige"],
      flow: ["Izaberi dvoranu", "Rezervisi satnicu", "Admin odobri termin"]
    },
    Diaspora: {
      title: "Dijaspora rezervacije",
      text: "Prostori sa jasnom komunikacijom i upitima za goste koji rezervisu iz inostranstva.",
      ribbon: "Book from abroad",
      features: ["Online upit", "Brz odgovor vlasnika", "Jasni paketi"],
      flow: ["Posalji upit", "Dogovori video obilazak", "Zakljucaj datum"]
    }
  },
  en: {
    Wedding: {
      title: "Wedding halls",
      text: "Elegant halls for weddings, gala dinners and complete celebration packages.",
      ribbon: "Wedding edit",
      features: ["Decor and lighting", "Price per person", "Diaspora video tour"],
      flow: ["Pick a venue", "Send wedding date", "Owner confirms slot"]
    },
    Sport: {
      title: "Sport halls",
      text: "Sports halls and centers for training, tournaments and recreational leagues.",
      ribbon: "Tournament ready",
      features: ["Hourly slots", "Stands and locker rooms", "Tournaments and leagues"],
      flow: ["Choose a hall", "Request time slot", "Admin approves booking"]
    },
    Diaspora: {
      title: "Diaspora bookings",
      text: "Venues with clear communication and inquiries for guests booking from abroad.",
      ribbon: "Book from abroad",
      features: ["Online inquiry", "Fast owner response", "Clear packages"],
      flow: ["Send inquiry", "Arrange video tour", "Lock the date"]
    }
  }
} as const;

const visual = {
  Wedding: {
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
    accent: "#be123c"
  },
  Sport: {
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    accent: "#2563eb"
  },
  Diaspora: {
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1400&q=80",
    accent: "#0f766e"
  }
} satisfies Record<"Wedding" | "Sport" | "Diaspora", { image: string; accent: string }>;

export function CategoryClient({ category, venues }: { category: "Wedding" | "Sport" | "Diaspora"; venues: Venue[] }) {
  const { lang } = useLanguage();
  const page = copy[lang][category];
  const theme = visual[category];
  const icons = [Sparkles, CalendarCheck, MapPinned, Trophy, UsersRound];

  return (
    <section className="category-section">
      <div className="container">
        <div className="category-hero">
          <div>
            <span className="eyebrow pill">{category}</span>
            <h1 className="title">{page.title}</h1>
            <p className="lead">{page.text}</p>
            <div className="ribbon-row">
              <span className="special-ribbon" style={{ "--ribbon": theme.accent } as CSSProperties}>
                {page.ribbon}
              </span>
              <span className="special-ribbon muted-ribbon">{lang === "bs" ? "Rezervisi termin" : "Book a slot"}</span>
              <span className="special-ribbon muted-ribbon">{lang === "bs" ? "Google mapa" : "Google map"}</span>
            </div>
          </div>
          <div
            className="category-photo glass"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(17,24,39,.08), rgba(15,118,110,.16)), url(${theme.image})`
            }}
          >
            <div className="photo-ribbon" style={{ background: theme.accent }}>
              {venues.length} {lang === "bs" ? "prostora" : "venues"}
            </div>
          </div>
        </div>

        <div className="category-features">
          {page.features.map((feature, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <div className="mini-feature glass" key={feature}>
                <Icon size={21} color={theme.accent} />
                <span>{feature}</span>
              </div>
            );
          })}
        </div>

        <div className="booking-flow glass">
          {page.flow.map((step, index) => (
            <div key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
          <div>
            <Clock3 color={theme.accent} />
            <strong>{lang === "bs" ? "Status: PENDING dok vlasnik ne potvrdi" : "Status: PENDING until owner confirms"}</strong>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", marginTop: 24 }}>
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
        {venues.length === 0 && (
          <div className="glass" style={{ borderRadius: 8, padding: 24, marginTop: 24 }}>
            {lang === "bs" ? "Jos nema unesenih prostora za ovu kategoriju." : "No venues have been added for this category yet."}
          </div>
        )}
      </div>
    </section>
  );
}
