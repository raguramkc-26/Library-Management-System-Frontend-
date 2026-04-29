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

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // VALIDATION
  const validateForm = () => {
    const { title, author, year, isbn } = form;

    if (!title.trim() || !author.trim() || !year || !isbn.trim()) {
      toast.error("Title, Author, Year & ISBN are required");
      return false;
    }

    if (year < 1000 || year > new Date().getFullYear()) {
      toast.error("Enter a valid year");
      return false;
    }

    // ISBN validation (10 or 13 digits)
    if (!/^\d{10}(\d{3})?$/.test(isbn)) {
      toast.error("ISBN must be 10 or 13 digits");
      return false;
    }

    return true;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);

      await instance.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
        err.response?.data?.message || "Server error while adding book"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-5">

        {/* INPUT GRID */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="title"
            value={form.title}
            placeholder="Book Title"
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />

          <input
            name="author"
            value={form.author}
            placeholder="Author"
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />

          <input
            name="genre"
            value={form.genre}
            placeholder="Genre"
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />

          <input
            type="number"
            name="year"
            value={form.year}
            placeholder="Published Year"
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />

          {/* ISBN FIELD */}
          <input
            name="isbn"
            value={form.isbn}
            placeholder="ISBN (10 or 13 digits)"
            onChange={handleChange}
            className="border p-3 rounded w-full md:col-span-2"
          />

        </div>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          placeholder="Book Description"
          onChange={handleChange}
          className="border p-3 rounded w-full h-28"
        />

        {/* IMAGE */}
        <div className="space-y-3">
          <label className="font-medium">Book Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-56 object-cover rounded-lg shadow"
            />
          )}
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddBook;