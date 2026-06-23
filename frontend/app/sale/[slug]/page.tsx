import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Dumbbell, MapPin, Navigation, Phone, Users } from "lucide-react";
import { api } from "@/lib/api";
import { InquiryForm } from "@/components/InquiryForm";
import { ReviewsForum } from "@/components/ReviewsForum";

const fallbackImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await api.venue(slug).catch(() => null);
  if (!data) return { title: "Sala nije pronadjena | sala.ba" };
  const { venue } = data;
  return {
    title: `${venue.name} ${venue.city} | sala.ba`,
    description: venue.description,
    openGraph: {
      title: `${venue.name} ${venue.city}`,
      description: venue.description,
      images: [venue.imageUrl || fallbackImage],
      type: "website"
    }
  };
}

export default async function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await api.venue(slug).catch(() => null);
  if (!data) notFound();
  const { venue } = data;
  const gallery = [venue.imageUrl || fallbackImage, ...(venue.galleryImages ?? [])].filter(Boolean);
  const lat = venue.latitude == null ? null : Number(venue.latitude);
  const lng = venue.longitude == null ? null : Number(venue.longitude);

  const mapQuery = lat != null && lng != null ? `${lat},${lng}` : encodeURIComponent(`${venue.name} ${venue.address} ${venue.city} Bosnia and Herzegovina`);
  const schema = {
    "@context": "https://schema.org",
    "@type": venue.category === "Sport" ? "SportsActivityLocation" : "LocalBusiness",
    name: venue.name,
    description: venue.description,
    image: gallery,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressCountry: "BA"
    },
    telephone: venue.phone,
    email: venue.email,
    url: `/sale/${venue.slug}`,
    geo: lat != null && lng != null ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng } : undefined,
    openingHours: venue.workingHours
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container">
        <div className="grid venue-detail-grid">
          <article>
            <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden" }}>
            <Image src={gallery[0]} alt={`${venue.name} interior`} fill priority sizes="100vw" style={{ objectFit: "cover" }} unoptimized />
            </div>
            {gallery.length > 1 && (
              <div className="image-preview-grid" style={{ marginTop: 14 }}>
                {gallery.slice(1, 5).map((image) => (
                  <div key={image} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden" }}>
                    <Image src={image} alt={`${venue.name} gallery`} fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: "cover" }} unoptimized />
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 24 }}>
              <span className="badge">{venue.category}</span>
              <h1 className="title">{venue.name}</h1>
              <p className="lead">{venue.description}</p>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><MapPin /> {venue.city}, {venue.address}</div>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Users /> {venue.capacity} gostiju</div>
                <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Phone /> {venue.phone}</div>
                {venue.workingHours && <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Clock /> {venue.workingHours}</div>}
                {venue.sports?.length ? <div className="glass" style={{ borderRadius: 8, padding: 18 }}><Dumbbell /> {venue.sports.join(", ")}</div> : null}
              </div>
              <div className="glass" style={{ borderRadius: 8, padding: 16, marginTop: 20 }}>
                <h2>Google mapa</h2>
                {venue.googleMapsUrl && <a className="btn btn-ghost" href={venue.googleMapsUrl} target="_blank" rel="noreferrer"><Navigation size={17} /> Otvori u Google Maps</a>}
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
