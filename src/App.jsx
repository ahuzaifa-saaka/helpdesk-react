// import Toast, {showToast} from "./components/Toast";
import Toast from "./components/Toast";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
// import UsersPage from "./components/UsersPage";
import UserTeam from "./pages/UserTeam";
import {useGlobal} from "./context/Appcontext";
import {
  useNavigate,
  useLocation,
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.replace("/", "") || "dashboard";
  const {
    theme,
    toggleTheme,

    sidebarOpen,
    setSidebarOpen,

    ticketItems,
    users,

    setAddUserOpen,
  } = useGlobal();

  return (
    <div className="app-layout">
      {/* Sidebar overlay for mobile */}
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
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserTeam />} />

            {/* <Route
              path="/analytics"
              element={
                <div>
                  <h3>Analytics comming soon</h3>
                </div>
              }
            /> */}
          </Routes>
        </div>
      </div>

      <Toast />
    </div>
  );
}
