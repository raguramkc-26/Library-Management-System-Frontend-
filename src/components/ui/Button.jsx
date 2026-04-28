const Button = ({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
  >
    {loading ? "Processing..." : children}
  </button>
);

export default Button;