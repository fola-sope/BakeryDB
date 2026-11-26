import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { loadInventory } from "./api";
import { AppShell } from "./components/layout/AppShell";
import { useOrders } from "./hooks/useOrders";
import { Customers } from "./pages/CustomersPage";
import { Inventory } from "./pages/InventoryPage";
import { Orders } from "./pages/OrdersPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import type { Product } from "./types";

export default function App() {
    const orderState = useOrders();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [hasLocalChanges, setHasLocalChanges] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError("");

            try {
                const inventory = await loadInventory(controller.signal);

                if (controller.signal.aborted) return;

                setProducts(inventory.products);
                setHasLocalChanges(false);
            } catch (error) {
                if (controller.signal.aborted) return;

                setError(error instanceof Error ? error.message : "Unable to load inventory.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => controller.abort();
    }, [reloadKey]);

    function saveLocalProduct(product: Product) {
        setProducts((current) =>
            current.some((item) => item.id === product.id)
                ? current.map((item) => (item.id === product.id ? product : item))
                : [...current, product],
        );

        setHasLocalChanges(true);
    }

    const inventoryContent = loading ? (
        <p role='status'>Loading products and categories…</p>
    ) : error ? (
        <div role='alert'>
            <p>{error}</p>
            <button className='button secondary' onClick={() => setReloadKey((current) => current + 1)}>
                Try again
            </button>
        </div>
    ) : (
        <>
            {hasLocalChanges && (
                <p className='inline-notice' role='status'>
                    Inventory includes local preview changes that have not been saved to the database.
                </p>
            )}
            <Inventory products={products} onSave={saveLocalProduct} />
        </>
    );

    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route index element={<Navigate to='/inventory' replace />} />
                {/* 
                <Route
                    path='dashboard'
                    element={
                        loading ? (
                            <p role='status'>Loading inventory…</p>
                        ) : error ? (
                            <p role='alert'>{error}</p>
                        ) : (
                            <Dashboard products={products} orderState={orderState} />
                        )
                    }
                /> */}

                <Route path='inventory' element={inventoryContent} />
                <Route path='orders' element={<Orders state={orderState} />} />
                <Route path='customers' element={<Customers />} />
                <Route path='payments' element={<Navigate to='/customers' replace />} />
                <Route path='audit-logs' element={<AuditLogsPage />} />
                <Route path='reports' element={<Navigate to='/audit-logs' replace />} />

                <Route path='*' element={<Navigate to='/inventory' replace />} />
            </Route>
        </Routes>
    );
}
