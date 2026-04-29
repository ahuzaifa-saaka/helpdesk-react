import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Oval} from "react-loader-spinner";
import {useGlobal} from "../context/AppContext";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const {handleGoogleLogin, handleEmailLogin, handleEmailSignUp} = useGlobal();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
  }

  function switchTab(t) {
    clearForm();
    setActiveTab(t);
  }

  async function handleGoogle() {
    setError("");
    setIsLoading(true);
    try {
      await handleGoogleLogin();
      navigate("/dashboard");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await handleEmailLogin(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your full name.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    setError("");
    setIsLoading(true);
    try {
      await handleEmailSignUp(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <Oval
          height={60}
          width={60}
          color="#2563eb"
          secondaryColor="#93c5fd"
          strokeWidth={3}
          strokeWidthSecondary={3}
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* ── LEFT ── */}
        <div className={styles.left}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-icons">support_agent</span>
            </div>
            <span className={styles.logoText}>HelpDesk</span>
          </div>

          <div className={styles.welcome}>
            <h2>
              Welcome <br />
              Back!
            </h2>
            <p>
              Log in to your account <br /> and continue from where you <br />{" "}
              left off.
            </p>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className={styles.right}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "signin" ? styles.active : ""}`}
              onClick={() => switchTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${activeTab === "signup" ? styles.active : ""}`}
              onClick={() => switchTab("signup")}
            >
              Create Account
            </button>
          </div>

          {/* Title */}
          <div className={styles.title}>
            {activeTab === "signin" ? (
              <>
                <h4>Login to your account</h4>
                <p>Enter your details below to access your account</p>
              </>
            ) : (
              <>
                <h4>Get started</h4>
                <p>Create your free account in seconds</p>
              </>
            )}
          </div>

          {/* Error message */}
          {error && <div className={styles.error}>{error}</div>}

          {/* ── SIGN IN FORM ── */}
          {activeTab === "signin" && (
            <form className={styles.form} onSubmit={handleSignIn}>
              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <LockIcon />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div className={styles.row}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <a href="#" className={styles.forgot}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Login"}
              </button>

              <div className={styles.divider}>
                <span />
                <p>Or continue with</p>
                <span />
              </div>

              <div className={styles.socialRow}>
                <button
                  type="button"
                  className={styles.googleBtn}
                  onClick={handleGoogle}
                  disabled={isLoading}
                >
                  <GoogleSVG />
                  Google
                </button>
              </div>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {activeTab === "signup" && (
            <form className={styles.form} onSubmit={handleSignUp}>
              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <UserIcon />
                </span>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <LockIcon />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div className={styles.inputField}>
                <span className={styles.fieldIcon}>
                  <LockIcon />
                </span>
                <input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirmPw((v) => !v)}
                >
                  {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create Account"}
              </button>

              <div className={styles.divider}>
                <span />
                <p>Or continue with</p>
                <span />
              </div>

              <div className={styles.socialRow}>
                <button
                  type="button"
                  className={styles.googleBtn}
                  onClick={handleGoogle}
                  disabled={isLoading}
                >
                  <GoogleSVG />
                  Google
                </button>
              </div>
            </form>
          )}

          <p className={styles.switchText}>
            {activeTab === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className={styles.switchLink}
                  onClick={() => switchTab("signup")}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.switchLink}
                  onClick={() => switchTab("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ── */
const MailIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{flexShrink: 0}}>
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
);
