import { bucket } from "./config/firebaseAdmin.js";

try {
    const [exists] = await bucket.exists();

    console.log("Firebase Storage connected:", exists);
    console.log("Bucket:", bucket.name);
} catch (error) {
    console.error("Firebase Storage Error:", error);
}