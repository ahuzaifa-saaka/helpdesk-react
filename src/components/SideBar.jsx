import {useGlobal} from "../context/AppContext";
const nav_item = [
  {id: "dashboard", icon: "dashboard", label: "Dashboard"},
  {id: "ticket", icon: "support_agent", label: "Ticket"},
  {id: "users", icon: "group", label: "Users"},
];

export default function SideBar({activePage, onNavigate, isOpen}) {
  const {users, ticketItems, theme, toggleTheme, currentUser} = useGlobal();
  const totalCount = ticketItems.length;

  const visibleNavItems = nav_item.filter((item) => {
    if (item.id === "users") return currentUser?.role === "admin";
    return true;
  });

  return (
    <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
      <div className="sidebar-logo">
        <span className="material-icons sidebar-logo-icon">support_agent</span>
        <span className="sidebar-logo-text">HelpDesk</span>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Main Menu</p>
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item${activePage === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="material-icons sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
            {item.id === "ticket" && totalCount > 0 && (
              <span className="sidebar-badge">{totalCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <span
            className="material-icons"
            style={{fontSize: 13, color: "var(--resolved)"}}
          >
            circle
          </span>
          <span style={{fontSize: 11, color: "var(--text-muted)"}}>
            {users.length} users online{" "}
          </span>
        </div>
      </div>
    </aside>
  );
}
