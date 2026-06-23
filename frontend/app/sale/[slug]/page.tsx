import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Phone, Users } from "lucide-react";
import { api } from "@/lib/api";
import { InquiryForm } from "@/components/InquiryForm";
import { ReviewsForum } from "@/components/ReviewsForum";

export default async function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await api.venue(slug).catch(() => null);
  if (!data) notFound();
  const { venue } = data;

  const mapQuery = encodeURIComponent(`${venue.name} ${venue.address} ${venue.city} Bosnia and Herzegovina`);

  return (
    <section className="section">
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1.15fr) minmax(310px, .85fr)", alignItems: "start" }}>
          <article>
            <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden" }}>
            <Image src={venue.imageUrl} alt={`${venue.name} interior`} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 24 }}>
              <span className="badge">{venue.category}</span>
              <h1 className="title">{venue.name}</h1>
              <p className="lead">{venue.description}</p>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><MapPin /> {venue.city}, {venue.address}</div>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Users /> {venue.capacity} gostiju</div>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Phone /> {venue.phone}</div>
              </div>
              <div className="glass" style={{ borderRadius: 8, padding: 16, marginTop: 20 }}>
                <h2>Google mapa</h2>
                <iframe
                  className="map-frame"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  title={`Mapa za ${venue.name}`}
                />
              </div>
            </div>
          </article>
          <InquiryForm venueId={venue.id} />
        </div>
        <ReviewsForum venueId={venue.id} city={venue.city} />
      </div>
    </section>
  );
}
