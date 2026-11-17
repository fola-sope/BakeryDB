import { useState } from "react";
import { OrdersTable } from "../components/orders/OrdersTable";
import { demoOrders } from "../sampleData";

export function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const filtered = demoOrders.filter(
    (order) =>
      `${order.id} ${order.customer}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!status || order.status === status) &&
      (!date || order.date === date),
  );
  return (
    <div className="page-stack">
      <p className="inline-notice">
        Order creation will be enabled once pricing, stock validation, and the
        protected order API are confirmed.
      </p>
      <div className="filter-bar">
        <label>
          Search orders
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Order number or customer"
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {["Completed", "Processing", "Cancelled"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Order date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <button
          className="button secondary"
          onClick={() => {
            setSearch("");
            setStatus("");
            setDate("");
          }}
        >
          Reset filters
        </button>
      </div>
      <OrdersTable key={`${search}-${status}-${date}`} orders={filtered} />
    </div>
  );
}
