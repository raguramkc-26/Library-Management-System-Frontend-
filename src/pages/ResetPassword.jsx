import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;