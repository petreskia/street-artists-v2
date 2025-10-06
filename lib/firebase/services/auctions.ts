import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Auction } from "@/types";

const COLLECTION = "auctions";

export const auctionsService = {
  // Get all auctions
  async getAll(): Promise<Auction[]> {
    const q = query(collection(db, COLLECTION), orderBy("endTime", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      endTime: doc.data().endTime?.toDate(),
      bidders: doc.data().bidders?.map((b: any) => ({
        ...b,
        timestamp: b.timestamp?.toDate(),
      })),
    })) as Auction[];
  },

  // Get active auction
  async getActive(): Promise<Auction | null> {
    const q = query(
      collection(db, COLLECTION),
      where("isActive", "==", true),
      orderBy("endTime", "desc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      endTime: doc.data().endTime?.toDate(),
      bidders: doc.data().bidders?.map((b: any) => ({
        ...b,
        timestamp: b.timestamp?.toDate(),
      })),
    } as Auction;
  },

  // Get auction by ID
  async getById(id: string): Promise<Auction | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      endTime: docSnap.data().endTime?.toDate(),
      bidders: docSnap.data().bidders?.map((b: any) => ({
        ...b,
        timestamp: b.timestamp?.toDate(),
      })),
    } as Auction;
  },

  // Create new auction
  async create(
    auctionData: Omit<Auction, "id" | "bidders" | "currentBid">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...auctionData,
      currentBid: auctionData.startingBid,
      bidders: [],
      isActive: true,
    });
    return docRef.id;
  },

  // Place bid
  async placeBid(
    auctionId: string,
    userId: string,
    amount: number
  ): Promise<void> {
    const docRef = doc(db, COLLECTION, auctionId);
    await updateDoc(docRef, {
      currentBid: amount,
      bidders: arrayUnion({
        userId,
        amount,
        timestamp: new Date(),
      }),
    });
  },

  // End auction
  async endAuction(auctionId: string): Promise<void> {
    const docRef = doc(db, COLLECTION, auctionId);
    await updateDoc(docRef, {
      isActive: false,
    });
  },
};
