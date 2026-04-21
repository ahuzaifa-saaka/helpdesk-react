import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGlobal} from "../context/Appcontext";
import styles from "./LoginPage.module.css";
import Spinner from "../components/Spinner";

export default function LoginPage() {
  const {handleGoogleLogin, handleEmailLogin, handleEmailSignUp, authLoading} =
    useGlobal();
  const navigate = useNavigate();

  const [tab, setTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
  }

  function switchTab(t) {
    clearForm();
    setTab(t);
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await handleGoogleLogin();
      navigate("/dashboard");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await handleEmailLogin(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your full name.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    setError("");
    setLoading(true);
    try {
      await handleEmailSignUp(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function friendlyError(code) {
    const map = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/user-not-found": "No account found with this email.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/invalid-credential": "Incorrect email or password.",
    };
    return map[code] || "Something went wrong. Please try again.";
  }

  if (authLoading) {
    <Spinner />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} />

      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          <span className="material-icons" style={{fontSize: 18}}>
            arrow_back
          </span>
          Back
        </button>
        <div className={styles.logo}>
          <span
            className="material-icons"
            style={{fontSize: 24, color: "var(--accent)"}}
          >
            support_agent
          </span>
          <span className={styles.logoText}>HelpDesk</span>
        </div>
        <div style={{width: 80}} />
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === "signin" ? styles.activeTab : ""}`}
              onClick={() => switchTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${tab === "signup" ? styles.activeTab : ""}`}
              onClick={() => switchTab("signup")}
            >
              Create Account
            </button>
          </div>

          {/* Title */}
          <div className={styles.title}>
            {tab === "signin" ? (
              <>
                <h2>Welcome back</h2>
                <p>Sign in to your HelpDesk account</p>
              </>
            ) : (
              <>
                <h2>Get started</h2>
                <p>Create your free account in seconds</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Sign In Form */}
          {tab === "signin" && (
            <form className={styles.form} onSubmit={handleSignIn}>
              <div className={styles.field}>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === "signup" && (
            <form className={styles.form} onSubmit={handleSignUp}>
              <div className={styles.field}>
                <label>Full name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Confirm password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className={styles.divider}>
            <span />
            <p>or continue with</p>
            <span />
          </div>

          {/* Google — now at bottom */}
          <button
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              style={{flexShrink: 0}}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13 17.7 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"
              />
              <path
                fill="#FBBC05"
                d="M10.4 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.6 10.7l7.8-6z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-4.2-13.6-9.9l-7.8 6C6.6 42.6 14.6 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Switch */}
          <p className={styles.switchText}>
            {tab === "signin" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => switchTab("signup")}>Create one</button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchTab("signin")}>Sign in</button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
