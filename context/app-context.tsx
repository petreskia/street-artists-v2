"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Artist, Artwork, Auction, User, UIPreferences } from "@/types";

interface AppContextType {
  artists: Artist[];
  artworks: Artwork[];
  auctions: Auction[];
  currentUser: User | null;
  uiPreferences: UIPreferences;
  setCurrentUser: (user: User | null) => void;
  setUIPreferences: (prefs: UIPreferences) => void;
  toggleTheme: () => void;
  toggleFavoriteArtwork: (artworkId: string) => void;
  toggleFavoriteArtist: (artistId: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [uiPreferences, setUIPreferences] = useState<UIPreferences>({
    theme: "light",
    mapView: "street",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load UI preferences from localStorage
    const savedPrefs = localStorage.getItem("uiPreferences");
    if (savedPrefs) {
      setUIPreferences(JSON.parse(savedPrefs));
    }

    // Load current user from localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Subscribe to artists
    const artistsQuery = query(
      collection(db, "artists"),
      orderBy("popularity", "desc")
    );
    const unsubscribeArtists = onSnapshot(artistsQuery, (snapshot) => {
      const artistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Artist[];
      setArtists(artistsData);
    });

    // Subscribe to artworks
    const artworksQuery = query(
      collection(db, "artworks"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeArtworks = onSnapshot(artworksQuery, (snapshot) => {
      const artworksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Artwork[];
      setArtworks(artworksData);
      setLoading(false);
    });

    // Subscribe to auctions
    const auctionsQuery = query(
      collection(db, "auctions"),
      orderBy("endTime", "desc")
    );
    const unsubscribeAuctions = onSnapshot(auctionsQuery, (snapshot) => {
      const auctionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        endTime: doc.data().endTime?.toDate(),
        bidders: doc.data().bidders?.map((b: any) => ({
          ...b,
          timestamp: b.timestamp?.toDate(),
        })),
      })) as Auction[];
      setAuctions(auctionsData);
    });

    return () => {
      unsubscribeArtists();
      unsubscribeArtworks();
      unsubscribeAuctions();
    };
  }, []);

  const toggleTheme = () => {
    const newPrefs = {
      ...uiPreferences,
      theme:
        uiPreferences.theme === "light"
          ? ("dark" as const)
          : ("light" as const),
    };
    setUIPreferences(newPrefs);
    localStorage.setItem("uiPreferences", JSON.stringify(newPrefs));
  };

  const toggleFavoriteArtwork = (artworkId: string) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      likedArtworks: currentUser.likedArtworks.includes(artworkId)
        ? currentUser.likedArtworks.filter((id) => id !== artworkId)
        : [...currentUser.likedArtworks, artworkId],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const toggleFavoriteArtist = (artistId: string) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      likedArtists: currentUser.likedArtists.includes(artistId)
        ? currentUser.likedArtists.filter((id) => id !== artistId)
        : [...currentUser.likedArtists, artistId],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <AppContext.Provider
      value={{
        artists,
        artworks,
        auctions,
        currentUser,
        uiPreferences,
        setCurrentUser,
        setUIPreferences,
        toggleTheme,
        toggleFavoriteArtwork,
        toggleFavoriteArtist,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
