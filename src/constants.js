export const USERS = [
  {id: "a1", name: "Musah Fahad", role: "Default User"},
  {id: "a2", name: "Nurudeen Bobby", role: "Admin"},
  {id: "a3", name: "Efua Asante", role: "Agent"},
  {id: "a4", name: "Joshua Alabi", role: "Default User"},
  {id: "a5", name: "Akosua Adjei", role: "Admin"},
  {id: "a6", name: "Yaw Ofori", role: "Agent"},
];

export const TRANSITIONS = {
  open: ["assigned"],
  assigned: ["in-progress"],
  "in-progress": ["resolved"],
  resolved: ["closed", "reopened"],
  reopened: ["in-progress"],
  closed: [],
};

export const TICKET_PER_PAGE = 7;
