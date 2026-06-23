"use client";

import Link from "next/link";
import { Dumbbell, MapPin, ParkingCircle, Search, ShowerHead, SlidersHorizontal, SunMedium } from "lucide-react";
import { VenueCard } from "@/components/VenueCard";
import type { PaginatedVenues } from "@/lib/types";

const sports = ["Fudbal", "Mali fudbal", "Košarka", "Odbojka", "Tenis", "Padel", "Fitness", "Multifunkcionalne dvorane"];
const cities = ["Sarajevo", "Mostar", "Tuzla", "Zenica", "Bihać", "Travnik", "Visoko", "Tešanj", "Bugojno", "Konjic", "Brčko", "Banja Luka", "Doboj", "Cazin", "Goražde"];

type Props = {
  data: PaginatedVenues;
  filters: Record<string, string | undefined>;
};

export function SportDirectoryClient({ data, filters }: Props) {
  const meta = data.meta;

  return (
    <section className="category-section sport-directory">
      <div className="container">
        <div className="category-hero sport-hero">
          <div>
            <span className="eyebrow pill">Sport sale</span>
            <h1 className="title">Direktorij sportskih objekata</h1>
            <p className="lead">Pretrazi terene, dvorane, fitness centre i multifunkcionalne prostore po gradu, sportu, cijeni i opremi.</p>
            <div className="ribbon-row">
              {sports.slice(0, 5).map((sport) => <span className="special-ribbon muted-ribbon" key={sport}>{sport}</span>)}
            </div>
          </div>
          <div
            className="category-photo glass"
            style={{ backgroundImage: "linear-gradient(135deg, rgba(17,24,39,.12), rgba(37,99,235,.2)), url(https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80)" }}
          >
            <div className="photo-ribbon" style={{ background: "#2563eb" }}>
              {meta?.total ?? data.venues.length} objekata
            </div>
          </div>
        </div>

        <form className="glass venue-filter sport-filter">
          <label>
            <span>Naziv</span>
            <input name="q" placeholder="Arena, centar, dvorana..." defaultValue={filters.q} />
          </label>
          <label>
            <span>Grad</span>
            <select name="city" defaultValue={filters.city ?? ""}>
              <option value="">Svi gradovi</option>
              {cities.map((city) => <option key={city}>{city}</option>)}
            </select>
          </label>
          <label>
            <span>Sport</span>
            <select name="sport" defaultValue={filters.sport ?? ""}>
              <option value="">Svi sportovi</option>
              {sports.map((sport) => <option key={sport}>{sport}</option>)}
            </select>
          </label>
          <label>
            <span>Max cijena</span>
            <input name="maxPrice" type="number" min="0" placeholder="npr. 100" defaultValue={filters.maxPrice} />
          </label>
          <label>
            <span>Sortiranje</span>
            <select name="sort" defaultValue={filters.sort ?? "featured"}>
              <option value="featured">Izdvojeno</option>
              <option value="price-asc">Cijena rastuce</option>
              <option value="price-desc">Cijena opadajuce</option>
              <option value="name">Naziv A-Z</option>
            </select>
          </label>
          <button className="btn btn-primary"><Search size={18} /> Pretrazi</button>
        </form>

        <div className="category-features sport-feature-grid">
          {sports.map((sport) => (
            <div className="mini-feature glass" key={sport}>
              <Dumbbell size={20} color="#2563eb" />
              <span>{sport}</span>
            </div>
          ))}
        </div>

        <div className="grid venue-grid">
          {data.venues.map((venue) => (
            <div className="sport-card-wrap" key={venue.id}>
              <VenueCard venue={venue} />
              <div className="sport-card-details glass">
                <span><MapPin size={16} /> {venue.address}</span>
                <span><SlidersHorizontal size={16} /> {venue.courtCount ?? 1} teren(a)</span>
                <span><ParkingCircle size={16} /> {venue.parking ? "Parking" : "Bez parkinga"}</span>
                <span><ShowerHead size={16} /> {venue.lockerRooms ? "Svlačionice" : "Upit za svlačionice"}</span>
                <span><SunMedium size={16} /> {venue.floodlights ? "Reflektori" : "Dnevni termini"}</span>
                <strong>{venue.workingHours ?? "Radno vrijeme na upit"}</strong>
              </div>
            </div>
          ))}
        </div>

        {data.venues.length === 0 && <div className="glass empty-state">Nema sportskih objekata za odabrane filtere.</div>}

        {meta && meta.totalPages > 1 && (
          <div className="pagination-row">
            {Array.from({ length: meta.totalPages }, (_, index) => {
              const page = index + 1;
              const params = new URLSearchParams();
              Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== "page") params.set(key, value);
              });
              params.set("page", String(page));
              return (
                <Link className={page === meta.page ? "btn btn-primary" : "btn btn-ghost"} href={`/sport-sale?${params.toString()}`} key={page}>
                  {page}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
