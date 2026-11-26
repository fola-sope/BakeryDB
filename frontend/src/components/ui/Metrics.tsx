export function Metrics({ items }: { items: [string, string, string][] }) {
    return (
        <div className='metrics-grid'>
            {items.map(([label, value, note]) => (
                <article className='metric-card' key={label}>
                    <p>{label}</p>
                    <strong>{value}</strong>
                    <span>{note}</span>
                </article>
            ))}
        </div>
    );
}
