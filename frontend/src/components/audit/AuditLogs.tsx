import { useEffect, useState } from "react";
import { loadAuditLogs } from "../../api";
import type { AuditAction, AuditLog } from "../../types";
import { AuditLogDetails } from "./AuditLogDetails";


const actions: AuditAction[] = ["Created", "Updated", "Deleted"];
const tones = { Created: "success", Updated: "warning", Deleted: "danger" };
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

function localDay(timestamp: string) {
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) return "";
    const parts = dayFormatter.formatToParts(date);
    const part = (name: string) => parts.find((item) => item.type === name)?.value;
    return `${part("year")}-${part("month")}-${part("day")}`;
}

function ActionBadge({ action }: { action: AuditAction }) {
    return <span className={`status-badge badge-${tones[action]}`}>{action}</span>;
}

export function AuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<AuditLog | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const invalidRange = Boolean(from && to && from > to);
    const filtered = invalidRange
        ? []
        : logs.filter((log) => {
              const day = localDay(log.timestamp);
              const text = `${log.recordLabel} ${log.employee ?? "Not recorded"}`.toLowerCase();
              return (
                  text.includes(search.trim().toLowerCase()) &&
                  (!action || log.action === action) &&
                  (!from || day >= from) &&
                  (!to || day <= to)
              );
          });
    const last = Math.max(1, Math.ceil(filtered.length / 5));
    const current = Math.min(page, last);
    const visible = filtered.slice((current - 1) * 5, current * 5);
    function reset() {
        setSearch("");
        setAction("");
        setFrom("");
        setTo("");
        setPage(1);
    }
    function details(log: AuditLog) {
        return (
            <button
                className='text-button'
                aria-label={`View details for ${log.recordId}, log ${log.id}`}
                onClick={() => setSelected(log)}
            >
                View details
            </button>
        );
    }

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError("");

            try {
                const records = await loadAuditLogs(controller.signal);

                if (!controller.signal.aborted) {
                    setLogs(records);
                    setPage(1);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(error instanceof Error ? error.message : "Unable to load audit logs.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => controller.abort();
    }, [refreshKey]);

    return (
        <section className='audit-logs page-stack' aria-label='Audit history'>
            <p className='inline-notice'>
                <strong>Database audit history.</strong> Recorded order events are read-only. Times and date filters use America/Toronto.
            </p>
            <div className='filter-bar audit-filters'>
                <label>
                    Search
                    <input
                        type='search'
                        placeholder='Order number or employee name'
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                </label>
                <label>
                    Action
                    <select
                        value={action}
                        onChange={(event) => {
                            setAction(event.target.value);
                            setPage(1);
                        }}
                    >
                        <option value=''>All actions</option>
                        {actions.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </label>
                <label>
                    From
                    <input
                        type='date'
                        value={from}
                        max={to || undefined}
                        onChange={(event) => {
                            setFrom(event.target.value);
                            setPage(1);
                        }}
                    />
                </label>
                <label>
                    To
                    <input
                        type='date'
                        value={to}
                        min={from || undefined}
                        onChange={(event) => {
                            setTo(event.target.value);
                            setPage(1);
                        }}
                    />
                </label>
                <button className='button secondary' onClick={reset}>
                    Reset filters
                </button>
                <button
                    className='button primary'
                    disabled={loading}
                    onClick={() => {
                        setRefreshKey((value) => value + 1);
                    }}
                >
                    Refresh
                </button>
            </div>
            {invalidRange && <p role='alert'>From must be on or before To.</p>}
            {loading && <p role='status'>Loading audit logs…</p>}
            {error && <p role='alert'>{error}</p>}
            {!loading && !error && <div className='data-panel'>
                <div className='table-scroll audit-desktop' role='region' aria-label='Audit history table' tabIndex={0}>
                    <table>
                        <thead>
                            <tr>
                                {["Date and time", "Employee", "Record", "Action", "Change", "Details"].map((label) => (
                                    <th scope='col' key={label}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <time dateTime={log.timestamp}>
                                            {dateFormatter.format(new Date(log.timestamp))}
                                        </time>
                                    </td>
                                    <td>{log.employee || "Not recorded"}</td>
                                    <td>{log.recordLabel}</td>
                                    <td>
                                        <ActionBadge action={log.action} />
                                    </td>
                                    <td>{log.change}</td>
                                    <td>{details(log)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul className='audit-mobile' aria-label='Audit history events'>
                    {visible.map((log) => (
                        <li key={log.id} className='audit-event'>
                            <div className='section-title'>
                                <strong>{log.recordLabel}</strong>
                                <ActionBadge action={log.action} />
                            </div>
                            <p>
                                <time dateTime={log.timestamp}>{dateFormatter.format(new Date(log.timestamp))}</time>{" "}
                                · {log.employee || "Not recorded"}
                            </p>
                            <p>{log.change}</p>
                            {details(log)}
                        </li>
                    ))}
                </ul>
                {visible.length === 0 && (
                    <p className='empty-state' role='status'>
                        {invalidRange ? "Choose a valid date range." : "No audit events match your filters."}
                    </p>
                )}
                <div className='table-footer'>
                    <span role='status'>
                        {filtered.length
                            ? `${(current - 1) * 5 + 1}–${Math.min(current * 5, filtered.length)} of ${filtered.length} events`
                            : "0 events"}
                    </span>
                    <nav className='pagination' aria-label='Audit history pagination'>
                        <button
                            className='button secondary'
                            disabled={current === 1}
                            onClick={() => setPage(current - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            {current} / {last}
                        </span>
                        <button
                            className='button secondary'
                            disabled={current === last}
                            onClick={() => setPage(current + 1)}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
            }
            {selected && <AuditLogDetails log={selected} onClose={() => setSelected(null)} />}
        </section>
    );
}
