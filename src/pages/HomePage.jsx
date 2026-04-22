import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGlobal} from "../context/AppContext";
import styles from "./HomePage.module.css";
import {Oval} from "react-loader-spinner";

export default function HomePage() {
  const {isLoggedIn, authLoading} = useGlobal();
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!authLoading && isLoggedIn) navigate("/ticket", {replace: true});
  //   }, [isLoggedIn, authLoading, navigate]);

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
    <div className={styles.wrapper}>
      <div className={styles.overlay} />

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span
            className="material-icons"
            style={{fontSize: 28, color: "var(--accent)"}}
          >
            support_agent
          </span>
          <span className={styles.logoText}>HelpDesk</span>
        </div>
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      <main className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Smart support, simplified
        </div>

        <h1 className={styles.headline}>
          Your team works hard.
          <br />
          <span className={styles.accent}>
            HelpDesk keeps everything on track.
          </span>
        </h1>

        <p className={styles.subtext}>
          Create tickets, assign users, track priorities and resolve issues —
          all in one clean dashboard built for speed and clarity.
        </p>

        <button className={styles.cta} onClick={() => navigate("/login")}>
          GET STARTED
        </button>

        <p className={styles.note}>Sign in with Google or Email</p>
      </main>
    </div>
  );
}
