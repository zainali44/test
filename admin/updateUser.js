// pages/api/admin/updateUser.js
import { auth, db } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { userId, updatedInfo } = req.body;

    try {
      // Update user info in Firebase Authentication (e.g., email, displayName)
      if (updatedInfo.email) {
        await auth.updateUser(userId, { email: updatedInfo.email });
      }

      if (updatedInfo.displayName) {
        await auth.updateUser(userId, { displayName: updatedInfo.displayName });
      }

      // Update user data in Firestore
      await db.collection("clients").doc(userId).update(updatedInfo);

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
