const Badge = ({ status }) => {
  const styles = {
    borrowed: "bg-blue-100 text-blue-600",
    returned: "bg-green-100 text-green-600",
    overdue: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Badge;