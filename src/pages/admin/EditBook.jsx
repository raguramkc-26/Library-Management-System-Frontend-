import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../instances/instance";
import { toast } from "react-toastify";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    const res = await instance.get(`/books/${id}`);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await instance.put(`/books/${id}`, form);
      toast.success("Updated successfully");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Edit Book</h1>

      <input name="title" value={form.title} onChange={handleChange} className="input" />
      <input name="author" value={form.author} onChange={handleChange} className="input" />
      <input name="genre" value={form.genre} onChange={handleChange} className="input" />
      <textarea name="description" value={form.description} onChange={handleChange} className="input" />

      <button onClick={handleUpdate} className="btn-blue mt-4">
        Update
      </button>
    </div>
  );
};

export default EditBook;