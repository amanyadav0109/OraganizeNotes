import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./firebase-adminsdk.json" with { type: "json" };

let credentials = serviceAccount;

// On Render use environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}

initializeApp({
  credential: cert(credentials),
});

export const adminAuth = getAuth();