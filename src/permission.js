export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
};

export const PERMISSIONS = {
  admin: [
    "view_all_tickets",
    "create_ticket",
    "delete_ticket",
    "assign_ticket",
    "manage_users",
    "edit_settings",
    "update_status",
    "add_comment",
  ],
  agent: ["view_all_tickets", "assign_ticket", "update_status", "add_comment"],
  user: ["create_ticket", "view_own_tickets", "add_comment"],
};
