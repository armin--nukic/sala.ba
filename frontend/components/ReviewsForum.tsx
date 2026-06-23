"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { api } from "@/lib/api";
import type { ForumPost, Review } from "@/lib/types";

export function ReviewsForum({ venueId, city }: { venueId: string; city: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const [reviewRes, forumRes] = await Promise.all([api.reviews(venueId), api.forumPosts()]);
    setReviews(reviewRes.reviews);
    setPosts(forumRes.posts);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, [venueId]);

  async function addReview(formData: FormData) {
    setStatus("Spremam recenziju...");
    formData.set("venueId", venueId);
    await api.review(Object.fromEntries(formData));
    await load();
    setStatus("Recenzija je objavljena.");
  }

  async function addPost(formData: FormData) {
    setStatus("Objavljujem forum temu...");
    await api.forumPost(Object.fromEntries(formData));
    await load();
    setStatus("Tema je objavljena.");
  }

  return (
    <section className="section" style={{ paddingTop: 30 }}>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .9fr)" }}>
        <div className="glass" style={{ borderRadius: 8, padding: 24 }}>
          <span className="eyebrow">Recenzije</span>
          <h2>Iskustva korisnika</h2>
          <div className="grid">
            {reviews.length === 0 && <p className="lead">Još nema recenzija za ovu salu.</p>}
            {reviews.map((review) => (
              <article className="card" style={{ padding: 18 }} key={review.id}>
                <strong>{review.name}</strong>
                <div style={{ color: "var(--gold)" }}>
                  {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
          <form className="form" action={addReview} style={{ marginTop: 18 }}>
            <label className="field"><span>Ime</span><input name="name" required /></label>
            <label className="field"><span>Ocjena</span><select name="rating" defaultValue="5"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label>
            <label className="field"><span>Komentar</span><textarea name="comment" required /></label>
            <button className="btn btn-primary">Ostavi recenziju</button>
          </form>
        </div>

        <div className="glass" style={{ borderRadius: 8, padding: 24 }}>
          <span className="eyebrow">Forum</span>
          <h2><MessageSquare size={22} /> Pitanja zajednice</h2>
          {posts.slice(0, 4).map((post) => (
            <article key={post.id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
              <span className="badge">{post.city ?? "BiH"}</span>
            </article>
          ))}
          <form className="form" action={addPost} style={{ marginTop: 18 }}>
            <label className="field"><span>Tema</span><input name="title" required /></label>
            <label className="field"><span>Grad</span><input name="city" defaultValue={city} /></label>
            <label className="field"><span>Pitanje / iskustvo</span><textarea name="body" required /></label>
            <button className="btn btn-primary">Objavi na forum</button>
          </form>
          {status && <p>{status}</p>}
        </div>
      </div>
    </section>
  );
}
