import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { DataTable } from "../components/ui/DataTable";
import { demoCustomers, demoOrders, money } from "../sampleData";

export function CustomersPayments() {
  const [tab, setTab] = useState("Customers");
  const [search, setSearch] = useState("");
  return (
    <div className="page-stack">
      <Tabs items={["Customers", "Payments"]} active={tab} onChange={setTab} />
      <div className="filter-bar">
        <label>
          Search customers
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Customer name or phone"
          />
        </label>
        <button className="button secondary" onClick={() => setSearch("")}>
          Reset
        </button>
      </div>
      {tab === "Customers" ? (
        <DataTable
          key={search}
          headers={[
            "Customer ID",
            "Customer name",
            "Phone",
            "Total orders",
            "Total spent (CAD)",
          ]}
          rows={demoCustomers
            .filter((customer) =>
              `${customer.name} ${customer.phone}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((customer) => {
              const orders = demoOrders.filter(
                (order) => order.customer === customer.name,
              );
              return [
                `CUS-${String(customer.id).padStart(3, "0")}`,
                <strong>{customer.name}</strong>,
                customer.phone,
                orders.length,
                money(
                  orders
                    .filter((order) => order.status === "Completed")
                    .reduce((sum, order) => sum + order.total, 0),
                ),
              ];
            })}
        />
      ) : (
        <section className="content-card">
          <h2>Payments integration pending</h2>
          <p className="small-note">
            Payment records, methods, and refund rules have not been confirmed.
            Completed orders are not treated as proof of payment.
          </p>
        </section>
      )}
      <p className="small-note">
        Customer creation and editing require a confirmed protected API.
      </p>
    </div>
  );
}
