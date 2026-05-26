import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {db} from "../firebase";

// REAL-TIME LISTENER
export function subscribeToTickets(callback) {
  const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tickets);
  });
}

// CREATE
export async function createTicket(data, user) {
  return await addDoc(collection(db, "tickets"), {
    ...data,
    createdBy: user.uid,
    status: "open",
    assignedTo: null,
    createdAt: Date.now(),
    comments: [],
  });
}

// UPDATE STATUS
export async function updateTicketStatus(id, status) {
  return await updateDoc(doc(db, "tickets", id), {status});
}

// ASSIGN
export async function assignTicket(id, userId) {
  return await updateDoc(doc(db, "tickets", id), {
    assignedTo: userId,
    status: "assigned",
    assignedAt: Date.now(),
  });
}

// COMMENT
export async function addComment(id, comments) {
  return await updateDoc(doc(db, "tickets", id), {
    comments,
  });
}

// DELETE
export async function deleteTicket(id) {
  return await deleteDoc(doc(db, "tickets", id));
}
