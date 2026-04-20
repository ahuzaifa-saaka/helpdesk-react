import {createContext, useContext, useEffect, useState} from "react";
import {formatStatus} from "../utils";
import {USERS, TICKET_PER_PAGE, TRANSITIONS} from "../constants";
import {showToast} from "../components/Toast";
import {useLocalStorageState} from "../hooks/useLocalStorageState";
import {Oval} from "react-loader-spinner";

import {onAuthStateChanged} from "firebase/auth";
// import {doc, getDoc} from "firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import {auth, db} from "../firebase";
import {
  loginWithGoogle,
  loginWithEmail,
  signUpWithEmail,
  logoutUser,
} from "../services/authService";

const AppContext = createContext();

export const useGlobal = () => useContext(AppContext);

export function AppProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
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

  // firebase
  const [ticketItems, setTicketItems] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userSnap.exists()) {
          setCurrentUser({uid: firebaseUser.uid, ...userSnap.data()});
        } else {
          setCurrentUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            role: "agent",
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const q = query(
          collection(db, "tickets"),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        setTicketItems(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setTicketsLoading(false);
      }
    }
    fetchTickets();
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  // const [ticketItems, setTicketItems] = useState(
  //   () => JSON.parse(localStorage.getItem("ticketItems")) || [],
  // );

  // const [ticketItems, setTicketItems] = useLocalStorageState("ticketItems", []);

  const [users, setUser] = useState(
    () => JSON.parse(localStorage.getItem("users")) || USERS,
  );

  async function handleGoogleLogin() {
    const user = await loginWithGoogle();
    setCurrentUser(user);
    return user;
  }

  async function handleEmailLogin(email, password) {
    const user = await loginWithEmail(email, password);
    setCurrentUser(user);
    return user;
  }

  async function handleEmailSignUp(name, email, password) {
    const user = await signUpWithEmail(name, email, password);
    setCurrentUser(user);
    return user;
  }

  async function handleLogout() {
    await logoutUser();
    setCurrentUser(null);
  }

  // function saveTickets(updated) {
  //   setTicketItems(updated);
  //   localStorage.setItem("ticketItems", JSON.stringify(updated));
  // }

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
  // function handleFormSubmit(formData) {
  //   if (editTicket) {
  //     const updated = ticketItems.map((t) =>
  //       t.id === editTicket.id ? {...t, ...formData} : t,
  //     );
  //     saveTickets(updated);
  //     showToast("Ticket updated.", "success");
  //   } else {
  //     const newTicket = {
  //       id: Date.now(),
  //       ...formData,
  //       status: "open",
  //       createdAt: new Date().toLocaleDateString(),
  //       assignedTo: null,
  //       assignedAt: null,
  //       comments: [],
  //     };
  //     saveTickets([newTicket, ...ticketItems]);
  //     showToast("New ticket created.", "success");
  //   }
  //   setCurrentPage(1);
  //   setFormOpen(false);
  //   setEditTicket(null);

  // }

  function getNextTicketNumber(ticketItems) {
    if (!ticketItems || ticketItems.length === 0) return 1;

    const numbers = ticketItems.map((t) => {
      const match = t.ticketId?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });

    return Math.max(...numbers) + 1;
  }

  function formatTicketId(num) {
    return `TIC-${String(num).padStart(3, "0")}`;
  }

  async function handleFormSubmit(formData) {
    if (editTicket) {
      // UPDATE
      const ref = doc(db, "tickets", editTicket.id);
      await updateDoc(ref, {...formData});
      setTicketItems((prev) =>
        prev.map((t) => (t.id === editTicket.id ? {...t, ...formData} : t)),
      );
      showToast("Ticket updated.", "success");
    } else {
      // CREATE
      const ticketNumber = getNextTicketNumber();
      const newTicket = {
        ticketId: formatTicketId(ticketNumber),
        ...formData,
        status: "open",
        createdAt: new Date().toLocaleDateString(),
        assignedTo: null,
        assignedAt: null,
        comments: [],
      };
      const docRef = await addDoc(collection(db, "tickets"), newTicket);
      setTicketItems((prev) => [{id: docRef.id, ...newTicket}, ...prev]);
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

  // function handleDeleteConfirm(enteredId) {
  //   if (enteredId !== pendingDeleteId) {
  //     showToast("Enter a valid ID", "error");
  //     return;
  //   }
  //   saveTickets(ticketItems.filter((t) => t.id !== pendingDeleteId));
  //   showToast("Ticket deleted", "success");
  //   setDeleteOpen(false);
  //   setPendingDeleteId(null);
  // }

  async function handleDeleteConfirm(enteredId) {
    const ticket = ticketItems.find((t) => t.id === pendingDeleteId);
    if (!ticket) return;

    if (enteredId !== ticket.ticketId && enteredId !== ticket.id) {
      showToast("Enter a valid ID", "error");
      return;
    }
    await deleteDoc(doc(db, "tickets", pendingDeleteId));
    setTicketItems((prev) => prev.filter((t) => t.id !== pendingDeleteId));
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

  // function handleTransition(id, newStatus) {
  //   const ticket = ticketItems.find((t) => t.id === id);
  //   if (!ticket) return;

  //   if (!ticket.assignedTo) {
  //     showToast("Assign the ticket to a user first.", "error");
  //     return;
  //   }

  //   const allowed = TRANSITIONS[ticket.status] || [];
  //   if (!allowed.includes(newStatus)) {
  //     showToast(
  //       `Cannot move from "${formatStatus(ticket.status)}" to "${formatStatus(newStatus)}".`,
  //       "error",
  //     );
  //     return;
  //   }
  //   if (newStatus === "in-progress" && !ticket.assignedTo) {
  //     showToast("Assign the ticket to a user before starting work.", "error");
  //     return;
  //   }

  //   const updated = ticketItems.map((t) =>
  //     t.id === id ? {...t, status: newStatus} : t,
  //   );
  //   saveTickets(updated);
  //   showToast(`Ticket moved to "${formatStatus(newStatus)}".`, "success");
  // }

  async function handleTransition(id, newStatus) {
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
    await updateDoc(doc(db, "tickets", id), {status: newStatus});
    setTicketItems((prev) =>
      prev.map((t) => (t.id === id ? {...t, status: newStatus} : t)),
    );
    showToast(`Ticket moved to "${formatStatus(newStatus)}".`, "success");
  }

  //  Assign
  function openAssignModal(id) {
    setPendingAssignId(id);
    setAssignOpen(true);
  }

  // function handleAssign(id, userId, userName) {
  //   const updated = ticketItems.map((t) =>
  //     t.id === id
  //       ? {
  //           ...t,
  //           assignedTo: userId,
  //           assignedAt: new Date().toLocaleString(),
  //           status: "assigned",
  //         }
  //       : t,
  //   );
  //   saveTickets(updated);
  //   showToast(`Ticket assigned to ${userName}.`, "success");
  //   setAssignOpen(false);
  //   setPendingAssignId(null);
  // }

  async function handleAssign(id, userId, userName) {
    const updates = {
      assignedTo: userId,
      assignedAt: new Date().toLocaleString(),
      status: "assigned",
    };
    await updateDoc(doc(db, "tickets", id), updates);
    setTicketItems((prev) =>
      prev.map((t) => (t.id === id ? {...t, ...updates} : t)),
    );
    showToast(`Ticket assigned to ${userName}.`, "success");
    setAssignOpen(false);
    setPendingAssignId(null);
  }

  //  Comments
  function openCommentModal(id) {
    setPendingCommentId(id);
    setCommentOpen(true);
  }

  // function handleCommentSubmit(author, message) {
  //   if (!author || !message) {
  //     showToast("Please fill in both name and message.", "error");
  //     return;
  //   }
  //   const updated = ticketItems.map((t) =>
  //     t.id === pendingCommentId
  //       ? {
  //           ...t,
  //           comments: [
  //             ...(t.comments || []),
  //             {author, message, createdAt: new Date().toLocaleString()},
  //           ],
  //         }
  //       : t,
  //   );
  //   saveTickets(updated);
  //   showToast("Comment added.", "success");
  //   setCommentOpen(false);
  //   setPendingCommentId(null);
  // }

  async function handleCommentSubmit(author, message) {
    if (!author || !message) {
      showToast("Please fill in both name and message.", "error");
      return;
    }
    const ticket = ticketItems.find((t) => t.id === pendingCommentId);
    if (!ticket) return;

    const newComment = {
      author,
      message,
      createdAt: new Date().toLocaleString(),
    };
    const updatedComments = [...(ticket.comments || []), newComment];

    await updateDoc(doc(db, "tickets", pendingCommentId), {
      comments: updatedComments,
    });
    setTicketItems((prev) =>
      prev.map((t) =>
        t.id === pendingCommentId ? {...t, comments: updatedComments} : t,
      ),
    );
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

        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        handleGoogleLogin,
        handleEmailLogin,
        handleEmailSignUp,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
