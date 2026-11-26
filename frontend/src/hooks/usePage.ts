import { useEffect } from "react";
import { matchPath, useLocation } from "react-router";
import { dashboardPage, pages } from "../components/layout/navigation";

// Read page metadata from the router; routing state stays with React Router.
export function usePage() {
  const { pathname } = useLocation();
  const page =
    [dashboardPage, ...pages].find((page) => matchPath(`/${page.id}`, pathname)) ?? pages[0];

  useEffect(() => {
    document.title = `${page.label} | Crumb & Co.`;
  }, [page.label]);

  return page;
}
