"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Clock3, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export function InquiryForm({ venueId }: { venueId: string }) {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [status, setStatus] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [desiredTime, setDesiredTime] = useState("");

  const quickDates = nextDates();
  const slots = ["10:00", "12:00", "15:00", "18:00", "20:00"];

  async function submit(formData: FormData) {
    if (!user || !token) {
      setStatus(t.authRequiredTitle);
      return;
    }

    setStatus("Sending...");
    try {
      formData.set("venueId", venueId);
      formData.set("eventDate", eventDate);
      formData.set("desiredTime", desiredTime);
      await api.inquiry(Object.fromEntries(formData), token);
      setStatus(t.savedInquiry);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.sendError);
    }
  }

  return (
    <form id="termin" className="form glass booking-form" action={submit} style={{ borderRadius: 8, padding: 22 }}>
      <h2 style={{ margin: 0 }}>{t.bookSlot}</h2>
      <p className="lead" style={{ fontSize: ".95rem", margin: 0 }}>
        {user ? "Termin ide kao PENDING zahtjev. Vlasnik sale ga kasnije može odobriti." : t.authRequiredText}
      </p>
      {!user && (
        <div className="auth-gate">
          <Link href="/login" className="btn btn-ghost">{t.login}</Link>
          <Link href="/register" className="btn btn-primary">{t.register}</Link>
        </div>
      )}
      <div className="calendar-picker">
        <div className="picker-title"><CalendarDays size={18} /> {t.quickCalendar}</div>
        <div className="date-strip">
          {quickDates.map((item) => (
            <button
              className={eventDate === item.value ? "date-chip active" : "date-chip"}
              key={item.value}
              onClick={() => setEventDate(item.value)}
              type="button"
            >
              <span>{item.day}</span>
              <strong>{item.date}</strong>
            </button>
          ))}
        </div>
        <div className="slot-strip">
          {slots.map((slot) => (
            <button
              className={desiredTime === slot ? "slot-chip active" : "slot-chip"}
              key={slot}
              onClick={() => setDesiredTime(slot)}
              type="button"
            >
              <Clock3 size={15} /> {slot}
            </button>
          ))}
        </div>
      </div>
      <label className="field"><span>{t.name}</span><input name="name" defaultValue={user?.name ?? ""} required /></label>
      <label className="field"><span>Email</span><input type="email" name="email" defaultValue={user?.email ?? ""} required /></label>
      <label className="field"><span>{t.phone}</span><input name="phone" defaultValue={user?.phone ?? ""} /></label>
      <label className="field"><span>{t.eventDate}</span><input type="date" name="eventDate" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label>
      <label className="field"><span>{t.desiredTime}</span><input type="time" name="desiredTime" value={desiredTime} onChange={(event) => setDesiredTime(event.target.value)} /></label>
      <label className="field"><span>{t.guests}</span><input type="number" name="guests" min="1" /></label>
      <label className="field"><span>{t.message}</span><textarea name="message" required /></label>
      <button className="btn btn-primary" type="submit" disabled={!user}><Send size={18} /> {t.bookSlot}</button>
      {status && <p>{status}</p>}
    </form>
  );
}

function nextDates() {
  const formatter = new Intl.DateTimeFormat("bs-BA", { weekday: "short", day: "2-digit", month: "2-digit" });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    const [day = "", shortDate = ""] = formatter.format(date).split(", ");

    return {
      day,
      date: shortDate,
      value: date.toISOString().slice(0, 10)
    };
  });
}
