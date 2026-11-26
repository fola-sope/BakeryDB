import type { FormEvent } from "react";
import type { Product } from "../../types";
import { Modal } from "../ui/Modal";

type ProductDialogProps = {
  product: Product | null;
  categories: string[];
  onSave: (values: Omit<Product, "id">) => void;
  onClose: () => void;
};

export function ProductDialog({
  product,
  categories,
  onSave,
  onClose,
}: ProductDialogProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    if (!name) return;
    onSave({
      name,
      category: String(form.get("category")),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
    });
  }

  return (
    <Modal
      title={product ? "Preview product changes" : "Preview new product"}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <p className="small-note">
          Preview only. Changes reset when you reload.
        </p>
        <label>
          Product name
          <input
            name="name"
            required
            maxLength={100}
            pattern=".*\S.*"
            defaultValue={product?.name}
          />
        </label>
        <label>
          Category
          <select
            name="category"
            defaultValue={product?.category ?? categories[0]}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <div className="form-columns">
          <label>
            Price (CAD)
            <input
              name="price"
              type="number"
              required
              min="0.01"
              max="999999.99"
              step="0.01"
              defaultValue={product?.price}
            />
          </label>
          <label>
            Stock quantity
            <input
              name="stock"
              type="number"
              required
              min="0"
              max="999999"
              step="1"
              defaultValue={product?.stock ?? 0}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" type="submit">
            Apply preview
          </button>
        </div>
      </form>
    </Modal>
  );
}
