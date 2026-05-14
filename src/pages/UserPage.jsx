import {formatStatus} from "../utils";
import AddUserModal from "../components/AddUserModal";
import {useGlobal} from "../context/AppContext";

export default function UsersPage() {
  const {
    users,
    ticketItems,
    addUserOpen,
    setAddUserOpen,
    handleAddUser,
    handleUpdateUserRole,
    currentUser,
  } = useGlobal();

  return (
    <div className="users-page">
      <div className="dashboard-text">
        <h3>Users</h3>
      </div>

      <div className="users-page-header">
        <p className="users-page-subtitle">{users.length} users Available</p>

        <button className="new-ticket-btn" onClick={() => setAddUserOpen(true)}>
          <span
            className="material-icons"
            style={{fontSize: 16, verticalAlign: "middle", marginRight: 4}}
          >
            person_add
          </span>
          Add User
        </button>
      </div>

      <div className="users-grid">
        {users.map((user) => {
          const initials = user.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const assigned = ticketItems.filter((t) => t.assignedTo === user.uid);

          const activeStatuses = assigned
            .filter((t) => !["closed"].includes(t.status))
            .reduce((acc, t) => {
              acc[t.status] = (acc[t.status] || 0) + 1;
              return acc;
            }, {});

          return (
            <div className="user-card" key={user.uid}>
              <div className="user-card-header">
                <div className="user-card-role-change">
                  <select
                    className="input"
                    value={user.role}
                    onChange={(e) => {
                      if (user.uid === currentUser?.uid) {
                        alert("You cannot change your own role.");
                        return;
                      }
                      handleUpdateUserRole(user.uid, e.target.value);
                    }}
                    style={{fontSize: 12, padding: "4px 8px", marginTop: 8}}
                  >
                    <option value="user">user</option>
                    <option value="agent">agent</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div className="user-avatar user-card-avatar">{initials}</div>
                <div className="user-card-info">
                  <div className="user-card-name">{user.name}</div>
                  <div className="user-card-role">{user.role}</div>
                  {user.email && (
                    <div className="user-card-email">{user.email}</div>
                  )}
                </div>
              </div>

              <div className="user-card-tickets-label">
                {assigned.length === 0
                  ? "No ticket assigned"
                  : `${assigned.length} ticket${assigned.length > 1 ? "s" : ""} assigned`}
              </div>

              {Object.keys(activeStatuses).length > 0 && (
                <div className="user-card-breakdown">
                  {Object.entries(activeStatuses).map(([status, count]) => (
                    <span
                      key={status}
                      className={`status ${status}`}
                      style={{fontSize: 10, padding: "2px 8px"}}
                    >
                      {count} {formatStatus(status)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}
