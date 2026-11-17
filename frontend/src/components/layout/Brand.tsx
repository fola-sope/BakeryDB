import { Icon } from "../ui/Icon";

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon path="M3 17c-2-5 2-6 3-5 0-7 5-7 6-4 3-4 7-1 6 4 4-1 5 3 3 5zM7 11l2 6M12 8l2 9M18 12l-1 5" />
      </span>
      <div>
        <p className="brand-name">Crumb & Co.</p>
        <p className="brand-caption">Bakery Management</p>
      </div>
    </div>
  );
}
