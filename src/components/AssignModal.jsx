// import {useState} from "react";
// import {useGlobal} from "../context/Appcontext";

// export default function AssignModal({
//   isOpen,
//   ticketId,
//   currentAssignee,
//   onAssign,
//   onClose,
// }) {
//   const [search, setSearch] = useState("");
//   const {users} = useGlobal();
//   if (!isOpen) return null;

//   const searchFiltered = users.filter((user) => {
//     user.name.toLowerCase().includes(search.toLowerCase) ||
//       user.role.toLowerCase().includes(search.toLowerCase());
//   });

//   return (
//     <div
//       className="popUp active"
//       id="assignModal"
//       onClick={(e) => {
//         if (e.target.id === "assignModal") onClose();
//       }}
//     >
//       <div
//         className="form-card"
//         style={{maxWidth: 360, maxHeight: "80vh", overflowY: "auto"}}
//       >
//         <span className="close" id="closeAssignBtn" onClick={onClose}>
//           &times;
//         </span>
//         <h3
//           style={{textAlign: "center", color: "#4f6ef7", fontWeight: 800}}
//           className="assign-header"
//         >
//           Assign Ticket
//         </h3>
//         <p
//           style={{
//             color: "var(--text-muted)",
//             fontSize: 13,
//             textAlign: "center",
//             marginBottom: 16,
//           }}
//         >
//           Select a user to assign this ticket to!
//         </p>

//         <input
//           type="text"
//           className="input"
//           placeholder="Search users..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           // style={{paddingLeft: 32, marginBottom: 0}}
//           // autoFocus
//         />
//         <div className="userList" id="userList">
//           {searchFiltered.map((user) => {
//             const initials = user.name
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase();
//             const isCurrent = currentAssignee === user.id;

//             return (
//               <div
//                 key={user.id}
//                 className="user-item"
//                 onClick={() => onAssign(ticketId, user.id, user.name)}
//               >
//                 <div className="user-avatar">{initials}</div>
//                 <div>
//                   <div className="user-name">
//                     {user.name}
//                     {isCurrent && (
//                       <span style={{color: "var(--assigned)", fontSize: 11}}>
//                         • current
//                       </span>
//                     )}
//                   </div>
//                   <div className="user-role">{user.role}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import {useState, useEffect} from "react";
import {useGlobal} from "../context/AppContext";

export default function AssignModal({
  isOpen,
  ticketId,
  currentAssignee,
  onAssign,
  onClose,
}) {
  const {users} = useGlobal();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(currentAssignee || null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelected(currentAssignee || null);
    }
  }, [isOpen, currentAssignee]);

  if (!isOpen) return null;

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAssign() {
    if (!selected) return;
    const user = users.find((u) => u.id === selected);
    onAssign(ticketId, user.id, user.name);
  }

  return (
    <div
      className="popUp active"
      id="assignModal"
      onClick={(e) => {
        if (e.target.id === "assignModal") onClose();
      }}
    >
      <div
        className="form-card"
        style={{
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h3
          style={{textAlign: "center", color: "#4f6ef7", fontWeight: 800}}
          className="assign-header"
        >
          Assign Ticket
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Select a user to assign this ticket to
        </p>

        {/* Search input */}
        <div style={{position: "relative", marginBottom: 12}}>
          <span
            className="material-icons"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            search
          </span>
          <input
            type="text"
            className="input"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{paddingLeft: 32, marginBottom: 0}}
            autoFocus
          />
        </div>

        {/* User list */}
        <div
          className="userList"
          style={{height: "25rem", overflowY: "auto", marginBottom: 12}}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
                padding: "16px 0",
              }}
            >
              No users found
            </p>
          ) : (
            filtered.map((user) => {
              const initials = user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const isCurrent = currentAssignee === user.id;
              const isSelected = selected === user.id;

              return (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => setSelected(user.id)}
                  style={{
                    border: isSelected
                      ? "1.5px solid #4f6ef7"
                      : "1.5px solid transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "border 0.15s",
                  }}
                >
                  <div
                    className="user-avatar"
                    style={{
                      background: isSelected ? "#4f6ef7" : undefined,
                      color: isSelected ? "#fff" : undefined,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{flex: 1}}>
                    <div className="user-name">
                      {user.name}{" "}
                      {isCurrent && (
                        <span style={{color: "var(--assigned)", fontSize: 11}}>
                          • current
                        </span>
                      )}
                    </div>
                    <div className="user-role">{user.role}</div>
                  </div>
                  {isSelected && (
                    <span
                      className="material-icons"
                      style={{fontSize: 18, color: "#4f6ef7"}}
                    >
                      check_circle
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer buttons */}
        <div style={{display: "flex", gap: 8}}>
          <button
            className="submit-button"
            onClick={handleAssign}
            disabled={!selected}
            style={{
              flex: 1,
              opacity: selected ? 1 : 0.5,
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            Assign
          </button>
          <button
            className="submit-button"
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border-color, #ccc)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
