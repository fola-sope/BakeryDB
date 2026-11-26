import { Link } from "react-router";
import { StockAttention } from "../components/dashboard/StockAttention";
import { OrdersFeedback } from "../components/orders/OrdersFeedback";
import { OrdersTable } from "../components/orders/OrdersTable";
import { Metrics } from "../components/ui/Metrics";
import { money } from "../format";
import type { OrdersState } from "../hooks/useOrders";
import type { Product } from "../types";

export function Dashboard({ products, orderState }: { products: Product[]; orderState: OrdersState }) {
    const lowStock = products.filter((product) => product.stock < 8);
    const ready = !orderState.loading && !orderState.error;
    const completedOrders = orderState.orders.filter((order) => order.status === "Completed");

    const salesAvailable = ready && completedOrders.every((order) => order.total !== null);

    const totalSales = completedOrders.reduce((sum, order) => sum + (order.total ?? 0), 0);
    return (
        <div className='page-stack'>
            <div className='section-title'>
                <h2>Your bakery at a glance</h2>
                <Link className='button primary' to='/orders'>
                    View orders →
                </Link>
            </div>
            <Metrics
                items={[
                    ["Total sales", salesAvailable ? money(totalSales) : "Unavailable", "Completed orders"],
                    ["Orders", ready ? String(orderState.orders.length) : "—", "All order statuses"],
                    ["Catalog", String(products.length), "Loaded inventory"],
                    ["Needs attention", String(lowStock.length), "Below 8 units"],
                ]}
            />
            <div className='dashboard-grid'>
                <section className='content-card'>
                    <h2>Sales overview</h2>
                    <p className='small-note'>
                        Sales totals and charts will be available when order-line totals are connected.
                    </p>
                </section>
                <StockAttention products={lowStock} />
            </div>
            <div className='section-title'>
                <h2>Recent orders</h2>
                <button className='button secondary' disabled={orderState.loading} onClick={orderState.refresh}>
                    Refresh orders
                </button>
                <Link to='/orders'>View all →</Link>
            </div>
            <p className='small-note'>Latest five orders by order date, then order ID. All statuses included.</p>
            <OrdersFeedback state={orderState} />
            {ready && <OrdersTable key={orderState.refreshKey} orders={orderState.orders.slice(0, 5)} />}
        </div>
    );
}
