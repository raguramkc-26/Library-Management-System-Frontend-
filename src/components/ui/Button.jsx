const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${className}`}
  >
    {children}
  </button>
);

export default Button;