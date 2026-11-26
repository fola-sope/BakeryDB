export const money = (value: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
export const stockStatus = (stock: number) =>
    stock === 0 ? "Out of Stock" : stock < 8 ? "Low Stock" : "In Stock";
export const today = () => new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
