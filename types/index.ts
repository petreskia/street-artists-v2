// ============================================
// CORE TYPES
// ============================================

export interface Artist {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  popularity: number;
  artworkCount: number;
  likes: number;
  specialties: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  contactEmail?: string;
  bookingEnabled: boolean;
  hourlyRate?: number;
  createdAt: Date;
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  type: string;
  image: string;
  price: number;
  views: number;
  likes: number;
  isPublished: boolean;
  auctionStatus: boolean;
  createdAt: Date;
  tags: string[];
  medium: "Spray" | "Mural" | "Digital" | "Performance" | "Mixed";
  dimensions?: {
    width: number;
    height: number;
    unit: "cm" | "m" | "ft";
  };
  timeSpent?: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
    isPublic: boolean;
  };
  license:
    | "All Rights Reserved"
    | "CC BY"
    | "CC BY-SA"
    | "CC BY-NC"
    | "CC BY-ND"
    | "Public Domain";
  soldDate?: Date;
  commission?: boolean;
}

// Backward compatibility: Legacy Item type for localStorage-based system
export interface Item {
  id: number;
  title: string;
  description: string;
  type: string;
  image: string;
  price: number;
  artist: string;
  isPublished: boolean;
  dateCreated: string;
  isAuctioning: boolean;
  dateSold?: string;
  priceSold?: number;
}

export interface Auction {
  id: string;
  artworkId: string;
  startingBid: number;
  currentBid: number;
  endTime: Date;
  isActive: boolean;
  bidders: {
    userId: string;
    amount: number;
    timestamp: Date;
  }[];
}

// ============================================
// BUSINESS LOGIC TYPES
// ============================================

export interface Commission {
  id: string;
  artistId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  workType: string;
  budget: number;
  location: string;
  description: string;
  preferredStartDate?: Date;
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Performance {
  id: string;
  artistId: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  cashCollected: number;
  notes?: string;
  createdAt: Date;
}

// ============================================
// ANALYTICS & STATS TYPES
// ============================================

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  averagePrice: number;
  pricePerHour?: number;
  pricePerSqM?: number;
  mediumProfitability: {
    [key: string]: {
      income: number;
      count: number;
      averagePrice: number;
    };
  };
  performanceIncome: number;
  commissionIncome: number;
  salesIncome: number;
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: "artist" | "visitor";
  artistId?: string;
  favorites: string[];
  likedArtworks: string[];
  likedArtists: string[];
}

export type UserRole = "artist" | "visitor" | null;

// ============================================
// UI & PREFERENCES TYPES
// ============================================

export interface UIPreferences {
  theme: "light" | "dark";
  mapView: "street" | "satellite";
}
