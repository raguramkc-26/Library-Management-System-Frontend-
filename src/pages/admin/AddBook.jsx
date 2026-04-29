import { useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    year: "",
    isbn: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const { title, author, year, isbn } = form;

    if (!title || !author || !year || !isbn) {
      return toast.error("All required fields must be filled");
    }

    if (year < 1000 || year > new Date().getFullYear()) {
      return toast.error("Invalid year");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) formData.append("image", image);

      await instance.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book added successfully");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error("ADD BOOK ERROR:", err);
      toast.error(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Add Book</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <div className="grid md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="author" placeholder="Author" onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="genre" placeholder="Genre" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="number" name="year" placeholder="Year" onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <input name="isbn" placeholder="ISBN Number" onChange={handleChange} className="border p-2 rounded w-full" />

        <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 rounded w-full" />

        <input type="file" onChange={handleImageChange} />

        {preview && <img src={preview} className="w-32 rounded" />}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>

      </div>
    </div>
  );
};

export default AddBook;