import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/initializeApp";

export const removeFriend = async (
  userUid: string,
  currentFollowers: { uid: string }[],
  friendUid: string
) => {
  try {
    const docRef = doc(db, 'USERS', userUid);
    const updatedFollowers = currentFollowers.filter(f => f.uid !== friendUid);
    await updateDoc(docRef, { f: updatedFollowers });
  } catch (error) {
    console.error("Error removing friend:", error);
  }
};
