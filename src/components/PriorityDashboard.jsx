import {useMemo} from "react";
import Chart from "./Chart";
import styles from "./PriorityDashboard.module.css";

const PRIORITY_COLORS = {
  high: "#E24B4A",
  medium: "#EF9F27",
  low: "#1D9E75",
};

export default function PriorityDashboard({tickets}) {
  const counts = useMemo(
    () => ({
      high: tickets.filter((t) => t.priority === "high").length,
      medium: tickets.filter((t) => t.priority === "medium").length,
      low: tickets.filter((t) => t.priority === "low").length,
    }),
    [tickets],
  );

  const total = counts.high + counts.medium + counts.low;
  const maxCount = Math.max(counts.high, counts.medium, counts.low, 1);

  const items = [
    {key: "high", label: "High Priority"},
    {key: "medium", label: "Medium Priority"},
    {key: "low", label: "Low Priority"},
  ];

  return (
    <div className={styles.priorityDashboard}>
      <p className={styles.priorityTitle}>
        <span className="material-icons" style={{fontSize: 15}}>
          flag
        </span>
        Tickets By Priority
      </p>

      <div className={styles.priorityDonuts}>
        {items.map(({key, label}) => (
          <Chart
            key={key}
            count={counts[key]}
            total={total}
            color={PRIORITY_COLORS[key]}
            label={label}
          />
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.priorityBars}>
        {items.map(({key}) => {
          const count = counts[key];
          const barW = Math.round((count / maxCount) * 100);
          const color = PRIORITY_COLORS[key];
          const shortLabel = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <div key={key} className={styles.priorityBarRow}>
              <span className={styles.priorityBarLabel} style={{color}}>
                {shortLabel}
              </span>
              <div className={styles.priorityBarTrack}>
                <div
                  className={styles.priorityBarFill}
                  style={{width: `${barW}%`, background: color}}
                />
              </div>
              <span className={styles.priorityBarCount} style={{color}}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
