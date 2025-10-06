import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Artwork } from "@/types";

const COLLECTION = "artworks";

export const artworksService = {
  // Get all artworks
  async getAll(): Promise<Artwork[]> {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artwork[];
  },

  // Get published artworks
  async getPublished(): Promise<Artwork[]> {
    const q = query(
      collection(db, COLLECTION),
      where("isPublished", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artwork[];
  },

  // Get top artworks
  async getTop(limitCount = 12): Promise<Artwork[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const artworks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artwork[];

    return artworks
      .filter((a) => a.isPublished)
      .sort((a, b) => b.views + b.likes - (a.views + a.likes))
      .slice(0, limitCount);
  },

  // Get artwork by ID
  async getById(id: string): Promise<Artwork | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
    } as Artwork;
  },

  // Get artworks by artist
  async getByArtist(artistId: string): Promise<Artwork[]> {
    const q = query(
      collection(db, COLLECTION),
      where("artistId", "==", artistId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artwork[];
  },

  // Create new artwork
  async create(artworkData: Omit<Artwork, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...artworkData,
      views: 0,
      likes: 0,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // Update artwork
  async update(id: string, data: Partial<Artwork>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
  },

  // Delete artwork
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  },

  // Toggle like
  async toggleLike(id: string, isLiking: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      likes: increment(isLiking ? 1 : -1),
    });
  },

  // Search artworks
  async search(searchTerm: string): Promise<Artwork[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const artworks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artwork[];

    return artworks.filter(
      (artwork) =>
        artwork.isPublished &&
        (artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          artwork.tags.some((t) =>
            t.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  },
};
