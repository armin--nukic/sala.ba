import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Dijaspora rezervacije - sala.ba",
  description: "Sale i event prostori prilagođeni rezervacijama iz dijaspore."
};

export default function DiasporaPage() {
  return <CategoryPage category="Diaspora" />;
}
