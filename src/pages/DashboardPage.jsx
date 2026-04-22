import {useGlobal} from "../context/AppContext";
import StatusDashboard from "../components/StatusDashboard";
import PriorityDashboard from "../components/PriorityDashboard";

export default function DashboardPage() {
  const {ticketItems} = useGlobal();

  return (
    <div>
      <div className="dashboard-text">
        <h3>Dashboard</h3>
      </div>
      <StatusDashboard tickets={ticketItems} />
      <PriorityDashboard tickets={ticketItems} />
    </div>
  );
}
