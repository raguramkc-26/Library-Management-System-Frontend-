const Button = ({
  children,
  onClick,
  type = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition";

  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${styles[type]} ${className} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
};

export default Button;