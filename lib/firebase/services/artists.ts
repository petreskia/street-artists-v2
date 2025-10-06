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
  limit,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Artist } from "@/types";

const COLLECTION = "artists";

export const artistsService = {
  // Get all artists
  async getAll(): Promise<Artist[]> {
    const q = query(collection(db, COLLECTION), orderBy("popularity", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artist[];
  },

  // Get artist by ID
  async getById(id: string): Promise<Artist | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
    } as Artist;
  },

  // Get trending artists
  async getTrending(limitCount = 6): Promise<Artist[]> {
    const q = query(
      collection(db, COLLECTION),
      orderBy("popularity", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artist[];
  },

  // Create new artist
  async create(artistData: Omit<Artist, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...artistData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // Update artist
  async update(id: string, data: Partial<Artist>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
  },

  // Delete artist
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Increment likes
  async incrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      likes: increment(1),
      popularity: increment(5),
    });
  },

  // Decrement likes
  async decrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      likes: increment(-1),
      popularity: increment(-5),
    });
  },

  // Search artists
  async search(searchTerm: string): Promise<Artist[]> {
    // Note: For production, use Algolia or similar for better search
    const snapshot = await getDocs(collection(db, COLLECTION));
    const artists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Artist[];

    return artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  },
};
