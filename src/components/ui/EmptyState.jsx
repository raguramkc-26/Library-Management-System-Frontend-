const EmptyState = ({ message = "No data found" }) => {
  return (
    <div className="text-center py-10 text-gray-400">
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;