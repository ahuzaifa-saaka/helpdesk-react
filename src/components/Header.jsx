import {useGlobal} from "../context/Appcontext";
import {useNavigate} from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import styles from "./Header.module.css";

export default function Header({onMenuToggle}) {
  const {currentUser, handleLogout, theme, toggleTheme} = useGlobal();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({top: 0, right: 0});

  useEffect(() => {
    function handleOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleAvatarClick() {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setDropdownOpen((o) => !o);
  }

  async function logout() {
    await handleLogout();
    setDropdownOpen(false);
    navigate("/");
  }

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <>
      <div className={styles.header}>
        <button className={styles.menuBtn} title="Menu" onClick={onMenuToggle}>
          <span className="material-icons">menu</span>
        </button>

        <h1 className={styles.headerText}>HELPDESK LITE</h1>

        <div className={styles.headerRight}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <span style={{fontSize: 18}}>
              {theme === "light" ? "🌙" : "☀️"}
            </span>
          </button>

          <button
            ref={avatarRef}
            className={styles.avatar}
            onClick={handleAvatarClick}
            title={currentUser?.name}
          >
            {currentUser?.photo ? (
              <img
                src={currentUser.photo}
                alt={currentUser?.name || "User"}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{fontSize: 13, fontWeight: 700}}>{initials}</span>
            )}
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{top: dropdownPos.top, right: dropdownPos.right}}
        >
          <div className={styles.dropdownProfile}>
            <div className={styles.dropdownAvatar}>
              {currentUser?.photo ? (
                <img
                  src={currentUser.photo}
                  alt={currentUser?.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className={styles.dropdownInfo}>
              <div className={styles.dropdownName}>{currentUser?.name}</div>
              <div className={styles.dropdownEmail}>{currentUser?.email}</div>
              <span className={styles.dropdownRole}>{currentUser?.role}</span>
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          <button className={styles.dropdownLogout} onClick={logout}>
            <span className="material-icons" style={{fontSize: 16}}>
              logout
            </span>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}
