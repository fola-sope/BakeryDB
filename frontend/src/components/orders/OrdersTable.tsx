import { DataTable } from "../ui/DataTable";
import { Badge } from "../ui/Badge";
import { demoOrders, money } from "../../sampleData";

export function OrdersTable({ orders }: { orders: typeof demoOrders }) {
  return (
    <DataTable
      headers={[
        "Order",
        "Customer",
        "Employee",
        "Date",
        "Total (CAD)",
        "Status",
      ]}
      rows={orders.map((order) => [
        `#${order.id}`,
        order.customer,
        order.employee,
        order.date,
        <span className="numeric">{money(order.total)}</span>,
        <Badge>{order.status}</Badge>,
      ])}
    />
  );
}
