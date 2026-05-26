import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../firebase";
import {
  loginWithGoogle,
  loginWithEmail,
  signUpWithEmail,
  logoutUser,
} from "../services/authService";

import {createContext, useContext, useState, useEffect} from "react";
// import {useGlobal} from "./Appcontext";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({children}) {
  //   const {users} = useGlobal();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userSnap.exists()) {
          setCurrentUser({uid: firebaseUser.uid, ...userSnap.data()});
        } else {
          setCurrentUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            role: "user",
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  async function handleGoogleLogin() {
    const user = await loginWithGoogle();
    setCurrentUser(user);
    return user;
  }

  async function handleEmailLogin(email, password) {
    const user = await loginWithEmail(email, password);
    setCurrentUser(user);
    return user;
  }

  async function handleEmailSignUp(name, email, password) {
    const user = await signUpWithEmail(name, email, password);
    setCurrentUser(user);
    return user;
  }

  async function handleLogout() {
    await logoutUser();
    setCurrentUser(null);
  }

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--bg)",
        }}
      >
        <Oval
          height={60}
          width={60}
          color="#4f6ef7"
          secondaryColor="#7c3aed"
          strokeWidth={3}
          strokeWidthSecondary={3}
          visible={true}
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        handleGoogleLogin,
        handleEmailLogin,
        handleEmailSignUp,
        handleLogout,
        authLoading,
        setAuthLoading,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
