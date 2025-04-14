// pages/api/admin/changePassword.js
import { auth } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { userId, newPassword } = req.body;

    try {
      // Change password for the user in Firebase Authentication
      await auth.updateUser(userId, { password: newPassword });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
