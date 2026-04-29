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

  // SUBMIT
  const handleSubmit = async () => {
    const { title, author, year } = form;

    if (!title || !author || !year) {
      return toast.error("Title, Author & Year are required");
    }

    if (year < 1000 || year > new Date().getFullYear()) {
      return toast.error("Invalid year");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);

      await instance.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book added successfully");

      // RESET
      setForm({
        title: "",
        author: "",
        genre: "",
        description: "",
        year: "",
      });

      setImage(null);
      setPreview(null);

      navigate("/admin/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

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

          {/* 🔥 YEAR FIELD */}
          <input
            type="number"
            name="year"
            value={form.year}
            placeholder="Year"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

        </div>

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 rounded w-full h-28"
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