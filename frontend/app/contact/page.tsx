import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact sala.ba",
  description: "Kontaktirajte sala.ba tim ili pošaljite upit za saradnju i rezervacije."
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container grid" style={{ gridTemplateColumns: "minmax(0, .9fr) minmax(320px, 1.1fr)", alignItems: "start" }}>
        <div>
          <span className="eyebrow">Contact</span>
          <h1 className="title">Pošalji poruku / Send a message</h1>
          <p className="lead">Kontakt forma sprema poruke u PostgreSQL bazu i dostupna je admin timu.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
