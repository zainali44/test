// pages/api/admin/createUser.js
import { auth, db } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, additionalData } = req.body;

    try {
      // Create the user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
      });

      // Store additional user data in Firestore
      await db.collection("clients").doc(userRecord.uid).set({
        email,
        ...additionalData,
      });

      res.status(200).json({ message: "User created successfully", userId: userRecord.uid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
