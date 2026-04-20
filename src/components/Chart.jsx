import styles from "./Chart.module.css";
const R = 44,
  STROKE = 9,
  C = 2 * Math.PI * R;

export default function Chart({count, total, color, label}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  const dash = (pct / 100) * C;

  return (
    <div className={styles.donutWrap}>
      <svg width="120" height="120" viewBox="0 0 110 110" overflow="visible">
        <circle
          cx="55"
          cy="55"
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          cx="55"
          cy="55"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          transform="rotate(-90 55 55)"
          style={{transition: "stroke-dasharray 0.6s ease"}}
        />
        <text
          x="55"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 18,
            fontWeight: 700,
            fill: color,
            fontFamily: "inherit",
          }}
        >
          {pct}%
        </text>
        <text
          x="55"
          y="67"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 11,
            fill: "var(--text-muted)",
            fontFamily: "inherit",
          }}
        >
          {count} ticket{count !== 1 ? "s" : ""}
        </text>
      </svg>
      <span className={styles.donutLabel} style={{color}}>
        {label}
      </span>
    </div>
  );
}
