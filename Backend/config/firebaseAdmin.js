import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Render
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local
  const module = await import("./firebase-adminsdk.json", {
    with: { type: "json" },
  });
  serviceAccount = module.default;
}

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();