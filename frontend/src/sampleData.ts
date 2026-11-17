// Demonstration records only. No Oracle operations are performed.
export const demoProducts = [
  { id: 1, name: "Chocolate Cake", category: "Cakes", price: 25, stock: 12 },
  { id: 2, name: "Red Velvet Cake", category: "Cakes", price: 28, stock: 5 },
  {
    id: 3,
    name: "Artisanal Croissant",
    category: "Pastries",
    price: 4,
    stock: 36,
  },
  {
    id: 4,
    name: "Blueberry Streusel Muffin",
    category: "Muffins",
    price: 3.5,
    stock: 0,
  },
  {
    id: 5,
    name: "Sourdough Bread Loaf",
    category: "Breads",
    price: 5,
    stock: 18,
  },
  { id: 6, name: "Cinnamon Roll", category: "Pastries", price: 4.5, stock: 24 },
  { id: 7, name: "Lemon Tea Cake", category: "Cakes", price: 18, stock: 8 },
];
export type Product = (typeof demoProducts)[number];
export const demoOrders = [
  {
    id: 1082,
    customer: "Eleanor Vance",
    employee: "Folasope A.",
    date: "2026-11-16",
    total: 38.5,
    status: "Completed",
  },
  {
    id: 1081,
    customer: "The Daily Grind Cafe",
    employee: "Folasope A.",
    date: "2026-11-16",
    total: 142,
    status: "Processing",
  },
  {
    id: 1080,
    customer: "Marcus Sterling",
    employee: "Folasope A.",
    date: "2026-11-15",
    total: 18,
    status: "Completed",
  },
  {
    id: 1079,
    customer: "S. Jenkins (Catering)",
    employee: "Folasope A.",
    date: "2026-11-14",
    total: 85,
    status: "Cancelled",
  },
  {
    id: 1078,
    customer: "Eleanor Vance",
    employee: "Folasope A.",
    date: "2026-11-13",
    total: 25,
    status: "Completed",
  },
  {
    id: 1077,
    customer: "Marcus Sterling",
    employee: "Folasope A.",
    date: "2026-11-12",
    total: 32,
    status: "Completed",
  },
];
export const demoCustomers = [
  { id: 1, name: "Eleanor Vance", phone: "416-555-0101" },
  { id: 2, name: "The Daily Grind Cafe", phone: "416-555-0102" },
  { id: 3, name: "Marcus Sterling", phone: "416-555-0103" },
  { id: 4, name: "S. Jenkins (Catering)", phone: "416-555-0104" },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    value,
  );
export const stockStatus = (stock: number) =>
  stock === 0 ? "Out of Stock" : stock < 8 ? "Low Stock" : "In Stock";
