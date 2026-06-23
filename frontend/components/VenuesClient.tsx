"use client";

import { VenueCard } from "@/components/VenueCard";
import { useLanguage } from "@/components/LanguageProvider";
import type { Venue } from "@/lib/types";

export function VenuesClient({ venues, q, category }: { venues: Venue[]; q?: string; category?: string }) {
  const { lang } = useLanguage();
  const copy = lang === "bs"
    ? {
        eyebrow: "Pretraga i filter",
        title: "Sale i prostori",
        placeholder: "Grad, naziv, opis...",
        all: "Sve kategorije",
        search: "Pretrazi",
        map: "Mapa po gradovima",
        cities: "Sarajevo, Mostar, Tuzla, Banja Luka i Zenica",
        empty: "Nema rezultata za odabrani filter."
      }
    : {
        eyebrow: "Search and filter",
        title: "Venues and spaces",
        placeholder: "City, name, description...",
        all: "All categories",
        search: "Search",
        map: "City map",
        cities: "Sarajevo, Mostar, Tuzla, Banja Luka and Zenica",
        empty: "No results for the selected filter."
      };

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="title">{copy.title}</h1>
        <form className="glass venue-filter">
          <input name="q" placeholder={copy.placeholder} defaultValue={q} />
          <select name="category" defaultValue={category ?? ""}>
            <option value="">{copy.all}</option>
            <option value="Wedding">{lang === "bs" ? "Vjencanja" : "Wedding"}</option>
            <option value="Sport">Sport</option>
            <option value="Celebration">{lang === "bs" ? "Proslave" : "Celebration"}</option>
            <option value="Diaspora">{lang === "bs" ? "Dijaspora" : "Diaspora"}</option>
            <option value="Conference">{lang === "bs" ? "Konferencije" : "Conference"}</option>
          </select>
          <button className="btn btn-primary">{copy.search}</button>
        </form>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
          {venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>
        {venues.length === 0 && <div className="glass" style={{ borderRadius: 8, padding: 22 }}>{copy.empty}</div>}
        <div className="glass" style={{ borderRadius: 8, padding: 20, marginTop: 28 }}>
          <span className="eyebrow">{copy.map}</span>
          <h2>{copy.cities}</h2>
          <iframe
            className="map-frame"
            loading="lazy"
            src="https://www.google.com/maps?q=event%20venues%20Bosnia%20and%20Herzegovina&output=embed"
            title={copy.map}
          />
        </div>
      </div>
    </section>
  );
}
