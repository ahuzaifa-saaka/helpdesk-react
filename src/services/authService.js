const USERS_KEY = "hd_users";
const SESSION_KEY = "hd_session";
const ADMIN_EMAIL = "admin@helpdesk.com";

// Seed default admin on first run
function seedAdmin() {
  const users = getStoredUsers();
  const adminExists = users.find((u) => u.email === ADMIN_EMAIL);
  if (!adminExists) {
    const admin = {
      uid: "u-admin-001",
      name: "Admin",
      email: ADMIN_EMAIL,
      password: "admin123",
      role: "admin",
      photo: null,
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([...users, admin]);
  }
}

function getStoredUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loginWithEmail(email, password) {
  seedAdmin();
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw {code: "auth/user-not-found"};
  if (user.password !== password) throw {code: "auth/wrong-password"};
  const session = {...user};
  delete session.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signUpWithEmail(name, email, password) {
  seedAdmin();
  const users = getStoredUsers();
  const exists = users.find((u) => u.email === email);
  if (exists) throw {code: "auth/email-already-in-use"};

  const newUser = {
    uid: `u-${Date.now()}`,
    name,
    email,
    password,
    role: email === ADMIN_EMAIL ? "admin" : "user",
    photo: null,
    createdAt: new Date().toISOString(),
  };
  saveStoredUsers([...users, newUser]);
  const session = {...newUser};
  delete session.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

export function getAllUsers() {
  return getStoredUsers().map((u) => {
    const safe = {...u};
    delete safe.password;
    return safe;
  });
}

export function updateUserRole(uid, newRole) {
  const users = getStoredUsers();
  const updated = users.map((u) => (u.uid === uid ? {...u, role: newRole} : u));
  saveStoredUsers(updated);
}
