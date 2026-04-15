import {USERS} from "./constants";

export function getUserName(userId) {
  if (!userId) return null;
  const found = USERS.find((user) => user.id === userId);
  return found ? found.name : userId;
}

export function formatStatus(status) {
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
