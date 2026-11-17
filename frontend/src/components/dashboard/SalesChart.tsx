import { money } from "../../sampleData";

type SalesChartProps = { points: { date: string; total: number }[] };

export function SalesChart({ points }: SalesChartProps) {
  const maximum = Math.max(1, ...points.map((point) => point.total));

  return (
    <div className="sales-chart">
      {points.map(({ date, total }) => (
        <div className="chart-column" key={date}>
          <span>{money(total)}</span>
          <div className="chart-track" aria-hidden="true">
            <div
              className="chart-bar"
              style={{ height: `${(total / maximum) * 100}%` }}
            />
          </div>
          <span>
            <span className="sr-only">{date.slice(0, 8)}</span>
            {date.slice(8)}
          </span>
        </div>
      ))}
    </div>
  );
}
