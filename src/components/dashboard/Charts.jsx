import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";

export function OrdersBarChart({ data = [] }) {
  return (
    <div className="card bg-base-200 border border-base-300 rounded-2xl">
      <div className="card-body">
        <h3 className="font-semibold text-lg">📈 Orders per Month</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function CategoryPieChart({ data = [] }) {
  return (
    <div className="card bg-base-200 border border-base-300 rounded-2xl">
      <div className="card-body">
        <h3 className="font-semibold text-lg">🧩 Category Breakdown</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                outerRadius={90}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
