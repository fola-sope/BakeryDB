import type { AuditLog } from "../../types";
import { Modal } from "../ui/Modal";

export function AuditLogDetails({ log, onClose }: { log: AuditLog; onClose: () => void }) {
    return (
        <Modal title='Audit event details' onClose={onClose}>
            <div className='audit-details'>
                <p className='small-note'>Database record · Read-only · Timestamp shown as recorded</p>
                <dl>
                    <dt>Log ID</dt>
                    <dd>{log.id}</dd>
                    <dt>Table name</dt>
                    <dd>{log.tableName}</dd>
                    <dt>Record ID</dt>
                    <dd>{log.recordId}</dd>
                    <dt>Employee</dt>
                    <dd>{log.employee?.trim() || "Not recorded"}</dd>
                    <dt>Timestamp</dt>
                    <dd>
                        <time dateTime={log.timestamp}>{log.timestamp}</time>
                    </dd>
                    <dt>Action</dt>
                    <dd>{log.action}</dd>
                </dl>
                <h3>Full old values</h3>
                <pre>{log.oldValues === null ? "No previous record" : JSON.stringify(log.oldValues, null, 2)}</pre>
                <h3>Full new values</h3>
                <pre>{log.newValues === null ? "No new record" : JSON.stringify(log.newValues, null, 2)}</pre>
                <button className='button secondary' onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
}
