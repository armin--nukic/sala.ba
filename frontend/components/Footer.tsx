import Link from "next/link";

export function Footer() {
  return (
    <footer className="section" style={{ paddingTop: 48 }}>
      <div className="container glass" style={{ borderRadius: 8, padding: 28 }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div>
            <h2 className="title" style={{ fontSize: "2rem" }}>
              sala.ba
            </h2>
            <p className="lead">Premium platforma za sale, upite, rezervacije i operativni CRM.</p>
          </div>
          <div>
            <strong>Platform</strong>
            <p>
              <Link href="/sale">Sale</Link> · <Link href="/dashboard">Dashboard</Link> ·{" "}
              <Link href="/admin">Admin</Link>
            </p>
          </div>
          <div>
            <strong>Kontakt</strong>
            <p>hello@sala.ba<br />+387 61 000 000</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
