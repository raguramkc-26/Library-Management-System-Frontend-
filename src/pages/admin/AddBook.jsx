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

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const { title, author, year, isbn, description } = form;

    if (!title.trim() || !author.trim()) {
      return "Title and Author are required";
    }

    if (!year) return "Year is required";

    const yearNum = Number(year);
    if (yearNum < 1000 || yearNum > new Date().getFullYear()) {
      return "Invalid year";
    }

    if (!isbn.trim()) return "ISBN is required";

    if (!description.trim()) return "Description is required";

    return null;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("author", form.author.trim());
      formData.append("genre", form.genre);
      formData.append("description", form.description.trim());
      formData.append("year", Number(form.year)); // FIXED
      formData.append("isbn", form.isbn.trim());

      if (image) {
        formData.append("image", image);
      }

      await instance.post("/books", formData);

      toast.success("Book added successfully");

      // RESET
      setForm({
        title: "",
        author: "",
        genre: "",
        description: "",
        year: "",
        isbn: "",
      });
      setImage(null);
      setPreview(null);

      navigate("/admin/dashboard");

    } catch (err) {
      console.error("ADD BOOK ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
        "Server error while adding book"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Add Book</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="title"
            value={form.title}
            placeholder="Title"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="author"
            value={form.author}
            placeholder="Author"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="genre"
            value={form.genre}
            placeholder="Genre"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            name="year"
            value={form.year}
            placeholder="Year"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

        </div>

        <input
          name="isbn"
          value={form.isbn}
          placeholder="ISBN Number"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-32 rounded shadow"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>

      </div>
    </div>
  );
};

export default AddBook;