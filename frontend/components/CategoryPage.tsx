import { api } from "@/lib/api";
import { CategoryClient } from "@/components/CategoryClient";

export async function CategoryPage({ category }: { category: "Wedding" | "Sport" | "Diaspora" }) {
  const { venues } = await api.venues(`?category=${category}`).catch(() => ({ venues: [] }));
  return <CategoryClient category={category} venues={venues} />;
}
