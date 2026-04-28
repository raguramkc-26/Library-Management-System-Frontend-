const Input = ({ ...props }) => {
  return (
    <input
      {...props}
      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
    />
  );
};

export default Input;