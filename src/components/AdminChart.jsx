import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const AdminChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
        No chart data available
      </div>
    );
  }

  const formatted = data.map((item) => ({
    month: months[item._id - 1],
    borrows: item.count,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="mb-4 font-semibold text-lg">
        📈 Monthly Borrow Trends
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="borrows"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminChart;