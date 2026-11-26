import { useEffect, useState } from "react";
import { loadCustomers } from "../api";
import { DataTable } from "../components/ui/DataTable";
import { money } from "../format";
import type { Customer } from "../types";

export function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError("");
            try {
                const result = await loadCustomers(controller.signal);
                if (!controller.signal.aborted) setCustomers(result);
            } catch (error) {
                if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load customers.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        void load();
        return () => controller.abort();
    }, [refreshKey]);
    const filtered = customers.filter((customer) =>
        (String(customer.id) + " " + customer.name).toLowerCase().includes(search.trim().toLowerCase()));
    return <div className='page-stack'>
        <p className='small-note'>Customer records. Order count includes all statuses; completed order value is not a payment balance.</p>
        <div className='filter-bar'>
            <label>Search customers<input type='search' value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Customer ID or name' /></label>
            <button className='button secondary' onClick={() => setSearch("")}>Reset filters</button>
            <button className='button primary' disabled={loading} onClick={() => setRefreshKey((value) => value + 1)}>Refresh customers</button>
        </div>
        {loading ? <p role='status'>Loading customers…</p> : error ? <div role='alert'>
            <p>{error}</p><button className='button secondary' onClick={() => setRefreshKey((value) => value + 1)}>Try again</button>
        </div> : <DataTable key={[search, refreshKey].join("|")}
            headers={["Customer ID", "Customer name", "Total orders", "Completed order value (CAD)"]}
            rows={filtered.map((customer) => [
                "#" + customer.id, <strong>{customer.name}</strong>, customer.orderCount,
                <span className='numeric'>{customer.completedOrderValue === null ? "Unavailable" : money(customer.completedOrderValue)}</span>,
            ])} />}
    </div>;
}
