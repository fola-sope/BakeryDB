import type {
    AuditLog,
    Customer,
    CustomerResponse,
    Category,
    InventoryData,
    AuditLogResponse,
    OrderResponse,
    ProductResponse,
    Order,
    Product,
} from "./types";

// Public reads go directly to the data service in production.
// Local development continues to use the existing backend proxy.
const apiBaseUrl = import.meta.env.PROD
    ? "https://oracleapex.com/ords/bakerydatabase/api"
    : "/api";

async function getItems<T>(
    resource: "products" | "categories" | "audit-logs" | "orders" | "employees" | "customers",
    signal?: AbortSignal,
): Promise<T[]> {
    const items: T[] = [];
    let offset = 0;
    for (let page = 0; page < 100; page++) {
        const url = apiBaseUrl + "/" + resource + "/?offset=" + offset + "&limit=100";
        const response = await fetch(url, {
            signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
            headers: { Accept: "application/json" },
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error("Unable to load " + resource + " (HTTP " + response.status + "). Please try again.");
        }
        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error("Unexpected " + resource + " response.");
        items.push(...data.items);
        if (!data.hasMore) return items;
        if (data.items.length === 0) throw new Error("Unable to load the next page of " + resource + ".");
        offset += data.items.length;
    }
    throw new Error("Too many " + resource + " records to load.");
}

export async function loadAuditLogs(signal?: AbortSignal): Promise<AuditLog[]> {
    const rows = await getItems<AuditLogResponse>("audit-logs", signal);
    const actions = { INSERT: "Created", UPDATE: "Updated", DELETE: "Deleted" } as const;

    return rows.map((row) => {
        if (typeof row.changed_at !== "string" || !Number.isFinite(Date.parse(row.changed_at))) {
            throw new Error("Audit log " + row.log_id + " has a missing or invalid changed_at date.");
        }
        const action = actions[row.action_type];
        if (!action) throw new Error("Unexpected audit action: " + row.action_type);
        const oldValue = row.old_value ?? null;
        const newValue = row.new_value ?? null;
        const display = (value: string | null) => value?.replace(/^order_status=/, "") ?? "—";

        return {
            id: String(row.log_id),
            tableName: row.table_name,
            recordId: String(row.record_id),
            recordLabel: (row.table_name === "ORDERS" ? "Order" : row.table_name) + " #" + row.record_id,
            employee: row.employee_name?.trim() || null,
            timestamp: row.changed_at,
            action,
            change:
                oldValue === null
                    ? "Created: " + display(newValue)
                    : newValue === null
                      ? "Deleted: " + display(oldValue)
                      : display(oldValue) + " → " + display(newValue),
            oldValues: oldValue === null ? null : { value: oldValue },
            newValues: newValue === null ? null : { value: newValue },
        };
    });
}

export async function loadInventory(signal?: AbortSignal): Promise<InventoryData> {
    const [rows, categories] = await Promise.all([
        getItems<ProductResponse>("products", signal),
        getItems<Category>("categories", signal),
    ]);

    const categoryNames = new Map(categories.map((category) => [Number(category.category_id), category.category_name]));

    const products: Product[] = rows.map((row) => ({
        id: Number(row.product_id),
        name: row.product_name,
        category: categoryNames.get(Number(row.category_id)) || `Category ${row.category_id}`,
        price: Number(row.price),
        stock: Number(row.stock_quantity),
    }));

    return { products, categories };
}

export async function loadOrders(signal?: AbortSignal): Promise<Order[]> {
    const rows = await getItems<OrderResponse>("orders", signal);
    return rows
        .map((row) => {
            const id = Number(row.order_id);
            if (!Number.isSafeInteger(id) || id <= 0) throw new Error("An order has an invalid ID.");
            // Preserve the recorded calendar date instead of shifting it through the browser timezone.
            const date = row.order_date == null ? "" : row.order_date.slice(0, 10);
            if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)))) {
                throw new Error("Order #" + id + " has an invalid order date.");
            }
            const total =
                row.total_amount == null || String(row.total_amount).trim() === "" ? null : Number(row.total_amount);
            if (total !== null && !Number.isFinite(total)) {
                throw new Error("Order #" + id + " has an invalid total amount.");
            }
            return {
                id,
                customer:
                    row.customer_name?.trim() ||
                    (row.customer_id == null ? "Not recorded" : "Customer #" + row.customer_id),
                employee:
                    row.employee_name?.trim() ||
                    (row.employee_id == null ? "Not assigned" : "Employee #" + row.employee_id),
                date,
                status: row.order_status?.trim() || "Not recorded",
                total,
            };
        })
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

export async function loadEmployees(signal?: AbortSignal): Promise<string[]> {
    const rows = await getItems<{ employee_name: string }>("employees", signal);
    return rows.map((row) => row.employee_name.trim()).filter((name) => name !== "");
}

export async function loadCustomers(signal?: AbortSignal): Promise<Customer[]> {
    const rows = await getItems<CustomerResponse>("customers", signal);
    return rows.map((row) => {
        const id = Number(row.customer_id);
        const orderCount = Number(row.order_count);
        const completedOrderValue = row.completed_order_value == null ? null : Number(row.completed_order_value);
        if (!Number.isSafeInteger(id) || id <= 0 || row.order_count == null ||
            !Number.isSafeInteger(orderCount) || orderCount < 0 ||
            (completedOrderValue !== null && !Number.isFinite(completedOrderValue))) {
            throw new Error("Customer summary data is invalid.");
        }
        return { id, name: row.customer_name?.trim() || "Customer #" + id, orderCount, completedOrderValue };
    }).sort((a, b) => a.id - b.id);
}
