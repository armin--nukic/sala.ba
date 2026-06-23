import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Sport sale - sala.ba",
  description: "Pretraži sportske sale, dvorane i centre za treninge, termine i turnire."
};

export default function SportHallsPage() {
  return <CategoryPage category="Sport" />;
}
