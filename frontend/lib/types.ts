export type Role = "USER" | "OWNER" | "ADMIN" | "SUPER_ADMIN";
export type VenueCategory = "Wedding" | "Sport" | "Celebration" | "Diaspora" | "Conference" | "Other";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  isActive?: boolean;
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
  galleryImages?: string[];
  latitude?: string | number | null;
  longitude?: string | number | null;
  googleMapsUrl?: string | null;
  sports?: string[];
  courtCount?: number | null;
  parking?: boolean;
  lockerRooms?: boolean;
  floodlights?: boolean;
  reservationsEnabled?: boolean;
  workingHours?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  ownerId?: string | null;
  owner?: Pick<User, "id" | "name" | "email"> | null;
  createdAt: string;
};

export type PaginatedVenues = {
  venues: Venue[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
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
