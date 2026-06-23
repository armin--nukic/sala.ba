import type { Metadata } from "next";
import { api } from "@/lib/api";
import { SportDirectoryClient } from "@/components/SportDirectoryClient";

export const metadata: Metadata = {
  title: "Sport sale i sportski objekti u BiH | sala.ba",
  description: "Direktorij sportskih objekata: fudbal, mali fudbal, kosarka, odbojka, tenis, padel, fitness i multifunkcionalne dvorane.",
  openGraph: {
    title: "Sport sale i sportski objekti u BiH | sala.ba",
    description: "Pretraga sportskih objekata po gradu, sportu, cijeni i opremi.",
    url: "/sport-sale",
    type: "website"
  }
};

export default async function SportHallsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const filters = await searchParams;
  const params = new URLSearchParams({ category: "Sport", pageSize: "12" });
  ["q", "city", "sport", "maxPrice", "sort", "page"].forEach((key) => {
    const value = filters[key];
    if (value) params.set(key, value);
  });
  const data = await api.venues(`?${params.toString()}`);
  return <SportDirectoryClient data={data} filters={filters} />;
}
