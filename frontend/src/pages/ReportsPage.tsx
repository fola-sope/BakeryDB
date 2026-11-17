import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { Metrics } from "../components/ui/Metrics";
import { OrdersTable } from "../components/orders/OrdersTable";
import { demoOrders, money } from "../sampleData";

export function Reports() {
  const [tab, setTab] = useState("Reports");
  const [start, setStart] = useState("2026-11-10");
  const [end, setEnd] = useState("2026-11-16");
  const [range, setRange] = useState({ start, end });
  const orders = demoOrders.filter(
    (order) =>
      order.date >= range.start &&
      order.date <= range.end &&
      order.status === "Completed",
  );
  const sales = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="page-stack">
      <Tabs items={["Reports", "Audit Logs"]} active={tab} onChange={setTab} />
      {tab === "Reports" ? (
        <>
          <form
            className="filter-bar"
            onSubmit={(event) => {
              event.preventDefault();
              setRange({ start, end });
            }}
          >
            <label>
              Report type
              <select>
                <option>Sales summary</option>
              </select>
            </label>
            <label>
              From
              <input
                type="date"
                required
                value={start}
                max={end}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                required
                value={end}
                min={start}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
            <button className="button primary" type="submit">
              Generate sample report
            </button>
          </form>
          <p className="small-note" role="status">
            Sales summary: {range.start} to {range.end}. Completed sample orders
            only.
          </p>
          <Metrics
            items={[
              ["Total sales", money(sales), "Completed sample orders"],
              [
                "Total orders",
                String(orders.length),
                "Completed within selected dates",
              ],
              [
                "Average order value",
                money(orders.length ? sales / orders.length : 0),
                "Sales divided by completed orders",
              ],
            ]}
          />
          <OrdersTable key={`${range.start}-${range.end}`} orders={orders} />
          <section className="content-card">
            <h2>Top-selling products</h2>
            <p className="small-note">
              Product rankings require order-line quantities and revenue data.
              These are not available yet.
            </p>
          </section>
        </>
      ) : (
        <section className="content-card">
          <h2>Audit logs integration pending</h2>
          <p className="small-note">
            Audit fields and retrieval endpoints need confirmation. Sample edits
            do not create database audit records.
          </p>
        </section>
      )}
    </div>
  );
}
