import type { Metadata } from "next";
import { ForumClient } from "@/components/ForumClient";

export const metadata: Metadata = {
  title: "Forum - sala.ba",
  description: "Pitanja, recenzije i iskustva korisnika oko sala, termina i rezervacija."
};

export default function ForumPage() {
  return <ForumClient />;
}
