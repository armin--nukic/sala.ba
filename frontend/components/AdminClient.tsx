"use client";

import { useEffect, useState } from "react";
import { BarChart3, Building2, Crown, Inbox, ShieldCheck, UserCog, UsersRound, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import type { ContactMessage, Inquiry, Role, User, Venue } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

const emptyVenue = {
  name: "",
  slug: "",
  description: "",
  city: "",
  address: "",
  category: "Wedding",
  capacity: 100,
  priceFrom: 0,
  phone: "",
  email: "",
  imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80",
  isFeatured: false,
  isActive: true
};

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "USER" as Role
};

const roleCards: Array<{ role: Role; icon: LucideIcon; text: string; permissions: string[] }> = [
  { role: "USER", icon: UsersRound, text: "Korisnik koji moze rezervisati termine.", permissions: ["Pregled sala", "Rezervacija termina", "Recenzije i forum"] },
  { role: "OWNER", icon: Building2, text: "Vlasnik ili menadzer prostora.", permissions: ["Upravljanje svojim salama", "Pregled upita", "CRM termini"] },
  { role: "ADMIN", icon: ShieldCheck, text: "Operativni admin platforme.", permissions: ["CRUD sala", "Statusi rezervacija", "Korisnici USER/OWNER"] },
  { role: "SUPER_ADMIN", icon: Crown, text: "Puna kontrola sistema.", permissions: ["Sve admin akcije", "Dodjela ADMIN role", "Dodjela SUPER_ADMIN role"] }
];

export function AdminClient() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [venueForm, setVenueForm] = useState<Record<string, string | number | boolean>>(emptyVenue);
  const [newUser, setNewUser] = useState(emptyUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  async function load() {
    if (!token) return;
    const [statsRes, usersRes, venuesRes, messagesRes, inquiriesRes] = await Promise.all([
      api.adminStats(token),
      api.adminUsers(token),
      api.venues("?includeInactive=true"),
      api.adminMessages(token),
      api.adminInquiries(token)
    ]);
    setStats(statsRes.stats);
    setUsers(usersRes.users);
    setVenues(venuesRes.venues);
    setMessages(messagesRes.messages);
    setInquiries(inquiriesRes.inquiries);
  }

  useEffect(() => {
    load().catch((error) => setStatus(error.message));
  }, [token]);

  if (!user) return <section className="section"><div className="container">Login required.</div></section>;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return <section className="section"><div className="container">Admin role required.</div></section>;
  }

  const canManageAdmins = user.role === "SUPER_ADMIN";
  const assignableRoles: Role[] = canManageAdmins ? ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] : ["USER", "OWNER"];

  async function saveVenue() {
    setStatus("Saving venue...");
    try {
      if (editingId) await api.updateVenue(editingId, venueForm as Partial<Venue>, token);
      else await api.createVenue(venueForm as Partial<Venue>, token);
      setVenueForm(emptyVenue);
      setEditingId(null);
      await load();
      setStatus("Venue saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function createUser() {
    setStatus("Creating user...");
    try {
      await api.createAdminUser(newUser, token);
      setNewUser(emptyUser);
      await load();
      setStatus("User created.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create user failed");
    }
  }

  async function deleteVenue(id: string) {
    await api.deleteVenue(id, token);
    await load();
  }

  async function changeRole(id: string, role: Role) {
    await api.updateRole(id, role, token);
    await load();
  }

  async function changeInquiryStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
    await api.updateInquiryStatus(id, status, token);
    await load();
  }

  const statCards: Array<[string, number, LucideIcon]> = [
    ["Users", stats.users ?? 0, UsersRound],
    ["Venues", stats.venues ?? 0, Building2],
    ["Messages", stats.contactMessages ?? 0, Inbox],
    ["Inquiries", stats.inquiries ?? 0, BarChart3]
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Admin CRM</span>
            <h1 className="title">Admin panel</h1>
            <p className="lead">Upravljanje salama, korisnicima, permisijama, rezervacijama i porukama.</p>
          </div>
          <span className="badge">{user.role}</span>
        </div>
        {status && <p className="dashboard-notice">{status}</p>}

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", marginTop: 24 }}>
          {statCards.map(([label, value, Icon]) => (
            <div className="metric-card glass" key={String(label)}>
              <Icon color="var(--brand)" />
              <p>{String(label)}</p>
              <h2>{String(value)}</h2>
            </div>
          ))}
        </div>

        <div className="permissions-grid">
          {roleCards.map(({ role, icon: Icon, text, permissions }) => (
            <article className="permission-card glass" key={role}>
              <Icon color="var(--brand)" />
              <h3>{role}</h3>
              <p>{text}</p>
              <ul>{permissions.map((permission) => <li key={permission}>{permission}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className="admin-split">
          <div className="glass admin-panel-card">
            <h2><UserCog size={22} /> Dodaj korisnika</h2>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              <label className="field"><span>Ime</span><input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} /></label>
              <label className="field"><span>Email</span><input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} /></label>
              <label className="field"><span>Telefon</span><input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} /></label>
              <label className="field"><span>Password</span><input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} /></label>
              <label className="field">
                <span>Rola</span>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}>
                  {assignableRoles.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
            </div>
            <button className="btn btn-primary" onClick={createUser}>Create user</button>
          </div>

          <div className="glass admin-panel-card">
            <h2>CRUD za sale/prostore</h2>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              {Object.keys(emptyVenue).map((key) => (
                <label className="field" key={key}>
                  <span>{key}</span>
                  {key === "category" ? (
                    <select value={String(venueForm[key])} onChange={(e) => setVenueForm({ ...venueForm, [key]: e.target.value })}>
                      {["Wedding", "Sport", "Celebration", "Diaspora", "Conference", "Other"].map((category) => <option key={category}>{category}</option>)}
                    </select>
                  ) : typeof emptyVenue[key as keyof typeof emptyVenue] === "boolean" ? (
                    <select value={String(venueForm[key])} onChange={(e) => setVenueForm({ ...venueForm, [key]: e.target.value === "true" })}>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input
                      value={String(venueForm[key])}
                      type={["capacity", "priceFrom"].includes(key) ? "number" : "text"}
                      onChange={(e) => setVenueForm({ ...venueForm, [key]: ["capacity", "priceFrom"].includes(key) ? Number(e.target.value) : e.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
            <button className="btn btn-primary" onClick={saveVenue}>{editingId ? "Update venue" : "Create venue"}</button>
          </div>
        </div>

        <AdminTable title="Korisnici i permisije" headers={["Ime", "Email", "Telefon", "Role"]}>
          {users.map((adminUser) => (
            <tr key={adminUser.id}>
              <td>{adminUser.name}</td><td>{adminUser.email}</td><td>{adminUser.phone ?? "-"}</td>
              <td>
                <select value={adminUser.role} disabled={!canManageAdmins && (adminUser.role === "ADMIN" || adminUser.role === "SUPER_ADMIN")} onChange={(e) => changeRole(adminUser.id, e.target.value as Role)}>
                  {(canManageAdmins ? ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] : ["USER", "OWNER"]).map((role) => <option key={role}>{role}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminTable title="Sale" headers={["Naziv", "Grad", "Kategorija", "Aktivna", "Akcije"]}>
          {venues.map((venue) => (
            <tr key={venue.id}>
              <td>{venue.name}</td><td>{venue.city}</td><td>{venue.category}</td><td>{String(venue.isActive)}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => { setEditingId(venue.id); setVenueForm({ ...venue, priceFrom: Number(venue.priceFrom) }); }}>Edit</button>{" "}
                <button className="btn btn-ghost" onClick={() => deleteVenue(venue.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminTable title="Kontakt poruke" headers={["Ime", "Email", "Tip", "Poruka"]}>
          {messages.map((message) => <tr key={message.id}><td>{message.name}</td><td>{message.email}</td><td>{message.type}</td><td>{message.message}</td></tr>)}
        </AdminTable>

        <AdminTable title="Upiti / rezervacije termina" headers={["Ime", "Email", "Sala", "Termin", "Status", "Poruka"]}>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td>{inquiry.name}</td><td>{inquiry.email}</td><td>{inquiry.venue?.name}</td>
              <td>{inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString("bs-BA") : "-"} {inquiry.desiredTime ?? ""}</td>
              <td>
                <select value={inquiry.status ?? "PENDING"} onChange={(e) => changeInquiryStatus(inquiry.id, e.target.value as "PENDING" | "APPROVED" | "REJECTED")}>
                  <option>PENDING</option>
                  <option>APPROVED</option>
                  <option>REJECTED</option>
                </select>
              </td>
              <td>{inquiry.message}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}

function AdminTable({ title, headers, children }: { title: string; headers: string[]; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ borderRadius: 8, padding: 22, marginTop: 24 }}>
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
