export const pages = [
  {
    id: "dashboard",
    label: "Dashboard",
    short: "Dashboard",
    description: "Overview of bakery operations.",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    id: "inventory",
    label: "Products & Inventory",
    short: "Inventory",
    description: "Manage bakery products, pricing, and stock levels.",
    icon: "M4 7h16v14H4zM3 3h18v4H3zM9 11h6",
  },
  {
    id: "orders",
    label: "Orders",
    short: "Orders",
    description: "Manage bakery orders and their progress.",
    icon: "M5 3l2 1 2-1 3 1 3-1 2 1 2-1v18l-2-1-2 1-3-1-3 1-2-1-2 1zM9 8h6M9 12h6M9 16h4",
  },
  {
    id: "payments",
    label: "Customers & Payments",
    short: "Payments",
    description: "Manage customer records and payments.",
    icon: "M3 6h18v12H3zM7 18v3h14M9 9h6v6H9z",
  },
  {
    id: "reports",
    label: "Reports & Audit Logs",
    short: "Reports",
    description: "Review bakery performance and activity.",
    icon: "M4 3h16v18H4zM8 16v-4M12 16V7M16 16v-6",
  },
] as const;

export type Page = (typeof pages)[number];
