import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Sale za vjenčanja - sala.ba",
  description: "Pronađi idealnu salu za svadbu i wedding evente u Bosni i Hercegovini."
};

export default function WeddingHallsPage() {
  return <CategoryPage category="Wedding" />;
}
