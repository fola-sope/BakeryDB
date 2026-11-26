import type { OrdersState } from "../../hooks/useOrders";
export function OrdersFeedback({ state }: { state: OrdersState }) {
    if (state.loading) return <p role="status">Loading orders…</p>;
    if (state.error) return <div role="alert"><p>{state.error}</p><button className="button secondary" onClick={state.refresh}>Try again</button></div>;
    return null;
}
