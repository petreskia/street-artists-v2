import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Performance } from "@/types";

const COLLECTION = "performances";

export const performancesService = {
  // Get all performances for an artist
  async getByArtist(artistId: string): Promise<Performance[]> {
    const q = query(
      collection(db, COLLECTION),
      where("artistId", "==", artistId),
      orderBy("startTime", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Performance[];
  },

  // Get performance by ID
  async getById(id: string): Promise<Performance | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      startTime: docSnap.data().startTime?.toDate(),
      endTime: docSnap.data().endTime?.toDate(),
      createdAt: docSnap.data().createdAt?.toDate(),
    } as Performance;
  },

  // Start a new performance
  async start(artistId: string, location: string): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      artistId,
      location,
      startTime: new Date(),
      cashCollected: 0,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  // End performance
  async end(id: string, cashCollected: number, notes?: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      endTime: new Date(),
      cashCollected,
      notes,
    });
  },

  // Update performance
  async update(id: string, data: Partial<Performance>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
  },

  // Delete performance
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Calculate performance stats
  async getStats(artistId: string, startDate?: Date, endDate?: Date) {
    const performances = await this.getByArtist(artistId);

    let filtered = performances.filter((p) => p.endTime); // Only completed performances

    if (startDate) {
      filtered = filtered.filter((p) => p.startTime >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((p) => p.startTime <= endDate);
    }

    const totalHours = filtered.reduce((sum, p) => {
      if (p.endTime) {
        const hours =
          (p.endTime.getTime() - p.startTime.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }
      return sum;
    }, 0);

    const totalCash = filtered.reduce((sum, p) => sum + p.cashCollected, 0);

    return {
      totalPerformances: filtered.length,
      totalHours: Math.round(totalHours * 10) / 10,
      totalCash,
      averagePerHour:
        totalHours > 0 ? Math.round((totalCash / totalHours) * 100) / 100 : 0,
      averagePerPerformance:
        filtered.length > 0
          ? Math.round((totalCash / filtered.length) * 100) / 100
          : 0,
    };
  },
};
