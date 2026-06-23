export type Role = "USER" | "OWNER" | "ADMIN" | "SUPER_ADMIN";
export type VenueCategory = "Wedding" | "Sport" | "Celebration" | "Diaspora" | "Conference" | "Other";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  createdAt?: string;
};

export type Venue = {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  category: VenueCategory;
  capacity: number;
  priceFrom: string | number;
  phone: string;
  email: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  guests?: number;
  message: string;
  desiredTime?: string;
  status?: string;
  createdAt: string;
  venue: Venue;
  user?: User;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  venueId: string;
  createdAt: string;
};

export type ForumPost = {
  id: string;
  title: string;
  body: string;
  city?: string;
  createdAt: string;
  user?: User;
};
