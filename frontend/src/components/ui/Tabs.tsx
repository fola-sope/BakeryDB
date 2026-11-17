export function Tabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="page-tabs" role="group" aria-label="Choose view">
      {items.map((item) => (
        <button
          key={item}
          className={item === active ? "selected" : ""}
          aria-pressed={item === active}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
