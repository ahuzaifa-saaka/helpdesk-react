export default function Header({theme, onToggleTheme, onMenuToggle}) {
  return (
    <div className="header">
      <button className="sidebar-menu-btn" title="Menu" onClick={onMenuToggle}>
        <span className="material-icons">menu</span>
      </button>
      <h1 className="header-text">HELPDESK LITE</h1>
      {/* <span className="button-toggle" onClick={onToggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </span> */}
    </div>
  );
}
