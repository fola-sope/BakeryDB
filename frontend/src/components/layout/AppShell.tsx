import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { usePage } from "../../hooks/usePage";
import { AppHeader } from "./AppHeader";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";

export function AppShell() {
    const page = usePage();
    const drawer = useRef<HTMLDialogElement>(null);
    const menuButton = useRef<HTMLButtonElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const previousPage = useRef(page.id);

    useEffect(() => {
        if (previousPage.current === page.id) return;
        previousPage.current = page.id;
        const frame = requestAnimationFrame(() => heading.current?.focus());
        return () => cancelAnimationFrame(frame);
    }, [page.id]);

    return (
        <div className='app-shell'>
            <a
                className='skip-link'
                href='#main-content'
                onClick={(event) => {
                    event.preventDefault();
                    heading.current?.focus();
                }}
            >
                Skip to content
            </a>
            <Sidebar />
            <div className='workspace'>
                <AppHeader menuRef={menuButton} onOpenMenu={() => drawer.current?.showModal()} />
                <main id='main-content' className='page-content'>
                    <p className='page-eyebrow'>Crumb & Co. / {page.short}</p>
                    <h1 ref={heading} tabIndex={-1}>
                        {page.label}
                    </h1>
                    <p className='page-description'>{page.description}</p>
                    <Outlet />
                </main>
            </div>
            <MobileNavigation active={page.id} dialogRef={drawer} menuRef={menuButton} />
        </div>
    );
}
