import { useState } from "react";
import type { ReactNode } from "react";

export function DataTable({
  headers,
  rows,
  empty = "No records match your filters.",
}: {
  headers: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  const [page, setPage] = useState(1);
  const last = Math.max(1, Math.ceil(rows.length / 5));
  const current = Math.min(page, last);
  return (
    <div className="data-panel">
      <div
        className="table-scroll"
        role="region"
        aria-label="Results table"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice((current - 1) * 5, current * 5).map((row, index) => (
              <tr key={index}>
                {row.map((cell, column) => (
                  <td key={column}>{cell}</td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="empty-state">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>
          {rows.length
            ? `${(current - 1) * 5 + 1}–${Math.min(current * 5, rows.length)} of ${rows.length} results`
            : "0 results"}
        </span>
        <div className="pagination">
          <button
            className="button secondary"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span aria-live="polite">
            {current} / {last}
          </span>
          <button
            className="button secondary"
            disabled={current === last}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
