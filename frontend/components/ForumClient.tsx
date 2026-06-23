"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ForumPost } from "@/lib/types";

export function ForumClient() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await api.forumPosts();
    setPosts(res.posts);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function submit(formData: FormData) {
    setStatus("Objavljujem...");
    await api.forumPost(Object.fromEntries(formData));
    await load();
    setStatus("Objavljeno.");
  }

  return (
    <section className="section">
      <div className="container grid" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .8fr)", alignItems: "start" }}>
        <div>
          <span className="eyebrow">Forum</span>
          <h1 className="title">Pitanja, iskustva i preporuke</h1>
          <div className="grid">
            {posts.map((post) => (
              <article className="glass" style={{ borderRadius: 8, padding: 22 }} key={post.id}>
                <span className="badge">{post.city ?? "BiH"}</span>
                <h2>{post.title}</h2>
                <p className="lead">{post.body}</p>
              </article>
            ))}
          </div>
        </div>
        <form className="form glass" action={submit} style={{ borderRadius: 8, padding: 24 }}>
          <h2>Nova tema</h2>
          <label className="field"><span>Naslov</span><input name="title" required /></label>
          <label className="field"><span>Grad</span><input name="city" /></label>
          <label className="field"><span>Tekst</span><textarea name="body" required /></label>
          <button className="btn btn-primary">Objavi</button>
          {status && <p>{status}</p>}
        </form>
      </div>
    </section>
  );
}
