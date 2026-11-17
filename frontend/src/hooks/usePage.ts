import { useEffect } from "react";
import { matchPath, useLocation } from "react-router";
import { pages } from "../components/layout/navigation";

// Read page metadata from the router; routing state stays with React Router.
export function usePage() {
  const { pathname } = useLocation();
  const page =
    pages.find((page) => matchPath(`/${page.id}`, pathname)) ?? pages[1];

  useEffect(() => {
    document.title = `${page.label} | Crumb & Co.`;
  }, [page.label]);

  return page;
}
