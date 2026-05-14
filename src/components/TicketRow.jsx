import {useEffect, useRef, useState} from "react";
import {formatStatus} from "../utils";
import {useGlobal} from "../context/AppContext";

export default function TicketRow({
  ticket,
  onView,
  onEdit,
  onDelete,
  onAssign,
}) {
  const [showDesc, setShowDesc] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const {currentUser, getUserName} = useGlobal();
  const role = currentUser?.role;
  const userName = getUserName(ticket.assignedTo);

  // function handleRowClick(e) {
  //   if (
  //     e.target.closest(".view-btn") ||
  //     e.target.closest(".edit-btn") ||
  //     e.target.closest(".delete-btn") ||
  //     e.target.closest(".assign-btn")
  //   )
  //     return;
  //   setShowDesc((prev) => !prev);
  // }

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    return function () {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [menuOpen]);

  function handleRowClick(e) {
    if (e.target.closest("dots-menu-wrapper")) return;
    // setShowDesc((prev) => !prev);
  }

  const menuActions = [
    {
      label: "View Ticket",
      icon: "visibility",
      cls: "dots-item-view",
      fn: () => onView(ticket.id),
      roles: ["admin", "agent", "user"],
    },
    {
      label: "Edit Ticket",
      icon: "edit",
      cls: "dots-item-edit",
      fn: () => onEdit(ticket.id),
      roles: ["admin", "agent"],
    },
    {
      label: "Assign / Transiton",
      icon: "assignment_ind",
      cls: "dots-item-assign",
      fn: () => onAssign(ticket.id),
      roles: ["admin", "agent"],
    },
    {
      label: "Delete",
      icon: "delete",
      cls: "dots-item-delete",
      fn: () => onDelete(ticket.id),
      roles: ["admin"],
    },
  ].filter((action) => action.roles.includes(role));

  return (
    <>
      <tr className="main-row" onClick={handleRowClick}>
        <td>{ticket.createdAt || ticket.date || "-"}</td>
        <td
          style={{
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={ticket.title}
        >
          {ticket.title}
        </td>
        <td>
          <span className={`ticket-priority ${ticket.priority}`}>
            {ticket.priority}
          </span>
        </td>
        <td>
          <span className={`status ${ticket.status}`} data-id={ticket.id}>
            {formatStatus(ticket.status)}
          </span>
        </td>
        <td>
          {userName ? (
            <span className="assignee-chip">
              <span className="material-icons" style={{fontSize: 12}}>
                person
              </span>
              {userName}
            </span>
          ) : (
            <span className="unassigned">Unassigned</span>
          )}
        </td>
        <td
          className="hide-mobile"
          style={{fontSize: 12, color: "var(--text-muted)"}}
        >
          {ticket.email}
        </td>
        <td className="active-cell">
          <div className="dots-menu-wrapper" ref={menuRef}>
            <button
              className="dots-btn"
              title="Actions"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
            >
              <span className="material-icons">more_vert</span>
            </button>
            {menuOpen && (
              <div className="dots-dropdown">
                {menuActions.map((action) => (
                  <button
                    key={action.label}
                    className={`dots-item ${action.cls}`}
                    onClick={(e) => {
                      e.stopPropagation;
                      action.fn();
                      setMenuOpen(false);
                    }}
                  >
                    <span className="material-icons dots-item-icon">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </td>
        {/* <td className="active-cell">
          <button
            className="view-btn"
            data-id={ticket.id}
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              onView(ticket.id);
            }}
          >
            <span className="material-icons">visibility</span>
          </button>
          <button
            className="edit-btn"
            data-id={ticket.id}
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ticket.id);
            }}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            className="assign-btn"
            data-id={ticket.id}
            title="Assign"
            onClick={(e) => {
              e.stopPropagation();
              onAssign(ticket.id);
            }}
          >
            <span className="material-icons">assignment_ind</span>
          </button>
          <button
            className="delete-btn"
            data-id={ticket.id}
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticket.id);
            }}
          >
            <span className="material-icons">delete</span>
          </button>
        </td> */}
      </tr>
      <tr
        className="description-row"
        style={{display: showDesc ? "table-row" : "none"}}
      >
        <td colSpan={7} className="description-cell">
          <strong>Description:</strong> {ticket.description}
        </td>
      </tr>
    </>
  );
}
