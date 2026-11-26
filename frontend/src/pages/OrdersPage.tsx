import { useState } from "react";
import { OrdersTable } from "../components/orders/OrdersTable";
import type { OrdersState } from "../hooks/useOrders";

export function Orders({ state }: { state: OrdersState }) {
    const { orders, loading, error, refresh, refreshKey } = state;
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const statuses = [...new Set(orders.map((order) => order.status))].sort();
    const filtered = orders.filter(
        (order) =>
            (String(order.id) + " " + order.customer + " " + order.employee)
                .toLowerCase()
                .includes(search.trim().toLowerCase()) &&
            (!status || order.status === status) &&
            (!date || order.date === date),
    );
    return (
        <div className='page-stack'>
            <div className='section-title'>
                {/*               
                <button className='button secondary' disabled={loading} onClick={refresh}>
                    Refresh orders
                </button> */}
            </div>
            <div className='filter-bar'>
                <label>
                    Search orders
                    <input
                        type='search'
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Order number, customer or employee name'
                    />
                </label>
                <label>
                    Status
                    <select value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value=''>All statuses</option>
                        {statuses.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Order date
                    <input type='date' value={date} onChange={(event) => setDate(event.target.value)} />
                </label>
                <button
                    className='button secondary'
                    onClick={() => {
                        setSearch("");
                        setStatus("");
                        setDate("");
                    }}
                >
                    Reset filters
                </button>
            </div>
            {loading ? (
                <p role='status'>Loading orders…</p>
            ) : error ? (
                <div role='alert'>
                    <p>{error}</p>
                    <button className='button secondary' onClick={refresh}>
                        Try again
                    </button>
                </div>
            ) : (
                <OrdersTable key={[search, status, date, refreshKey].join("|")} orders={filtered} />
            )}
        </div>
    );
}
