import { Icon } from "../ui/Icon";
import { pages } from "./navigation";
import { NavLink } from "react-router";

type NavigationLinksProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function NavigationLinks({
  compact = false,
  onNavigate,
}: NavigationLinksProps) {
  return pages.map((page) => (
    <NavLink
      key={page.id}
      to={`/${page.id}`}
      end
      className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}

      title={page.label}
      onClick={onNavigate}
    >
      <Icon path={page.icon} />
      <span>{compact ? page.short : page.label}</span>
    </NavLink>
  ));
}
