/** Product shape used by the application, independent of sample records. */
export type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
};

/** Category fields returned by ORDS. */
export type Category = {
    category_id: number;
    category_name: string;
};

/** Product fields returned by ORDS before the API adapter normalizes them. */
export type ProductResponse = {
    product_id: number;
    product_name: string;
    category_id: number;
    price: number;
    stock_quantity: number;
};

export type InventoryData = {
    products: Product[];
    categories: Category[];
};

export type Order = {
    id: number;
    customer: string;
    employee: string;
    date: string;
    total: number | null;
    status: string;
};

export type Customer = {
    id: number;
    name: string;
    orderCount: number;
    completedOrderValue: number | null;
};
export type CustomerResponse = {
    customer_id: number;
    customer_name: string | null;
    order_count: number | string;
    completed_order_value: number | string | null;
};

export type AuditAction = "Created" | "Updated" | "Deleted";

/** Raw audit fields recorded. */
export type AuditLogResponse = {
    log_id: number;
    table_name: string;
    record_id: number;
    employee_id?: number | null;
    employee_name?: string | null;
    changed_at: string;
    action_type: "INSERT" | "UPDATE" | "DELETE";
    old_value?: string | null;
    new_value?: string | null;
};

/** Audit event normalized for the table, filters, and details dialog. */
export type AuditLog = {
    readonly id: string;
    readonly tableName: string;
    readonly recordId: string;
    readonly recordLabel: string;
    readonly employee: string | null;
    readonly timestamp: string;
    readonly action: AuditAction;
    readonly change: string;
    readonly oldValues: Readonly<Record<string, unknown>> | null;
    readonly newValues: Readonly<Record<string, unknown>> | null;
};

/** Order fields returned by the API. */
export type OrderResponse = {
    order_id: number;
    customer_id: number | null;
    customer_name?: string | null;
    employee_id: number | null;
    employee_name?: string | null;
    order_date: string | null;
    order_status: string | null;
    total_amount?: number | string | null;
};

export type Employee = {
    id: number;
    name: string;
    job_title: string;
};
