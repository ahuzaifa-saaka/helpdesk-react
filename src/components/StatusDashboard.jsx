export default function StatusDashboard({
  tickets,
  activeFilter,
  onFilterClick,
}) {
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    assigned: tickets.filter((t) => t.status === "assigned").length,
    "in-progress": tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const cards = [
    {
      filter: "",
      label: "Total",
      count: stats.total,
      countId: "totalCount",
      labelStyle: {color: "var(--text-muted)"},
    },
    {
      filter: "open",
      label: "Open",
      count: stats.open,
      countId: "openCount",
      labelStyle: {color: "var(--open)"},
    },
    {
      filter: "assigned",
      label: "Assigned",
      count: stats.assigned,
      countId: "assignedCount",
      labelStyle: {color: "var(--assigned)"},
    },
    {
      filter: "in-progress",
      label: "In Progress",
      count: stats["in-progress"],
      countId: "progressCount",
      labelStyle: {color: "var(--progress)"},
    },
    {
      filter: "resolved",
      label: "Resolved",
      count: stats.resolved,
      countId: "resolvedCount",
      labelStyle: {color: "var(--resolved)"},
    },
    {
      filter: "closed",
      label: "Closed",
      count: stats.closed,
      countId: "closedCount",
      labelStyle: {color: "var(--text-muted)"},
    },
  ];

  return (
    <div className="status-dashboard">
      {cards.map((card) => (
        <div key={card.filter} className="status-card">
          <h4 style={card.labelStyle}>{card.label}</h4>
          <p id={card.countId}>{card.count}</p>
        </div>
      ))}
    </div>
  );
}
