import {useGlobal} from "../context/Appcontext";

export default function SearchBar({
  searchValue,
  onSearch,
  filterPriority,
  onFilterPriority,
  filterStatus,
  onFilterStatus,
  filterAssignee,
  onFilterAssignee,
  onNewTicket,
}) {
  const {users} = useGlobal();
  return (
    <div className="search">
      <div className="form">
        <input
          type="text"
          placeholder="Search ticket by title, email or description"
          className="input"
          id="search-input"
          autoComplete="off"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />

        <div className="filter">
          <select
            id="filterByPriority"
            value={filterPriority}
            onChange={(e) => onFilterPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter">
          <select
            id="filterByStatus"
            value={filterStatus}
            onChange={(e) => onFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In-Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>
        </div>

        <div className="filter">
          <select
            id="filterByAssignee"
            value={filterAssignee}
            onChange={(e) => onFilterAssignee(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          id="newTicket"
          className="new-ticket-btn"
          onClick={onNewTicket}
        >
          New Ticket
        </button>
      </div>
    </div>
  );
}
