// pages/api/admin/getUsers.js
import { auth, db } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get all users from Firebase Authentication (paginated)
      const userList = [];
      let nextPageToken = null;

      do {
        const listUsersResult = await auth.listUsers(1000, nextPageToken); // Adjust 1000 as per needs
        nextPageToken = listUsersResult.pageToken;

        userList.push(...listUsersResult.users.map((userRecord) => ({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
        })));
      } while (nextPageToken);

      // Get additional user data from Firestore
      const firestoreUserDocs = await db.collection("clients").get();
      const firestoreUsers = firestoreUserDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine Firebase Authentication and Firestore data
      const users = userList.map((user) => {
        const firestoreUser = firestoreUsers.find((doc) => doc.id === user.uid);
        return { ...user, ...firestoreUser }; // Merge info from Firestore
      });

      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
