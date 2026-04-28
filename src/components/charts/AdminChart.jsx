import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const AdminChart = ({ data }) => {

  // ✅ SAFE FORMAT (handles missing months)
  const formatted = months.map((month, index) => {
    const item = data?.find((d) => d._id === index + 1);

    return {
      month,
      borrows: item?.borrows || item?.count || 0,
      overdue: item?.overdue || 0,
      revenue: item?.revenue || 0,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          Library Analytics
        </h2>

        <span className="text-sm text-gray-400">
          Monthly overview
        </span>
      </div>

      {formatted.every((d) => d.borrows === 0) ? (
        <p className="text-center text-gray-400 py-10">
          No analytics data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={formatted}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
              }}
            />

            <Legend />

            {/* BORROWS */}
            <Line
              type="monotone"
              dataKey="borrows"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* OVERDUE */}
            <Line
              type="monotone"
              dataKey="overdue"
              stroke="#ef4444"
              strokeWidth={2}
            />

            {/* REVENUE */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
            />

          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminChart;