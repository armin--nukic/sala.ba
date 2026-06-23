"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState("");

  async function submit(formData: FormData) {
    setStatus("Sending...");
    try {
      await api.contact(Object.fromEntries(formData));
      setStatus("Poruka je spremljena. Javljamo se uskoro.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Greška pri slanju.");
    }
  }

  return (
    <form className="form glass" action={submit} style={{ borderRadius: 8, padding: 24 }}>
      <label className="field"><span>Ime</span><input name="name" required /></label>
      <label className="field"><span>Email</span><input type="email" name="email" required /></label>
      <label className="field"><span>Telefon</span><input name="phone" /></label>
      <label className="field">
        <span>Tip upita</span>
        <select name="type">
          <option value="GENERAL">General</option>
          <option value="WEDDING">Wedding</option>
          <option value="SPORT">Sport</option>
          <option value="DIASPORA">Diaspora</option>
          <option value="CONFERENCE">Conference</option>
        </select>
      </label>
      <label className="field"><span>Poruka</span><textarea name="message" required /></label>
      <button className="btn btn-primary" type="submit">Pošalji poruku</button>
      {status && <p>{status}</p>}
    </form>
  );
}
