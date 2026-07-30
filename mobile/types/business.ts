export interface BusinessLocation {
  lat: number;
  lng: number;
}

export interface Business {
  _id: string;
  owner: string;
  name: string;
  category: string;
  description?: string;
  address: string;
  location?: BusinessLocation;
  openingHours: string;
  isVerified: boolean;
  isBanned: boolean;
  avgRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  business: string;
  user: { _id: string; name: string } | string;
  rating: number;
  comment?: string;
  reply?: string;
  createdAt: string;
}

export interface BusinessAnalytics {
  servedToday: number;
  avgWaitMins: number;
  noShowRate: number;
  peakHour: number | null;
}
