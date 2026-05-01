import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-5 rounded-2xl shadow-md bg-white border`}
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-1 text-gray-800">
            {value || 0}
          </h2>
        </div>

        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={20} />
        </div>

      </div>
    </motion.div>
  );
};

export default StatCard;