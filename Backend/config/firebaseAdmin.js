import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./firebase-adminsdk.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();