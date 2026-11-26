import { useState } from "react";
import { ProductDialog } from "../components/inventory/ProductDialog";
import { Badge } from "../components/ui/Badge";
import { DataTable } from "../components/ui/DataTable";
import { Metrics } from "../components/ui/Metrics";
import { money, stockStatus } from "../format";
import type { Product } from "../types";

export function Inventory({ products, onSave }: { products: Product[]; onSave: (product: Product) => void }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [editing, setEditing] = useState<Product | null>(null);
    const [notice, setNotice] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const categories = [...new Set(products.map((product) => product.category))];
    const filtered = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            (!category || product.category === category) &&
            (!status || stockStatus(product.stock) === status),
    );
    function open(product: Product | null) {
        setEditing(product);
        setDialogOpen(true);
    }

    function save(values: Omit<Product, "id">) {
        onSave({
            ...values,
            id: editing?.id ?? Math.max(0, ...products.map((product) => product.id)) + 1,
        });
        setNotice("Product preview updated for this session only. Nothing was saved to the database.");
        setDialogOpen(false);
    }

    return (
        <div className='page-stack'>
            <div className='section-title'>
                <p className='small-note'>Stock threshold: fewer than 8 units</p>
                <button className='button primary' onClick={() => open(null)}>
                    + Add new product
                </button>
            </div>
            <Metrics
                items={[
                    [
                        "Inventory value",
                        money(products.reduce((sum, product) => sum + product.price * product.stock, 0)),
                        "At listed retail prices",
                    ],
                    [
                        "Total units",
                        String(products.reduce((sum, product) => sum + product.stock, 0)),
                        "Across the loaded catalog",
                    ],
                    [
                        "Low stock",
                        String(products.filter((product) => product.stock > 0 && product.stock < 8).length),
                        "Replenishment needed",
                    ],
                    [
                        "Out of stock",
                        String(products.filter((product) => product.stock === 0).length),
                        "No units available",
                    ],
                ]}
            />
            <div className='filter-bar'>
                <label>
                    Search products
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search by product name'
                        type='search'
                    />
                </label>
                <label>
                    Category
                    <select value={category} onChange={(event) => setCategory(event.target.value)}>
                        <option value=''>All categories</option>
                        {categories.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Stock status
                    <select value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value=''>All stock statuses</option>
                        {["In Stock", "Low Stock", "Out of Stock"].map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>
                <button
                    className='button secondary'
                    onClick={() => {
                        setSearch("");
                        setCategory("");
                        setStatus("");
                    }}
                >
                    Reset filters
                </button>
            </div>
            {notice && (
                <p className='inline-notice' role='status'>
                    {notice}
                </p>
            )}
            <DataTable
                key={`${search}-${category}-${status}`}
                headers={["Product ID", "Product name", "Category", "Price (CAD)", "Stock qty", "Status", "Actions"]}
                rows={filtered.map((product) => [
                    `PRD-${String(product.id).padStart(3, "0")}`,
                    <strong>{product.name}</strong>,
                    product.category,
                    <span className='numeric'>{money(product.price)}</span>,
                    <span className='numeric'>{product.stock} units</span>,
                    <Badge>{stockStatus(product.stock)}</Badge>,
                    <button
                        className='text-button'
                        onClick={() => open(product)}
                        aria-label={`Preview changes to ${product.name}`}
                    >
                        Edit
                    </button>,
                ])}
            />
            {dialogOpen && (
                <ProductDialog
                    product={editing}
                    categories={categories}
                    onSave={save}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </div>
    );
}
