import {createContext, useContext, useEffect, useState} from "react";
import {formatStatus} from "../utils";
import {USERS, TICKET_PER_PAGE, TRANSITIONS} from "../constants";
import {showToast} from "../components/Toast";
import {useLocalStorageState} from "../hooks/useLocalStorageState";

const AppContext = createContext();

export const useGlobal = () => useContext(AppContext);

export function AppProvider({children}) {
  //  Modal states
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

  //  Filters & search
  const [searchValue, setSearchValue] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  const [ticketItems, setTicketItems] = useState(
    () => JSON.parse(localStorage.getItem("ticketItems")) || [],
  );

  // const [ticketItems, setTicketItems] = useLocalStorageState("ticketItems", []);

  const [users, setUser] = useState(
    () => JSON.parse(localStorage.getItem("users")) || USERS,
  );

  function saveTickets(updated) {
    setTicketItems(updated);
    localStorage.setItem("ticketItems", JSON.stringify(updated));
  }

  function saveUsers(updated) {
    setUser(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  }

  function handleStatusCardClick(filter) {
    if (activeFilter === filter && filter !== "") {
      setActiveFilter("");
    } else {
      setActiveFilter(filter);
      setFilterStatus("");
    }
    setCurrentPage(1);
  }

  function handleFilterChange(setter) {
    return (value) => {
      setActiveFilter("");
      setter(value);
      setCurrentPage(1);
    };
  }

  //  Derived filtered + paginated list
  const effectiveStatus = filterStatus || activeFilter;

  const filtered = ticketItems.filter((ticket) => {
    const sv = searchValue.toLowerCase();
    return (
      (!filterPriority || ticket.priority === filterPriority) &&
      (!effectiveStatus || ticket.status === effectiveStatus) &&
      (!filterAssignee || ticket.assignedTo === filterAssignee) &&
      (ticket.title.toLowerCase().includes(sv) ||
        ticket.email.toLowerCase().includes(sv) ||
        ticket.description.toLowerCase().includes(sv))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / TICKET_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * TICKET_PER_PAGE,
    safePage * TICKET_PER_PAGE,
  );

  //  Keyboard ESC
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

  //  Form submit (create / edit)
  function handleFormSubmit(formData) {
    if (editTicket) {
      const updated = ticketItems.map((t) =>
        t.id === editTicket.id ? {...t, ...formData} : t,
      );
      saveTickets(updated);
      showToast("Ticket updated.", "success");
    } else {
      const newTicket = {
        id: Date.now(),
        ...formData,
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

  //  Delete
  function openDeleteModal(id) {
    setPendingDeleteId(id);
    setDeleteOpen(true);
  }

  function handleDeleteConfirm(enteredId) {
    if (enteredId !== pendingDeleteId) {
      showToast("Enter a valid ID", "error");
      return;
    }
    saveTickets(ticketItems.filter((t) => t.id !== pendingDeleteId));
    showToast("Ticket deleted", "success");
    setDeleteOpen(false);
    setPendingDeleteId(null);
  }

  //  Detail view
  function openTicketDetail(id) {
    setActiveDetailId(id);
    setDetailOpen(true);
  }

  //  Transitions

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
    if (newStatus === "in-progress" && !ticket.assignedTo) {
      showToast("Assign the ticket to a user before starting work.", "error");
      return;
    }

    const updated = ticketItems.map((t) =>
      t.id === id ? {...t, status: newStatus} : t,
    );
    saveTickets(updated);
    showToast(`Ticket moved to "${formatStatus(newStatus)}".`, "success");
  }

  //  Assign
  function openAssignModal(id) {
    setPendingAssignId(id);
    setAssignOpen(true);
  }

  function handleAssign(id, userId, userName) {
    const updated = ticketItems.map((t) =>
      t.id === id
        ? {
            ...t,
            assignedTo: userId,
            assignedAt: new Date().toLocaleString(),
            status: "assigned",
          }
        : t,
    );
    saveTickets(updated);
    showToast(`Ticket assigned to ${userName}.`, "success");
    setAssignOpen(false);
    setPendingAssignId(null);
  }

  //  Comments
  function openCommentModal(id) {
    setPendingCommentId(id);
    setCommentOpen(true);
  }

  function handleCommentSubmit(author, message) {
    if (!author || !message) {
      showToast("Please fill in both name and message.", "error");
      return;
    }
    const updated = ticketItems.map((t) =>
      t.id === pendingCommentId
        ? {
            ...t,
            comments: [
              ...(t.comments || []),
              {author, message, createdAt: new Date().toLocaleString()},
            ],
          }
        : t,
    );
    saveTickets(updated);
    showToast("Comment added.", "success");
    setCommentOpen(false);
    setPendingCommentId(null);
  }

  // Add user

  function handleAddUser(userData) {
    const newUser = {
      id: `u-${Date.now()}`,
      name: userData.name,
      role: userData.role,
      email: userData.email,
    };
    saveUsers([...users, newUser]);
    showToast(`User "${userData.name}" added to the team`, "success");
    setAddUserOpen(false);
  }

  //  Derived data for modals
  const activeDetailTicket =
    ticketItems.find((t) => t.id === activeDetailId) || null;
  const pendingDeleteTicket =
    ticketItems.find((t) => t.id === pendingDeleteId) || null;
  const pendingAssignTicket =
    ticketItems.find((t) => t.id === pendingAssignId) || null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [activePage, setActivePage] = useState("dashboard");

  function getUserName(userId) {
    if (!userId) return null;
    return users.find((user) => user.id === userId)?.name ?? userId;
  }
  return (
    <AppContext.Provider
      value={{
        // theme
        theme,
        toggleTheme,
        // sidebar
        sidebarOpen,
        setSidebarOpen,
        // tickets & users data
        ticketItems,
        users,
        filtered,
        paginated,
        safePage,
        totalPages,
        // search & filters
        searchValue,
        setSearchValue,
        filterPriority,
        filterStatus,
        filterAssignee,
        activeFilter,
        currentPage,
        setCurrentPage,
        handleStatusCardClick,
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

        // activePage,
        // setActivePage,

        setActiveDetailId,
        activeDetailId,
        setPendingAssignId,
        setPendingCommentId,
        setPendingDeleteId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
