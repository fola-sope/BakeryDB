import { Link } from "react-router";
import { Metrics } from "../components/ui/Metrics";
import { OrdersTable } from "../components/orders/OrdersTable";
import { SalesChart } from "../components/dashboard/SalesChart";
import { StockAttention } from "../components/dashboard/StockAttention";
import { demoOrders, money } from "../sampleData";
import type { Product } from "../sampleData";

export function Dashboard({ products }: { products: Product[] }) {
  const completed = demoOrders.filter((order) => order.status === "Completed");
  const sales = completed.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock < 8);
  const days = [
    "2026-11-10",
    "2026-11-11",
    "2026-11-12",
    "2026-11-13",
    "2026-11-14",
    "2026-11-15",
    "2026-11-16",
  ];
  const dailySales = days.map((date) => ({
    date,
    total: completed
      .filter((order) => order.date === date)
      .reduce((sum, order) => sum + order.total, 0),
  }));

  return (
    <div className="page-stack">
      <div className="section-title">
        <h2>Your bakery at a glance</h2>
        <Link className="button primary" to="/orders">
          View orders →
        </Link>
      </div>
      <Metrics
        items={[
          ["Total sales", money(sales), "Completed sample orders"],
          ["Orders", String(demoOrders.length), "All sample statuses"],
          ["Catalog", String(products.length), "Sample products"],
          [
            "Needs attention",
            String(lowStock.length),
            "Below 8 units (demo rule)",
          ],
        ]}
      />
      <div className="dashboard-grid">
        <section className="content-card">
          <div className="section-title">
            <h2>Sales rhythm</h2>
            <span className="small-note">Nov 10–16 · CAD</span>
          </div>
          <p className="small-note">Completed sample orders by day</p>
          <SalesChart points={dailySales} />
        </section>
        <StockAttention products={lowStock} />
      </div>
      <div className="section-title">
        <h2>Recent orders</h2>
        <Link to="/orders">View all →</Link>
      </div>
      <OrdersTable orders={demoOrders.slice(0, 5)} />
    </div>
  );
}
