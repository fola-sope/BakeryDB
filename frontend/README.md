# Crumb & Co. Bakery Management

React, TypeScript, Vite, and Tailwind CSS staff-facing interface.

## Run locally

From this folder:

```powershell
npm install
npm run dev
```

Create a production build with `npm run build`; serve it locally with `npm run preview`.

## Current pages

- Dashboard: sample order totals, seven-day sales chart, stock attention, recent orders.
- Products & Inventory: search, category/status filters, pagination, and session-only add/edit dialogs.
- Orders: search, status/date filters, and pagination.
- Customers & Payments: searchable sample customer summaries and a payments integration notice.
- Reports & Audit Logs: date-filtered sample sales reports and an audit integration notice.

Navigation uses React Router with BrowserRouter, nested routes, and direct paths: `/dashboard`, `/inventory`, `/orders`, `/payments`, and `/reports`. The root and unknown paths redirect to `/inventory`. Browser Back/Forward is supported.
Desktop uses a sidebar; tablets use an icon rail; mobile uses a drawer and bottom navigation.

## Sample data and limitations

All records come from `src/sampleData.ts`. Product edits are held in React state and reset on reload.
CAD currency and a low-stock threshold of fewer than 8 units are demonstration defaults.
Sales and customer spending count completed sample orders; order count includes all statuses.
The displayed manager identity is a visual preview, not an authenticated account.

Oracle integration, persistent writes, order processing, payment records, product sales rankings,
and audit retrieval require confirmed protected backend contracts. No credentials or tokens belong
in the browser. See the root DESIGN.md and AGENTS.md for visual guidance.

## Component structure

- `src/App.tsx`: composes the selected page and owns session product state.
- `src/pages/`: one component per screen, with its filters and page state.
- `src/components/layout/`: app shell, header, sidebar, mobile navigation, and shared navigation configuration.
- `src/components/ui/`: shared table, metrics, badges, modal, icons, and view controls.
- `src/components/dashboard/`, `inventory/`, and `orders/`: feature-specific components.
- `src/hooks/usePage.ts`: router-derived page metadata and document title updates.
- `src/sampleData.ts`: demonstration records and formatting helpers.

Keep layout behavior in the shell, form behavior in the dialog, and feature state in its page.

Production hosting must serve index.html for application paths (SPA fallback) so direct links and refreshes work. Vite handles this during local development.
