import type { Metadata } from "next";
import { api } from "@/lib/api";
import { VenuesClient } from "@/components/VenuesClient";

export const metadata: Metadata = {
  title: "Sale - sala.ba",
  description: "Pretrazi sale za svadbe, sport, proslave, konferencije i dijaspora dogadjaje."
};

export default async function VenuesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  const { venues } = await api.venues(query.toString() ? `?${query}` : "").catch(() => ({ venues: [] }));

  return <VenuesClient venues={venues} q={params.q} category={params.category} />;
}
