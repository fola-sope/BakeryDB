import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Navigate, Route, Routes } from "react-router";
import { CustomersPayments } from "./pages/CustomersPaymentsPage";
import { Dashboard } from "./pages/DashboardPage";
import { Inventory } from "./pages/InventoryPage";
import { Orders } from "./pages/OrdersPage";
import { Reports } from "./pages/ReportsPage";
import { demoProducts } from "./sampleData";
import type { Product } from "./sampleData";

export default function App() {
  const [products, setProducts] = useState(demoProducts);

  function saveSampleProduct(product: Product) {
    setProducts((current) =>
      current.some((item) => item.id === product.id)
        ? current.map((item) => (item.id === product.id ? product : item))
        : [...current, product],
    );
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/inventory" replace />} />
        <Route path="dashboard" element={<Dashboard products={products} />} />
        <Route
          path="inventory"
          element={<Inventory products={products} onSave={saveSampleProduct} />}
        />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<CustomersPayments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/inventory" replace />} />
      </Route>
    </Routes>
  );
}
