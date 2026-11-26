import { useCallback, useEffect, useState } from "react";
import { loadOrders } from "../api";
import type { Order } from "../types";
export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = useCallback(() => setRefreshKey((value) => value + 1), []);
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError("");
            try {
                const result = await loadOrders(controller.signal);
                if (!controller.signal.aborted) setOrders(result);
            } catch (error) {
                if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load orders.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        void load();
        return () => controller.abort();
    }, [refreshKey]);
    return { orders, loading, error, refresh, refreshKey };
}
export type OrdersState = ReturnType<typeof useOrders>;
