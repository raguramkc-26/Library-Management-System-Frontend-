import { useState } from "react";
import { registerUser } from "../../services/authService"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      await registerUser(form);

      toast.success("Registered successfully");
      navigate("/login");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;