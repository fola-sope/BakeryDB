import { DataTable } from "../ui/DataTable";
import { Badge } from "../ui/Badge";
import { money } from "../../format";
import type { Order } from "../../types";

export function OrdersTable({ orders }: { orders: Order[] }) {
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
        order.date || "Not recorded",
        <span className="numeric">{order.total === null ? "Unavailable" : money(order.total)}</span>,
        <Badge>{order.status}</Badge>,
      ])}
    />
  );
}
