import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {auth, db} from "../firebase";

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return getUserData(result.user);
}

export async function signUpWithEmail(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, {displayName: name});

  const userData = {
    uid: result.user.uid,
    name,
    email,
    photo: null,
    role: "user",
  };

  await setDoc(doc(db, "users", result.user.uid), userData);
  return userData;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, "users", result.user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData = {
      uid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
      role: "user",
    };
    await setDoc(userRef, userData);
    return userData;
  }

  return getUserData(result.user);
}

export async function logoutUser() {
  await signOut(auth);
}

async function getUserData(firebaseUser) {
  const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  if (userSnap.exists()) {
    return {
      uid: firebaseUser.uid,
      ...userSnap.data(),
    };
  }
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    photo: firebaseUser.photoURL,
    role: "user",
  };
}
