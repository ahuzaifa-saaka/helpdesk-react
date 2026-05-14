import {createContext, useContext, useEffect, useState} from "react";
import {formatStatus} from "../utils";
import {TICKET_PER_PAGE, TRANSITIONS} from "../constants";
import {showToast} from "../components/Toast";
import Spinner from "../components/Spinner";

import {
  loginWithEmail,
  signUpWithEmail,
  logoutUser,
  getCurrentSession,
  getAllUsers,
  updateUserRole,
} from "../services/authService";

const TICKETS_KEY = "hd_tickets";

const AppContext = createContext();

export const useGlobal = () => useContext(AppContext);

export function AppProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [activeDetailId, setActiveDetailId] = useState(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [pendingAssignId, setPendingAssignId] = useState(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [pendingCommentId, setPendingCommentId] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [addUserOpen, setAddUserOpen] = useState(false);

  // Tickets
  const [ticketItems, setTicketItems] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Users
  const [users, setUsers] = useState(() => getAllUsers());

  // Filters & search
  const [searchValue, setSearchValue] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  // Theme effect
  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Restore session on load
  useEffect(() => {
    const session = getCurrentSession();
    setCurrentUser(session);
    setAuthLoading(false);
  }, []);

  // Load tickets from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");
    setTicketItems(stored);
  }, []);

  // Load users from localStorage
  // useEffect(() => {
  //   setUsers(getAllUsers());
  // }, []);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  function saveTickets(updated) {
    setTicketItems(updated);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
  }

  function refreshUsers() {
    setUsers(getAllUsers());
  }

  // Auth handlers
  async function handleEmailLogin(email, password) {
    const user = loginWithEmail(email, password);
    setCurrentUser(user);
    return user;
  }

  async function handleEmailSignUp(name, email, password) {
    const user = signUpWithEmail(name, email, password);
    setCurrentUser(user);
    refreshUsers();
    return user;
  }

  async function handleLogout() {
    logoutUser();
    setCurrentUser(null);
  }

  function handleFilterChange(setter) {
    return (value) => {
      setActiveFilter("");
      setter(value);
      setCurrentPage(1);
    };
  }

  // Ticket helpers
  function getNextTicketNumber(items) {
    if (!items || items.length === 0) return 1;
    const numbers = items.map((t) => {
      const match = t.ticketId?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    return Math.max(...numbers) + 1;
  }

  function formatTicketId(num) {
    return `TIC-${String(num).padStart(3, "0")}`;
  }

  // Form submit (create / edit)
  function handleFormSubmit(formData) {
    if (editTicket) {
      const updated = ticketItems.map((t) =>
        t.id === editTicket.id ? {...t, ...formData} : t,
      );
      saveTickets(updated);
      showToast("Ticket updated.", "success");
    } else {
      const ticketNumber = getNextTicketNumber(ticketItems);
      const newTicket = {
        id: `t-${Date.now()}`,
        ticketId: formatTicketId(ticketNumber),
        ...formData,
        createdBy: currentUser?.uid || null,
        createdByEmail: currentUser?.email || null,
        status: "open",
        createdAt: new Date().toLocaleDateString(),
        assignedTo: null,
        assignedAt: null,
        comments: [],
      };
      saveTickets([newTicket, ...ticketItems]);
      showToast("New ticket created.", "success");
    }
    setCurrentPage(1);
    setFormOpen(false);
    setEditTicket(null);
  }

  function openEditModal(id) {
    const ticket = ticketItems.find((t) => t.id === id);
    if (!ticket) return;
    setEditTicket(ticket);
    setFormOpen(true);
  }

  // Delete
  function openDeleteModal(id) {
    setPendingDeleteId(id);
    setDeleteOpen(true);
  }

  function handleDeleteConfirm(enteredId) {
    const ticket = ticketItems.find((t) => t.id === pendingDeleteId);
    if (!ticket) return;
    if (enteredId !== ticket.ticketId && enteredId !== ticket.id) {
      showToast("Enter a valid ID", "error");
      return;
    }
    saveTickets(ticketItems.filter((t) => t.id !== pendingDeleteId));
    showToast("Ticket deleted", "success");
    setDeleteOpen(false);
    setPendingDeleteId(null);
  }

  // Detail view
  function openTicketDetail(id) {
    setActiveDetailId(id);
    setDetailOpen(true);
  }

  // Transitions
  function handleTransition(id, newStatus) {
    const ticket = ticketItems.find((t) => t.id === id);
    if (!ticket) return;
    if (!ticket.assignedTo) {
      showToast("Assign the ticket to a user first.", "error");
      return;
    }
    const allowed = TRANSITIONS[ticket.status] || [];
    if (!allowed.includes(newStatus)) {
      showToast(
        `Cannot move from "${formatStatus(ticket.status)}" to "${formatStatus(newStatus)}".`,
        "error",
      );
      return;
    }
    const updated = ticketItems.map((t) =>
      t.id === id ? {...t, status: newStatus} : t,
    );
    saveTickets(updated);
    showToast(`Ticket moved to "${formatStatus(newStatus)}".`, "success");
  }

  // Assign
  function openAssignModal(id) {
    setPendingAssignId(id);
    setAssignOpen(true);
  }

  function handleAssign(id, userId, userName) {
    const updates = {
      assignedTo: userId,
      assignedAt: new Date().toLocaleString(),
      status: "assigned",
    };
    const updated = ticketItems.map((t) =>
      t.id === id ? {...t, ...updates} : t,
    );
    saveTickets(updated);
    showToast(`Ticket assigned to ${userName}.`, "success");
    setAssignOpen(false);
    setPendingAssignId(null);
  }

  // Comments
  function openCommentModal(id) {
    setPendingCommentId(id);
    setCommentOpen(true);
  }

  function handleCommentSubmit(author, message) {
    if (!author || !message) {
      showToast("Please fill in both name and message.", "error");
      return;
    }
    const newComment = {
      author,
      message,
      createdAt: new Date().toLocaleString(),
    };
    const updated = ticketItems.map((t) =>
      t.id === pendingCommentId
        ? {...t, comments: [...(t.comments || []), newComment]}
        : t,
    );
    saveTickets(updated);
    showToast("Comment added.", "success");
    setCommentOpen(false);
    setPendingCommentId(null);
  }

  // Add user (admin only)
  // ✅ CORRECT — actually saves to localStorage via authService
  function handleAddUser(userData) {
    try {
      signUpWithEmail(userData.name, userData.email, userData.password);
      // Override role since signUpWithEmail defaults to "user"
      const allUsers = JSON.parse(localStorage.getItem("hd_users") || "[]");
      const updated = allUsers.map((u) =>
        u.email === userData.email ? {...u, role: userData.role} : u,
      );
      localStorage.setItem("hd_users", JSON.stringify(updated));
      refreshUsers();
      showToast(`User "${userData.name}" added to the team`, "success");
      setAddUserOpen(false);
    } catch (err) {
      showToast(
        err.code === "auth/email-already-in-use"
          ? "A user with this email already exists."
          : "Failed to add user.",
        "error",
      );
    }
  }

  // Role update (admin only)
  function handleUpdateUserRole(uid, newRole) {
    updateUserRole(uid, newRole);
    refreshUsers();
    showToast("User role updated.", "success");
  }

  function getUserName(userId) {
    if (!userId) return null;
    return users.find((u) => u.uid === userId)?.name ?? userId;
  }

  // Derived: filter tickets by role
  const effectiveStatus = filterStatus || activeFilter;

  const filtered = ticketItems.filter((ticket) => {
    // user role: only see their own tickets
    if (currentUser?.role === "user") {
      if (ticket.createdByEmail !== currentUser.email) return false;
    }

    const sv = searchValue.toLowerCase();
    return (
      (!filterPriority || ticket.priority === filterPriority) &&
      (!effectiveStatus || ticket.status === effectiveStatus) &&
      (!filterAssignee || ticket.assignedTo === filterAssignee) &&
      (ticket.title?.toLowerCase().includes(sv) ||
        ticket.email?.toLowerCase().includes(sv) ||
        ticket.description?.toLowerCase().includes(sv))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / TICKET_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * TICKET_PER_PAGE,
    safePage * TICKET_PER_PAGE,
  );

  // Keyboard ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setFormOpen(false);
        setDeleteOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Derived modal data
  const activeDetailTicket =
    ticketItems.find((t) => t.id === activeDetailId) || null;
  const pendingDeleteTicket =
    ticketItems.find((t) => t.id === pendingDeleteId) || null;
  const pendingAssignTicket =
    ticketItems.find((t) => t.id === pendingAssignId) || null;

  if (authLoading) return <Spinner />;

  return (
    <AppContext.Provider
      value={{
        // theme
        theme,
        toggleTheme,
        // sidebar
        sidebarOpen,
        setSidebarOpen,
        // tickets & users
        ticketItems,
        users,
        filtered,
        paginated,
        safePage,
        totalPages,
        ticketsLoading,
        // search & filters
        searchValue,
        setSearchValue,
        filterPriority,
        filterStatus,
        filterAssignee,
        activeFilter,
        currentPage,
        setCurrentPage,
        handleFilterChange,
        setFilterPriority,
        setFilterStatus,
        setFilterAssignee,
        // ticket actions
        handleFormSubmit,
        openEditModal,
        openDeleteModal,
        handleDeleteConfirm,
        openTicketDetail,
        handleTransition,
        openAssignModal,
        handleAssign,
        openCommentModal,
        handleCommentSubmit,
        handleAddUser,
        handleUpdateUserRole,
        getUserName,
        // modal states
        formOpen,
        setFormOpen,
        editTicket,
        setEditTicket,
        detailOpen,
        setDetailOpen,
        assignOpen,
        setAssignOpen,
        pendingAssignId,
        commentOpen,
        setCommentOpen,
        deleteOpen,
        setDeleteOpen,
        addUserOpen,
        setAddUserOpen,
        // derived modal data
        activeDetailTicket,
        pendingDeleteTicket,
        pendingAssignTicket,
        setActiveDetailId,
        activeDetailId,
        setPendingAssignId,
        setPendingCommentId,
        setPendingDeleteId,
        // auth
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        isAgent: currentUser?.role === "agent",
        isUser: currentUser?.role === "user",
        handleEmailLogin,
        handleEmailSignUp,
        handleLogout,
        authLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
