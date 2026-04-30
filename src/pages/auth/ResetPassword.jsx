import { useState } from "react";
import { resetPassword } from "../../services/authService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      await resetPassword(token, password);
      toast.success("Password reset successful");

    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Reset</button>
    </form>
  );
};

export default ResetPassword;