export default function DataTable({ title, rows = [], columns = [] }) {
  return (
    <div className="card bg-base-200 border border-base-300 rounded-2xl">
      <div className="card-body">
        <h3 className="font-semibold text-lg">📋 {title}</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r, idx) => (
                  <tr key={r._id || idx}>
                    {columns.map((c) => (
                      <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="opacity-70">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
