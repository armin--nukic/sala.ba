"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "bs" | "en";

const dictionary = {
  bs: {
    home: "Početna",
    venues: "Sale",
    wedding: "Sale za vjenčanja",
    sport: "Sport sale",
    diaspora: "Dijaspora",
    about: "O nama",
    contact: "Kontakt",
    login: "Prijava",
    register: "Registracija",
    logout: "Odjava",
    dashboard: "Dashboard",
    admin: "Admin",
    heroTitle: "Pronađi idealnu salu za svaki događaj",
    heroText: "Svadbe, sport, proslave, konferencije i dijaspora rezervacije u jednoj brzoj platformi.",
    explore: "Pregledaj sale",
    sendInquiry: "Pošalji upit",
    contactTeam: "Kontakt tim",
    openDashboard: "Otvori dashboard",
    featured: "Izdvojene sale",
    ready: "Premium sale spremne za rezervaciju",
    why: "Zašto sala.ba",
    whyTitle: "Brza pretraga, jasni upiti i bolja kontrola termina",
    createAccount: "Kreiraj račun",
    bookSlot: "Rezerviši termin",
    details: "Detalji",
    edit: "Edit",
    darkMode: "Noćni mod",
    lightMode: "Dnevni mod",
    language: "Jezik",
    authRequiredTitle: "Prijava je potrebna",
    authRequiredText: "Da bi rezervacija bila spremljena u bazu i vezana za profil, prvo se prijavi ili registruj.",
    quickCalendar: "Brzi kalendar",
    eventDate: "Datum događaja",
    desiredTime: "Željeni termin",
    guests: "Broj gostiju",
    message: "Poruka",
    name: "Ime",
    phone: "Telefon",
    dashboardWelcome: "Dobrodošli",
    dashboardLead: "Brzi pregled sala, termina, upita i lokalno editovanje demo podataka.",
    overview: "Pregled",
    calendar: "Kalendar",
    crm: "CRM",
    activeInquiries: "Aktivni upiti",
    bookings: "Rezervacije",
    crmTasks: "CRM zadaci",
    addVenue: "Dodaj novu salu",
    nextBooking: "Sljedeći termin",
    userProfile: "Profil korisnika",
    savedInquiry: "Upit je uspješno poslan.",
    sendError: "Greška pri slanju."
  },
  en: {
    home: "Home",
    venues: "Venues",
    wedding: "Wedding halls",
    sport: "Sport halls",
    diaspora: "Diaspora",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    admin: "Admin",
    heroTitle: "Find the perfect venue for every event",
    heroText: "Weddings, sports, celebrations, conferences and diaspora bookings in one fast platform.",
    explore: "Explore venues",
    sendInquiry: "Send inquiry",
    contactTeam: "Contact team",
    openDashboard: "Open dashboard",
    featured: "Featured venues",
    ready: "Premium venues ready for booking",
    why: "Why sala.ba",
    whyTitle: "Fast search, clear inquiries and better booking control",
    createAccount: "Create account",
    bookSlot: "Book a slot",
    details: "Details",
    edit: "Edit",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    language: "Language",
    authRequiredTitle: "Login required",
    authRequiredText: "To save the booking in the database and connect it to your profile, log in or register first.",
    quickCalendar: "Quick calendar",
    eventDate: "Event date",
    desiredTime: "Desired time",
    guests: "Guests",
    message: "Message",
    name: "Name",
    phone: "Phone",
    dashboardWelcome: "Welcome",
    dashboardLead: "A fast workspace for venues, slots, inquiries and demo editing.",
    overview: "Overview",
    calendar: "Calendar",
    crm: "CRM",
    activeInquiries: "Active inquiries",
    bookings: "Bookings",
    crmTasks: "CRM tasks",
    addVenue: "Add new venue",
    nextBooking: "Next booking",
    userProfile: "User profile",
    savedInquiry: "Inquiry sent successfully.",
    sendError: "Could not send inquiry."
  }
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof dictionary.bs;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bs");

  useEffect(() => {
    const stored = localStorage.getItem("sala_lang");
    if (stored === "bs" || stored === "en") setLangState(stored);
  }, []);

  function setLang(nextLang: Lang) {
    localStorage.setItem("sala_lang", nextLang);
    document.documentElement.lang = nextLang;
    setLangState(nextLang);
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: dictionary[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
