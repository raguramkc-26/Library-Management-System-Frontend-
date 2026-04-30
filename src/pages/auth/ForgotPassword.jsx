import { useState } from "react";
import { forgotPassword } from "../../services/authService";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      await forgotPassword(email);
      toast.success("Reset link sent");

    } catch (err) {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Send Link</button>
    </form>
  );
};

export default ForgotPassword;