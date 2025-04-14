// pages/api/admin/deleteUser.js
import { auth, db } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { userId } = req.body;

    try {
      // Delete user from Firebase Authentication
      await auth.deleteUser(userId);

      // Delete user data from Firestore
      await db.collection("clients").doc(userId).delete();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
