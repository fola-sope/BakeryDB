export function Badge({ children }: { children: string }) {
  const tone = ["Completed", "In Stock", "Paid"].includes(children)
    ? "success"
    : ["Cancelled", "Out of Stock"].includes(children)
      ? "danger"
      : "warning";
  return <span className={`status-badge badge-${tone}`}>{children}</span>;
}
