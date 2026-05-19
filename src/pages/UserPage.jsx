import {formatStatus} from "../utils";
import AddUserModal from "../components/AddUserModal";
import {useGlobal} from "../context/AppContext";
import styles from "./UserPage.module.css";
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
    <div className={styles.usersPage}>
      <div className={styles.dashboardText}>
        <h3>Users</h3>
      </div>

      <div className={styles.usersPageHeader}>
        <p className={styles.usersPageSubtitle}>
          {users.length} users Available
        </p>

        <button
          className={styles.newTicketBtn}
          onClick={() => setAddUserOpen(true)}
        >
          <span
            className="material-icons"
            style={{fontSize: 16, verticalAlign: "middle", marginRight: 4}}
          >
            person_add
          </span>
          Add User
        </button>
      </div>

      <div className={styles.usersGrid}>
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
            <div className={styles.userCard} key={user.uid}>
              <div className={styles.userCardHeader}>
                <div className={styles.userCardRoleChange}>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      if (user.uid === currentUser?.uid) {
                        alert("You cannot change your own role.");
                        return;
                      }
                      handleUpdateUserRole(user.uid, e.target.value);
                    }}
                  >
                    <option value="user">user</option>
                    <option value="agent">agent</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div
                  className={`${styles.userAvatar} ${styles.userCardAvatar}`}
                >
                  {initials}
                </div>

                <div className={styles.userCardInfo}>
                  <div className={styles.userCardName}>{user.name}</div>
                  <div className={styles.userCardRole}>{user.role}</div>
                  {user.email && (
                    <div className={styles.userCardEmail}>{user.email}</div>
                  )}
                </div>
              </div>

              <div className={styles.userCardTicketsLabel}>
                {assigned.length === 0
                  ? "No ticket assigned"
                  : `${assigned.length} ticket${assigned.length > 1 ? "s" : ""} assigned`}
              </div>

              {Object.keys(activeStatuses).length > 0 && (
                <div className={styles.userCardBreakdown}>
                  {Object.entries(activeStatuses).map(([status, count]) => (
                    <span
                      key={status}
                      className={`${styles.status} ${styles[status] ?? ""}`}
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
