import TicketRow from "./TicketRow";

export default function TicketTable({
  tickets,
  getUserName,
  onView,
  onEdit,
  onDelete,
  onAssign,
}) {
  return (
    <div className="description">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th className="hide-mobile">Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="ticket-list">
          {tickets.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: 32,
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                getUserName={getUserName}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onAssign={onAssign}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
