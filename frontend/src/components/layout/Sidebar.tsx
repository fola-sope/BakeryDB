import { Brand } from "./Brand";
import { NavigationLinks } from "./NavigationLinks";

export function Sidebar() {
    return (
        <aside className='desktop-sidebar'>
            <Brand />
            <p className='nav-caption'></p>
            <nav aria-label='Main navigation'>
                <NavigationLinks />
            </nav>
            <div className='sidebar-note'>
                <strong>Artisan Batch Atelier</strong>
                <p>
                    Crafted with care.
                    <br />
                    Managed with precision.
                </p>
            </div>
        </aside>
    );
}
