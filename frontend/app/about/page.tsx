import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About sala.ba - Premium venue platform",
  description: "sala.ba is a bilingual marketplace and CRM for venues, bookings and event inquiries."
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container glass" style={{ borderRadius: 8, padding: 32 }}>
        <span className="eyebrow">BS / EN</span>
        <h1 className="title">O nama / About sala.ba</h1>
        <p className="lead">sala.ba je nova platforma za pronalazak, upite i upravljanje salama za vjenčanja, sport, konferencije i proslave.</p>
        <p className="lead">sala.ba is a modern marketplace and lightweight CRM for venues, bookings and event operations.</p>
      </div>
    </section>
  );
}
