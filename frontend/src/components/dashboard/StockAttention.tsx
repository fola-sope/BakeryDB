import { Link } from "react-router";
import { stockStatus } from "../../format";
import type { Product } from "../../types";
import { Badge } from "../ui/Badge";

export function StockAttention({ products }: { products: Product[] }) {
  return (
    <section className="content-card">
      <div className="section-title">
        <h2>Stock attention</h2>
        <Link to="/inventory">View inventory →</Link>
      </div>
      <ul className="attention-list">
        {products.map((product) => (
          <li key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <p>{product.stock} units remaining</p>
            </div>
            <Badge>{stockStatus(product.stock)}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
