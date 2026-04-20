import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {useGlobal} from "../context/Appcontext";
import SideBar from "./SideBar";
import Header from "./Header";
import Toast from "./Toast";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.replace("/", "") || "ticket";

  const {theme, toggleTheme, sidebarOpen, setSidebarOpen} = useGlobal();

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SideBar
        activePage={activePage}
        onNavigate={(page) => {
          navigate(`/${page}`);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      <div className="app-main">
        <div className="container">
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            onMenuToggle={() => setSidebarOpen((open) => !open)}
          />
          <Outlet />
        </div>
      </div>

      <Toast />
    </div>
  );
}
