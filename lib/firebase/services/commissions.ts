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
import type { Commission } from "@/types";

const COLLECTION = "commissions";

export const commissionsService = {
  // Get all commissions for an artist
  async getByArtist(artistId: string): Promise<Commission[]> {
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
      updatedAt: doc.data().updatedAt?.toDate(),
      preferredStartDate: doc.data().preferredStartDate?.toDate(),
    })) as Commission[];
  },

  // Get commission by ID
  async getById(id: string): Promise<Commission | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
      preferredStartDate: docSnap.data().preferredStartDate?.toDate(),
    } as Commission;
  },

  // Create new commission request
  async create(
    commissionData: Omit<Commission, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...commissionData,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  // Update commission status
  async updateStatus(
    id: string,
    status: Commission["status"],
    notes?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      status,
      notes,
      updatedAt: new Date(),
    });
  },

  // Delete commission
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get commission stats for artist
  async getStats(artistId: string) {
    const commissions = await this.getByArtist(artistId);

    return {
      total: commissions.length,
      pending: commissions.filter((c) => c.status === "Pending").length,
      inProgress: commissions.filter((c) => c.status === "In Progress").length,
      completed: commissions.filter((c) => c.status === "Completed").length,
      rejected: commissions.filter((c) => c.status === "Rejected").length,
      totalValue: commissions
        .filter((c) => c.status === "Completed")
        .reduce((sum, c) => sum + c.budget, 0),
    };
  },
};
