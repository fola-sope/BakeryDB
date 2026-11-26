import type { Ref } from "react";
import { Icon } from "../ui/Icon";
import { Brand } from "./Brand";

type AppHeaderProps = {
    menuRef: Ref<HTMLButtonElement>;
    onOpenMenu: () => void;
};

export function AppHeader({ menuRef, onOpenMenu }: AppHeaderProps) {

    return (
        <header className='app-header'>
            <button
                ref={menuRef}
                className='icon-button mobile-menu'
                aria-label='Open navigation'
                aria-haspopup='dialog'
                aria-controls='mobile-navigation'
                onClick={onOpenMenu}
            >
                <Icon path='M3 6h18M3 12h18M3 18h18' />
            </button>
            <div className='mobile-brand'>
                <Brand />
            </div>
            <div className='desktop-header-title'>
                <p>Daily Operations for Crumb & Co.</p>
                <span>Manage your bakery operations efficiently</span>
            </div>
            <div className='header-account'>
                <span
                    className='notification-preview'
                    title='Notifications are not connected'
                    role='img'
                    aria-label='Notifications preview, not connected'
                >
                    <Icon path='M5 17h14l-2-3V9a5 5 0 00-10 0v5zM10 21h4M12 2v2' />
                </span>
                <div className='account-avatar' aria-hidden='true'>
                    <Icon path='M9 5h6v6H9zM5 21v-3a7 5 0 0114 0v3z' />
                </div>
                <div className='account-details'>
                    <strong>A A.</strong>
                    <span>Manager · Preview</span>
                </div>
            </div>
        </header>
    );
}
