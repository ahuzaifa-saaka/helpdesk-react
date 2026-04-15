import {useGlobal} from "../context/Appcontext";

export default function AssignModal({
  isOpen,
  ticketId,
  currentAssignee,
  onAssign,
  onClose,
}) {
  const {users} = useGlobal();
  if (!isOpen) return null;

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
        style={{maxWidth: 360, maxHeight: "80vh", overflowY: "auto"}}
      >
        <span className="close" id="closeAssignBtn" onClick={onClose}>
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
            marginBottom: 16,
          }}
        >
          Select a user to assign this ticket to!
        </p>
        <div className="userList" id="userList">
          {users.map((user) => {
            const initials = user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const isCurrent = currentAssignee === user.id;

            return (
              <div
                key={user.id}
                className="user-item"
                onClick={() => onAssign(ticketId, user.id, user.name)}
              >
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="user-name">
                    {user.name}
                    {isCurrent && (
                      <span style={{color: "var(--assigned)", fontSize: 11}}>
                        • current
                      </span>
                    )}
                  </div>
                  <div className="user-role">{user.role}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
