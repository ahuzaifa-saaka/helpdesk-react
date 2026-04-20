export const USERS = [
  {id: "a1", name: "Musah Fahad", role: "Frontend Developer"},
  {id: "a2", name: "Nurudeen Bobby", role: "Backend Developer"},
  {id: "a3", name: "Efua Asante", role: "UI/UX Designer"},
  {id: "a4", name: "Joshua Alabi", role: "DevOps Engineer"},
  {id: "a5", name: "Akosua Adjei", role: "QA Engineer"},
  {id: "a6", name: "Yaw Ofori", role: "Mobile App Developer"},
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
