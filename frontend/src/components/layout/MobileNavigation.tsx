import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Brand } from "./Brand";
import { NavigationLinks } from "./NavigationLinks";
import { Icon } from "../ui/Icon";
import type { Page } from "./navigation";

type MobileNavigationProps = {
  active: Page["id"];
  dialogRef: RefObject<HTMLDialogElement | null>;
  menuRef: RefObject<HTMLButtonElement | null>;
};

export function MobileNavigation({
  active,
  dialogRef,
  menuRef,
}: MobileNavigationProps) {
  const previousPage = useRef(active);

  useEffect(() => {
    // Native dialog restores focus to the menu button on dismissal.
    // Page navigation subsequently moves focus to the page heading.
    if (previousPage.current !== active) dialogRef.current?.close();
    previousPage.current = active;
  }, [active, dialogRef]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnResize = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnResize);
    return () => desktop.removeEventListener("change", closeOnResize);
  }, [dialogRef]);

  return (
    <>
      <nav className="bottom-navigation" aria-label="Mobile main navigation">
        <NavigationLinks compact />
      </nav>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-drawer"
        aria-labelledby="drawer-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => menuRef.current?.focus()}
      >
        <div className="drawer-panel">
          <div className="drawer-header">
            <Brand />
            <button
              className="icon-button"
              aria-label="Close navigation"
              onClick={() => dialogRef.current?.close()}
            >
              <Icon path="M6 6l12 12M18 6L6 18" />
            </button>
          </div>
          <h2 id="drawer-title" className="nav-caption">
            Navigation
          </h2>
          <nav aria-label="Expanded mobile navigation">
            <NavigationLinks onNavigate={() => dialogRef.current?.close()} />
          </nav>
          <p className="drawer-footer">Crumb & Co. · Bakery Management</p>
        </div>
      </dialog>
    </>
  );
}
