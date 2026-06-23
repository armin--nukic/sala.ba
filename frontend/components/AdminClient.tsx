"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { BarChart3, Building2, Crown, ImagePlus, Inbox, ShieldCheck, UserCog, UsersRound, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import type { ContactMessage, Inquiry, Role, User, Venue, VenueCategory } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

const fallbackImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80";

type VenueForm = {
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  category: VenueCategory;
  capacity: number;
  priceFrom: number;
  phone: string;
  email: string;
  imageUrl: string;
  galleryImages: string[];
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string;
  sports: string[];
  courtCount: number | null;
  parking: boolean;
  lockerRooms: boolean;
  floodlights: boolean;
  reservationsEnabled: boolean;
  workingHours: string;
  isFeatured: boolean;
  isActive: boolean;
  ownerId?: string | null;
};

const emptyVenue: VenueForm = {
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
  imageUrl: fallbackImage,
  galleryImages: [],
  latitude: null,
  longitude: null,
  googleMapsUrl: "",
  sports: [],
  courtCount: null,
  parking: false,
  lockerRooms: false,
  floodlights: false,
  reservationsEnabled: true,
  workingHours: "",
  isFeatured: false,
  isActive: true,
  ownerId: null
};

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "USER" as Role
};

const roleCards: Array<{ role: Role; icon: LucideIcon; text: string; permissions: string[] }> = [
  { role: "USER", icon: UsersRound, text: "Obicni korisnik platforme.", permissions: ["Pregled sala", "Slanje upita", "Rezervacija termina"] },
  { role: "OWNER", icon: Building2, text: "Vlasnik ili menadzer prostora.", permissions: ["Upravlja svojim salama", "Upload slika", "Pregled svojih upita"] },
  { role: "ADMIN", icon: ShieldCheck, text: "Operativni admin platforme.", permissions: ["CRUD sala", "Aktivacija sala", "Pregled rezervacija"] },
  { role: "SUPER_ADMIN", icon: Crown, text: "Glavni korisnik sistema.", permissions: ["Users Management", "Dodjela USER/OWNER/ADMIN", "Sve admin akcije"] }
];

const venueCategories: VenueCategory[] = ["Wedding", "Sport", "Celebration", "Diaspora", "Conference", "Other"];
const assignableRoles: Role[] = ["USER", "OWNER", "ADMIN"];

function venueToForm(venue: Venue): VenueForm {
  return {
    name: venue.name,
    slug: venue.slug,
    description: venue.description,
    city: venue.city,
    address: venue.address,
    category: venue.category,
    capacity: venue.capacity,
    priceFrom: Number(venue.priceFrom),
    phone: venue.phone,
    email: venue.email,
    imageUrl: venue.imageUrl || fallbackImage,
    galleryImages: venue.galleryImages ?? [],
    latitude: venue.latitude == null ? null : Number(venue.latitude),
    longitude: venue.longitude == null ? null : Number(venue.longitude),
    googleMapsUrl: venue.googleMapsUrl ?? "",
    sports: venue.sports ?? [],
    courtCount: venue.courtCount ?? null,
    parking: venue.parking ?? false,
    lockerRooms: venue.lockerRooms ?? false,
    floodlights: venue.floodlights ?? false,
    reservationsEnabled: venue.reservationsEnabled ?? true,
    workingHours: venue.workingHours ?? "",
    isFeatured: venue.isFeatured,
    isActive: venue.isActive,
    ownerId: venue.ownerId ?? null
  };
}

function validateVenue(form: VenueForm) {
  if (!form.name.trim() || !form.city.trim() || !form.address.trim()) return "Naziv, grad i adresa su obavezni.";
  if (!/^[a-z0-9-]{2,}$/.test(form.slug)) return "Slug mora imati mala slova, brojeve i crtice.";
  if (form.description.trim().length < 10) return "Opis mora imati najmanje 10 karaktera.";
  if (!form.capacity || form.capacity < 1) return "Kapacitet mora biti veci od 0.";
  if (form.priceFrom < 0) return "Cijena ne moze biti negativna.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email nije validan.";
  if (form.phone.trim().length < 3) return "Telefon je obavezan.";
  if (!form.imageUrl.trim()) return "Main image je obavezna.";
  if ((form.latitude !== null && (form.latitude < -90 || form.latitude > 90)) || (form.longitude !== null && (form.longitude < -180 || form.longitude > 180))) return "Koordinate nisu validne.";
  return null;
}

export function AdminClient() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [venueForm, setVenueForm] = useState<VenueForm>(emptyVenue);
  const [newUser, setNewUser] = useState(emptyUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const canManageUsers = user?.role === "SUPER_ADMIN";
  const canManageVenues = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const canUseAdmin = user?.role === "OWNER" || canManageVenues;

  const visibleStats = useMemo<Array<[string, number, LucideIcon]>>(() => {
    const cards: Array<[string, number, LucideIcon]> = [
      ["Venues", stats.venues ?? 0, Building2],
      ["Inquiries", stats.inquiries ?? 0, BarChart3]
    ];
    if (canManageUsers) cards.unshift(["Users", stats.users ?? 0, UsersRound]);
    if (canManageVenues) cards.push(["Messages", stats.contactMessages ?? 0, Inbox]);
    return cards;
  }, [canManageUsers, canManageVenues, stats]);

  async function loadStats() {
    if (!token) return;
    const statsRes = await api.adminStats(token);
    setStats(statsRes.stats);
  }

  async function loadVenues() {
    if (!token) return;
    const venuesRes = await api.adminVenues(token);
    setVenues(venuesRes.venues);
  }

  async function loadUsers() {
    if (!token || !canManageUsers) return;
    const usersRes = await api.adminUsers(token);
    setUsers(usersRes.users);
  }

  async function loadMessages() {
    if (!token || !canManageVenues) return;
    const messagesRes = await api.adminMessages(token);
    setMessages(messagesRes.messages);
  }

  async function loadInquiries() {
    if (!token) return;
    const inquiriesRes = await api.adminInquiries(token);
    setInquiries(inquiriesRes.inquiries);
  }

  async function loadInitial() {
    if (!token || !canUseAdmin) return;
    setLoading(true);
    setStatus("");
    try {
      await Promise.all([loadStats(), loadVenues(), loadUsers(), loadMessages(), loadInquiries()]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Ucitavanje nije uspjelo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, [token, canUseAdmin, canManageUsers, canManageVenues]);

  if (!user) return <section className="section"><div className="container">Login required.</div></section>;
  if (!canUseAdmin) return <section className="section"><div className="container">Admin ili owner rola je potrebna.</div></section>;

  async function saveVenue() {
    const validationError = validateVenue(venueForm);
    if (validationError) {
      setStatus(validationError);
      return;
    }

    setStatus("Spremam salu...");
    try {
      const isOwnerCreate = user?.role === "OWNER" && !editingId;
      if (editingId) await api.updateVenue(editingId, venueForm, token);
      else await api.createVenue(venueForm, token);
      setVenueForm(emptyVenue);
      setEditingId(null);
      await Promise.all([loadStats(), loadVenues()]);
      setStatus(editingId ? "Sala je azurirana." : isOwnerCreate ? "Sala je kreirana i ceka aktivaciju." : "Sala je kreirana.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Spremanje sale nije uspjelo.");
    }
  }

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setStatus("Upload slika je u toku...");
    try {
      const data = new FormData();
      files.forEach((file) => data.append("images", file));
      const result = await api.uploadVenueImages(data, token);
      const urls = result.images.map((image) => image.url);
      setVenueForm((current) => ({
        ...current,
        imageUrl: current.imageUrl === fallbackImage ? urls[0] ?? current.imageUrl : current.imageUrl,
        galleryImages: [...current.galleryImages, ...urls.slice(current.imageUrl === fallbackImage ? 1 : 0)]
      }));
      setStatus("Slike su uploadane.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload nije uspio.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function createUser() {
    if (!newUser.name || !newUser.email || newUser.password.length < 8) {
      setStatus("Ime, email i password od najmanje 8 karaktera su obavezni.");
      return;
    }
    setStatus("Kreiram korisnika...");
    try {
      await api.createAdminUser(newUser, token);
      setNewUser(emptyUser);
      await Promise.all([loadStats(), loadUsers()]);
      setStatus("Korisnik je kreiran.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Kreiranje korisnika nije uspjelo.");
    }
  }

  async function deleteVenue(id: string) {
    setStatus("Brisem salu...");
    await api.deleteVenue(id, token);
    await Promise.all([loadStats(), loadVenues()]);
    setStatus("Sala je obrisana.");
  }

  async function changeRole(id: string, role: Role) {
    await api.updateRole(id, role, token);
    await loadUsers();
  }

  async function changeUserStatus(id: string, isActive: boolean) {
    await api.updateUserStatus(id, isActive, token);
    await loadUsers();
  }

  async function changeInquiryStatus(id: string, nextStatus: "PENDING" | "APPROVED" | "REJECTED") {
    await api.updateInquiryStatus(id, nextStatus, token);
    await loadInquiries();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Admin CRM</span>
            <h1 className="title">Admin panel</h1>
            <p className="lead">Upravljanje salama, korisnicima, permisijama, rezervacijama i porukama prema roli.</p>
          </div>
          <span className="badge">{user.role}</span>
        </div>
        {status && <p className="dashboard-notice">{status}</p>}
        {loading && <p className="dashboard-notice">Ucitavanje admin podataka...</p>}

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", marginTop: 24 }}>
          {visibleStats.map(([label, value, Icon]) => (
            <div className="metric-card glass" key={label}>
              <Icon color="var(--brand)" />
              <p>{label}</p>
              <h2>{value}</h2>
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
          {canManageUsers && (
            <UsersManagement
              newUser={newUser}
              setNewUser={setNewUser}
              createUser={createUser}
              users={users}
              changeRole={changeRole}
              changeUserStatus={changeUserStatus}
            />
          )}

          <VenueEditor
            title={canManageVenues ? "Venues Management" : "My Venues"}
            form={venueForm}
            setForm={setVenueForm}
            editingId={editingId}
            saveVenue={saveVenue}
            uploadImages={uploadImages}
            uploading={uploading}
            canManageVenues={canManageVenues}
          />
        </div>

        <AdminTable title={canManageVenues ? "Venues Management" : "My Venues"} headers={["Slika", "Naziv", "Grad", "Kategorija", "Owner", "Aktivna", "Akcije"]}>
          {venues.map((venue) => (
            <tr key={venue.id}>
              <td><img className="admin-thumb" src={venue.imageUrl || fallbackImage} alt="" /></td>
              <td>{venue.name}</td><td>{venue.city}</td><td>{venue.category}</td><td>{venue.owner?.email ?? "-"}</td><td>{String(venue.isActive)}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => { setEditingId(venue.id); setVenueForm(venueToForm(venue)); }}>Edit</button>{" "}
                {canManageVenues && <button className="btn btn-ghost" onClick={() => deleteVenue(venue.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </AdminTable>

        {canManageVenues && (
          <AdminTable title="Kontakt poruke" headers={["Ime", "Email", "Tip", "Poruka"]}>
            {messages.map((message) => <tr key={message.id}><td>{message.name}</td><td>{message.email}</td><td>{message.type}</td><td>{message.message}</td></tr>)}
          </AdminTable>
        )}

        <AdminTable title="Reservations / Requests" headers={["Ime", "Email", "Sala", "Termin", "Status", "Poruka"]}>
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

function UsersManagement({
  newUser,
  setNewUser,
  createUser,
  users,
  changeRole,
  changeUserStatus
}: {
  newUser: typeof emptyUser;
  setNewUser: (user: typeof emptyUser) => void;
  createUser: () => void;
  users: User[];
  changeRole: (id: string, role: Role) => void;
  changeUserStatus: (id: string, isActive: boolean) => void;
}) {
  return (
    <div className="glass admin-panel-card">
      <h2><UserCog size={22} /> Users Management</h2>
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

      <AdminTable compact title="Korisnici i permisije" headers={["Ime", "Email", "Role", "Aktivan"]}>
        {users.map((adminUser) => (
          <tr key={adminUser.id}>
            <td>{adminUser.name}</td><td>{adminUser.email}</td>
            <td>
              <select value={adminUser.role} disabled={adminUser.role === "SUPER_ADMIN"} onChange={(e) => changeRole(adminUser.id, e.target.value as Role)}>
                {adminUser.role === "SUPER_ADMIN" && <option>SUPER_ADMIN</option>}
                {assignableRoles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </td>
            <td>
              <select value={String(adminUser.isActive ?? true)} disabled={adminUser.role === "SUPER_ADMIN"} onChange={(e) => changeUserStatus(adminUser.id, e.target.value === "true")}>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

function VenueEditor({
  title,
  form,
  setForm,
  editingId,
  saveVenue,
  uploadImages,
  uploading,
  canManageVenues
}: {
  title: string;
  form: VenueForm;
  setForm: (form: VenueForm) => void;
  editingId: string | null;
  saveVenue: () => void;
  uploadImages: (event: ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  canManageVenues: boolean;
}) {
  const galleryValue = form.galleryImages.join("\n");
  return (
    <div className="glass admin-panel-card">
      <h2><Building2 size={22} /> {title}</h2>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <label className="field"><span>name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="field"><span>slug</span><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></label>
        <label className="field"><span>city</span><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
        <label className="field"><span>address</span><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label className="field">
          <span>category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as VenueCategory })}>
            {venueCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="field"><span>capacity</span><input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></label>
        <label className="field"><span>priceFrom</span><input type="number" min="0" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })} /></label>
        <label className="field"><span>phone</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="field"><span>email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        {canManageVenues && (
          <>
            <label className="field"><span>isFeatured</span><select value={String(form.isFeatured)} onChange={(e) => setForm({ ...form, isFeatured: e.target.value === "true" })}><option value="false">false</option><option value="true">true</option></select></label>
            <label className="field"><span>isActive</span><select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}><option value="true">true</option><option value="false">false</option></select></label>
          </>
        )}
        <label className="field"><span>latitude</span><input type="number" step="0.000001" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })} /></label>
        <label className="field"><span>longitude</span><input type="number" step="0.000001" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })} /></label>
        <label className="field"><span>courtCount</span><input type="number" min="1" value={form.courtCount ?? ""} onChange={(e) => setForm({ ...form, courtCount: e.target.value ? Number(e.target.value) : null })} /></label>
        <label className="field"><span>workingHours</span><input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} /></label>
        <label className="field"><span>parking</span><select value={String(form.parking)} onChange={(e) => setForm({ ...form, parking: e.target.value === "true" })}><option value="false">false</option><option value="true">true</option></select></label>
        <label className="field"><span>lockerRooms</span><select value={String(form.lockerRooms)} onChange={(e) => setForm({ ...form, lockerRooms: e.target.value === "true" })}><option value="false">false</option><option value="true">true</option></select></label>
        <label className="field"><span>floodlights</span><select value={String(form.floodlights)} onChange={(e) => setForm({ ...form, floodlights: e.target.value === "true" })}><option value="false">false</option><option value="true">true</option></select></label>
        <label className="field"><span>reservationsEnabled</span><select value={String(form.reservationsEnabled)} onChange={(e) => setForm({ ...form, reservationsEnabled: e.target.value === "true" })}><option value="true">true</option><option value="false">false</option></select></label>
      </div>
      <label className="field" style={{ marginTop: 14 }}><span>description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label className="field"><span>sports (one per line)</span><textarea value={form.sports.join("\n")} onChange={(e) => setForm({ ...form, sports: e.target.value.split("\n").map((sport) => sport.trim()).filter(Boolean) })} /></label>
      <label className="field"><span>googleMapsUrl</span><input value={form.googleMapsUrl} onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })} /></label>
      <div className="upload-row">
        <label className="btn btn-ghost">
          <ImagePlus size={17} /> {uploading ? "Uploading..." : "Upload images"}
          <input type="file" accept="image/*" multiple hidden onChange={uploadImages} disabled={uploading} />
        </label>
        <span>Main image i gallery se spremaju kao URL-ovi u bazu.</span>
      </div>
      <label className="field"><span>main imageUrl</span><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
      <label className="field"><span>gallery images (one URL per line)</span><textarea value={galleryValue} onChange={(e) => setForm({ ...form, galleryImages: e.target.value.split("\n").map((url) => url.trim()).filter(Boolean) })} /></label>
      <div className="image-preview-grid">
        {[form.imageUrl, ...form.galleryImages].filter(Boolean).map((url) => <img key={url} src={url} alt="" />)}
      </div>
      <button className="btn btn-primary" onClick={saveVenue}>{editingId ? "Update venue" : "Create venue"}</button>
    </div>
  );
}

function AdminTable({ title, headers, children, compact = false }: { title: string; headers: string[]; children: ReactNode; compact?: boolean }) {
  return (
    <div className={compact ? undefined : "glass"} style={{ borderRadius: 8, padding: compact ? "16px 0 0" : 22, marginTop: 24 }}>
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
