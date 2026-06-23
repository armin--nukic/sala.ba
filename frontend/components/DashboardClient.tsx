"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CreditCard, Edit3, Mail, Plus, Save, ShieldCheck, Sparkles, UserRound, WalletCards, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import type { Venue } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

type Tab = "overview" | "venues" | "calendar" | "crm" | "billing";

const fallbackVenues: Venue[] = [
  {
    id: "demo-wedding",
    name: "Crystal Wedding Hall",
    slug: "crystal-wedding-hall",
    description: "Elegantna sala za vjencanja sa premium rasvjetom, velikim plesnim podijem i wedding paketima.",
    city: "Sarajevo",
    address: "Zmaja od Bosne 12",
    category: "Wedding",
    capacity: 420,
    priceFrom: 3200,
    phone: "+387 61 111 222",
    email: "crystal@sala.ba",
    imageUrl: "/images/hero-event-hall.png",
    isFeatured: true,
    isActive: true,
    galleryImages: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-sport",
    name: "Arena Sport Centar",
    slug: "arena-sport-centar",
    description: "Sportska dvorana za treninge, turnire, rekreativne lige i skolske evente.",
    city: "Tuzla",
    address: "Sportska 7",
    category: "Sport",
    capacity: 900,
    priceFrom: 120,
    phone: "+387 62 333 444",
    email: "arena@sala.ba",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80",
    isFeatured: true,
    isActive: true,
    galleryImages: [],
    createdAt: new Date().toISOString()
  }
];

export function DashboardClient() {
  const { user, token } = useAuth();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [venues, setVenues] = useState<Venue[]>(fallbackVenues);
  const [selectedVenueId, setSelectedVenueId] = useState(fallbackVenues[0].id);
  const [selectedDate, setSelectedDate] = useState(() => nextDate(2));
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.venues("?category=Wedding")
      .then((response) => {
        const merged = response.venues.length ? response.venues : fallbackVenues;
        setVenues(merged);
        setSelectedVenueId(merged[0]?.id ?? fallbackVenues[0].id);
      })
      .catch(() => setVenues(fallbackVenues));
  }, []);

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === selectedVenueId) ?? venues[0] ?? fallbackVenues[0],
    [selectedVenueId, venues]
  );

  const upcomingBookings = [
    { venue: selectedVenue.name, date: selectedDate, time: selectedTime, status: "PENDING" },
    { venue: "Arena Sport Centar", date: nextDate(5), time: "20:00", status: "APPROVED" },
    { venue: "Hotel Hills Grand Ballroom", date: nextDate(12), time: "17:00", status: "PENDING" }
  ];

  const cards: Array<[string, string, LucideIcon]> = [
    [t.activeInquiries, "8", Mail],
    [t.bookings, String(upcomingBookings.length), CalendarDays],
    [t.crmTasks, "3", WalletCards],
    ["Role", user?.role ?? "DEMO", UserRound]
  ];

  function saveLocalEdit() {
    if (!editingVenue) return;
    setVenues((current) => current.map((venue) => (venue.id === editingVenue.id ? editingVenue : venue)));
    setNotice(lang === "bs" ? `${editingVenue.name} je azurirana u dashboard previewu.` : `${editingVenue.name} was updated in the dashboard preview.`);
    setEditingVenue(null);
  }

  async function startProCheckout() {
    if (!token) {
      setNotice(lang === "bs" ? "Prijavi se da aktiviras Pro paket." : "Log in to activate the Pro plan.");
      return;
    }

    try {
      const result = await api.checkoutPro(token);
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setNotice(result.message ?? (lang === "bs" ? "Stripe demo mod je aktivan." : "Stripe demo mode is active."));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Checkout failed");
    }
  }

  return (
    <section className="section dashboard-section">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1 className="title">{t.dashboardWelcome}, {user?.name ?? (lang === "bs" ? "demo korisnice" : "demo user")}</h1>
            <p className="lead">{t.dashboardLead}</p>
          </div>
          <Link href="/admin" className="btn btn-primary"><Plus size={18} /> {t.addVenue}</Link>
        </div>

        <div className="dashboard-hero glass">
          <div className="dashboard-visual" aria-hidden="true" />
          <div className="dashboard-hero-copy">
            <span className="eyebrow">{lang === "bs" ? "Novi CRM pogled" : "New CRM view"}</span>
            <h2>{lang === "bs" ? "Termini, sale i paketi na jednom mjestu" : "Bookings, venues and plans in one place"}</h2>
            <p>{lang === "bs" ? "Night mode sada cuva kontrast, a Pro paket je spreman za Stripe checkout." : "Dark mode now keeps contrast, and the Pro plan is ready for Stripe checkout."}</p>
          </div>
        </div>

        <div className="dashboard-tabs" role="tablist" aria-label="Dashboard tabs">
          {[
            ["overview", t.overview],
            ["venues", t.venues],
            ["calendar", t.calendar],
            ["crm", t.crm],
            ["billing", lang === "bs" ? "Paketi" : "Plans"]
          ].map(([key, label]) => (
            <button
              className={activeTab === key ? "active" : ""}
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {notice && <p className="dashboard-notice">{notice}</p>}

        {activeTab === "overview" && (
          <>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", marginTop: 24 }}>
              {cards.map(([label, value, Icon]) => (
                <div className="metric-card glass" key={String(label)}>
                  <Icon color="var(--brand)" />
                  <p>{String(label)}</p>
                  <h2>{String(value)}</h2>
                </div>
              ))}
            </div>
            <div className="dashboard-split">
              <DashboardPanel title={t.nextBooking}>
                <strong>{selectedVenue.name}</strong>
                <p>{new Date(selectedDate).toLocaleDateString("bs-BA")} · {selectedTime}</p>
                <Link href={`/sale/${selectedVenue.slug}#termin`} className="btn btn-primary">{t.bookSlot}</Link>
              </DashboardPanel>
              <DashboardPanel title={t.userProfile}>
                <p><strong>Email:</strong> {user?.email ?? "demo@sala.ba"}</p>
                <p><strong>{t.phone}:</strong> {user?.phone ?? (lang === "bs" ? "Nije unesen" : "Not added")}</p>
                {!user && <Link href="/login" className="btn btn-ghost">{t.login}</Link>}
              </DashboardPanel>
            </div>
          </>
        )}

        {activeTab === "venues" && (
          <div className="dashboard-venue-list">
            {venues.slice(0, 8).map((venue) => (
              <article className="venue-row glass" key={venue.id}>
                <div>
                  <span className="badge">{venue.category}</span>
                  <h3>{venue.name}</h3>
                  <p>{venue.city} · {venue.capacity} {lang === "bs" ? "kapacitet" : "capacity"} · od {Number(venue.priceFrom).toLocaleString("bs-BA")} KM</p>
                </div>
                <div className="row-actions">
                  <Link className="btn btn-ghost" href={`/sale/${venue.slug}`}>{t.details}</Link>
                  <button className="btn btn-primary" onClick={() => setEditingVenue(venue)} type="button"><Edit3 size={17} /> {t.edit}</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="calendar-board glass">
            <div>
              <span className="eyebrow">{lang === "bs" ? "Odaberi salu" : "Choose venue"}</span>
              <select value={selectedVenueId} onChange={(event) => setSelectedVenueId(event.target.value)}>
                {venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
              </select>
              <label className="field"><span>{t.eventDate}</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
              <div className="slot-strip">
                {["10:00", "12:00", "15:00", "18:00", "20:00"].map((slot) => (
                  <button className={selectedTime === slot ? "slot-chip active" : "slot-chip"} key={slot} onClick={() => setSelectedTime(slot)} type="button">
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="eyebrow">{lang === "bs" ? "Termini" : "Slots"}</span>
              {upcomingBookings.map((booking) => (
                <div className="booking-row" key={`${booking.venue}-${booking.date}-${booking.time}`}>
                  <CheckCircle2 size={18} color={booking.status === "APPROVED" ? "var(--brand)" : "var(--gold)"} />
                  <span>{booking.venue}</span>
                  <strong>{new Date(booking.date).toLocaleDateString("bs-BA")} · {booking.time}</strong>
                  <em>{booking.status}</em>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "crm" && (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 24 }}>
            {(lang === "bs"
              ? ["Pozvati mladence za dekoraciju", "Poslati ponudu za futsal turnir", "Potvrditi avans za Hotel Hills"]
              : ["Call wedding clients about decor", "Send offer for futsal tournament", "Confirm deposit for Hotel Hills"]
            ).map((task, index) => (
              <div className="glass task-card" key={task}>
                <span>CRM #{index + 1}</span>
                <h3>{task}</h3>
                <p>{lang === "bs" ? "Rok" : "Due"}: {new Date(nextDate(index + 1)).toLocaleDateString("bs-BA")}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="pricing-grid">
            <PricingCard
              icon={<ShieldCheck size={24} />}
              title="Free"
              price="0 KM"
              text={lang === "bs" ? "Za korisnike koji rezervisu i testiraju platformu." : "For users who book and test the platform."}
              features={lang === "bs" ? ["Pregled sala", "Rezervacija termina", "Osnovni dashboard"] : ["Browse venues", "Book slots", "Basic dashboard"]}
              action={<button className="btn btn-ghost" type="button">{lang === "bs" ? "Aktivno" : "Active"}</button>}
            />
            <PricingCard
              featured
              icon={<Sparkles size={24} />}
              title="Pro"
              price="5 KM"
              suffix={lang === "bs" ? "/ mjesec" : "/ month"}
              text={lang === "bs" ? "Za vlasnike sala koji zele CRM, bolju vidljivost i Stripe naplatu." : "For venue owners who want CRM, visibility and Stripe billing."}
              features={lang === "bs" ? ["Izdvojena sala", "CRM upiti i statusi", "Prioritet u listama", "Stripe checkout"] : ["Featured venue", "CRM inquiries and statuses", "Priority listings", "Stripe checkout"]}
              action={<button className="btn btn-primary" onClick={startProCheckout} type="button"><CreditCard size={18} /> {lang === "bs" ? "Aktiviraj Pro" : "Activate Pro"}</button>}
            />
          </div>
        )}

        {editingVenue && (
          <div className="edit-drawer glass" role="dialog" aria-modal="true" aria-label="Edituj salu">
            <div className="dashboard-head">
              <div>
                <span className="eyebrow">{lang === "bs" ? "Edit sala" : "Edit venue"}</span>
                <h2>{editingVenue.name}</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => setEditingVenue(null)} type="button">{lang === "bs" ? "Zatvori" : "Close"}</button>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
              <EditField label={lang === "bs" ? "Naziv" : "Name"} value={editingVenue.name} onChange={(value) => setEditingVenue({ ...editingVenue, name: value })} />
              <EditField label={lang === "bs" ? "Grad" : "City"} value={editingVenue.city} onChange={(value) => setEditingVenue({ ...editingVenue, city: value })} />
              <EditField label={lang === "bs" ? "Kapacitet" : "Capacity"} type="number" value={String(editingVenue.capacity)} onChange={(value) => setEditingVenue({ ...editingVenue, capacity: Number(value) })} />
              <EditField label={lang === "bs" ? "Cijena od" : "Price from"} type="number" value={String(editingVenue.priceFrom)} onChange={(value) => setEditingVenue({ ...editingVenue, priceFrom: Number(value) })} />
            </div>
            <label className="field" style={{ marginTop: 14 }}>
              <span>{lang === "bs" ? "Opis" : "Description"}</span>
              <textarea value={editingVenue.description} onChange={(event) => setEditingVenue({ ...editingVenue, description: event.target.value })} />
            </label>
            <button className="btn btn-primary" onClick={saveLocalEdit} type="button"><Save size={18} /> {lang === "bs" ? "Sacuvaj izmjene" : "Save changes"}</button>
          </div>
        )}
      </div>
    </section>
  );
}

function DashboardPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass dashboard-panel">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function PricingCard({ icon, title, price, suffix, text, features, action, featured }: { icon: ReactNode; title: string; price: string; suffix?: string; text: string; features: string[]; action: ReactNode; featured?: boolean }) {
  return (
    <article className={featured ? "pricing-card pricing-card-featured glass" : "pricing-card glass"}>
      <div className="pricing-icon">{icon}</div>
      <h3>{title}</h3>
      <div className="pricing-price"><strong>{price}</strong>{suffix && <span>{suffix}</span>}</div>
      <p>{text}</p>
      <ul>
        {features.map((feature) => <li key={feature}><CheckCircle2 size={16} /> {feature}</li>)}
      </ul>
      {action}
    </article>
  );
}

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function nextDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}
