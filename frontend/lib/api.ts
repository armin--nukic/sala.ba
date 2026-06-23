import type { ContactMessage, ForumPost, Inquiry, PaginatedVenues, Review, Role, User, Venue } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4111/api";

function apiBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.API_INTERNAL_URL ?? API_URL;
  }

  try {
    const configured = new URL(API_URL);
    const currentHost = window.location.hostname;
    const isConfiguredLocal = ["localhost", "127.0.0.1"].includes(configured.hostname);
    const isCurrentLocal = ["localhost", "127.0.0.1"].includes(currentHost);

    if (isConfiguredLocal && isCurrentLocal && configured.hostname !== currentHost) {
      configured.hostname = currentHost;
      return configured.toString().replace(/\/$/, "");
    }
  } catch {
    return API_URL;
  }

  return API_URL;
}

type ApiOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: options.method && options.method !== "GET" ? "no-store" : options.cache
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "API request failed");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: (token?: string | null) => request<{ user: User }>("/auth/me", { token, cache: "no-store" }),
  venues: (query = "") => request<PaginatedVenues>(`/venues${query}`, { cache: "no-store" }),
  venueOptions: () => request<{ cities: string[]; sports: string[] }>("/venues/meta/options", { cache: "no-store" }),
  adminVenues: (token?: string | null) =>
    request<{ venues: Venue[] }>("/admin/venues", { token, cache: "no-store" }),
  venue: (slug: string) => request<{ venue: Venue }>(`/venues/${slug}`, { cache: "no-store" }),
  createVenue: (data: Partial<Venue>, token?: string | null) =>
    request<{ venue: Venue }>("/venues", { method: "POST", body: JSON.stringify(data), token }),
  updateVenue: (id: string, data: Partial<Venue>, token?: string | null) =>
    request<{ venue: Venue }>(`/venues/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  deleteVenue: (id: string, token?: string | null) =>
    request<void>(`/venues/${id}`, { method: "DELETE", token }),
  uploadVenueImages: (data: FormData, token?: string | null) =>
    request<{ images: Array<{ filename: string; url: string }> }>("/uploads/venues", { method: "POST", body: data, token }),
  contact: (data: Record<string, FormDataEntryValue>) =>
    request<{ message: ContactMessage }>("/contact", { method: "POST", body: JSON.stringify(data) }),
  inquiry: (data: Record<string, FormDataEntryValue>, token?: string | null) =>
    request<{ inquiry: Inquiry }>("/inquiries", { method: "POST", body: JSON.stringify(data), token }),
  reviews: (venueId: string) =>
    request<{ reviews: Review[] }>(`/reviews/venue/${venueId}`, { cache: "no-store" }),
  review: (data: Record<string, FormDataEntryValue>) =>
    request<{ review: Review }>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  forumPosts: () =>
    request<{ posts: ForumPost[] }>("/forum", { cache: "no-store" }),
  forumPost: (data: Record<string, FormDataEntryValue>) =>
    request<{ post: ForumPost }>("/forum", { method: "POST", body: JSON.stringify(data) }),
  adminStats: (token?: string | null) =>
    request<{ stats: Record<string, number> }>("/admin/stats", { token, cache: "no-store" }),
  adminUsers: (token?: string | null) =>
    request<{ users: User[] }>("/admin/users", { token, cache: "no-store" }),
  createAdminUser: (data: { name: string; email: string; password: string; phone?: string; role: Role }, token?: string | null) =>
    request<{ user: User }>("/admin/users", { method: "POST", body: JSON.stringify(data), token }),
  updateRole: (id: string, role: Role, token?: string | null) =>
    request<{ user: User }>(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }), token }),
  updateUserStatus: (id: string, isActive: boolean, token?: string | null) =>
    request<{ user: User }>(`/admin/users/${id}/status`, { method: "PUT", body: JSON.stringify({ isActive }), token }),
  adminMessages: (token?: string | null) =>
    request<{ messages: ContactMessage[] }>("/admin/contact-messages", { token, cache: "no-store" }),
  adminInquiries: (token?: string | null) =>
    request<{ inquiries: Inquiry[] }>("/admin/inquiries", { token, cache: "no-store" }),
  updateInquiryStatus: (id: string, status: "PENDING" | "APPROVED" | "REJECTED", token?: string | null) =>
    request<{ inquiry: Inquiry }>(`/admin/inquiries/${id}/status`, { method: "PUT", body: JSON.stringify({ status }), token }),
  checkoutPro: (token?: string | null) =>
    request<{ mode: "stripe" | "demo"; url?: string | null; message?: string }>("/billing/checkout", { method: "POST", body: JSON.stringify({ plan: "pro" }), token })
};
