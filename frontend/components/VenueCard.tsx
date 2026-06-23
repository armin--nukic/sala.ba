"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, Edit3, Eye, MapPin, Star, Users } from "lucide-react";
import type { Venue } from "@/lib/types";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./VenueCard.module.css";

const ribbons: Record<string, string> = {
  Wedding: "Wedding paket",
  Sport: "Termini dostupni",
  Diaspora: "Online dogovor",
  Celebration: "Private party",
  Conference: "AV oprema",
  Other: "Custom event"
};

export function VenueCard({ venue }: { venue: Venue }) {
  const { t, lang } = useLanguage();

  return (
    <article className="card">
      <div className={styles.imageWrap}>
        <Image src={venue.imageUrl} alt={`${venue.name} venue photo`} fill sizes="(max-width: 768px) 100vw, 33vw" />
        {venue.isFeatured && <span className={styles.featured}>Featured</span>}
        <span className={styles.ribbon}>{ribbons[venue.category] ?? "Sala.ba pick"}</span>
      </div>
      <div className={styles.body}>
        <span className="badge">{venue.category}</span>
        <h3>{venue.name}</h3>
        <p>{venue.description}</p>
        <div className={styles.meta}>
          <span><MapPin size={16} /> {venue.city}</span>
          <span><Users size={16} /> {venue.capacity}</span>
          <span><Star size={16} fill="currentColor" /> 4.8</span>
        </div>
        <div className={styles.bottom}>
          <strong>{lang === "bs" ? "od" : "from"} {Number(venue.priceFrom).toLocaleString("bs-BA")} KM</strong>
          <div className={styles.actions}>
            <Link className="btn btn-ghost" href={`/sale/${venue.slug}`} title={t.details}>
              <Eye size={17} /> {t.details}
            </Link>
            <Link className="btn btn-primary" href={`/sale/${venue.slug}#termin`}>
              <CalendarPlus size={17} /> {t.bookSlot}
            </Link>
            <Link className={styles.iconAction} href={`/admin?edit=${venue.id}`} title={t.edit} aria-label={`${t.edit} ${venue.name}`}>
              <Edit3 size={17} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
