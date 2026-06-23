import { HomeClient } from "@/components/HomeClient";
import { api } from "@/lib/api";

export default async function HomePage() {
  const { venues } = await api.venues("?includeInactive=false").catch(() => ({ venues: [] }));
  return <HomeClient venues={venues} />;
}
