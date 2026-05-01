import { useState } from "react";
import { createBook } from "../../services/bookService";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    year: "",
    isbn: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // TEXT INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // IMAGE INPUT
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author) {
      return toast.error("Title and Author are required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createBook(formData); // MUST support multipart

      toast.success("Book added successfully");

      setForm({
        title: "",
        author: "",
        description: "",
        year: "",
        isbn: "",
      });

      setImageFile(null);
      setPreview("");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >

        <h2 className="text-2xl font-bold text-indigo-600 text-center">
          Add New Book
        </h2>

        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          <label className="text-sm text-gray-500">Book Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded-lg"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-40 object-cover rounded-lg mt-2"
            />
          )}
        </div>

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* AUTHOR */}
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* YEAR */}
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Published Year"
          className="w-full border p-3 rounded-lg"
        />

        {/* ISBN */}
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full border p-3 rounded-lg"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full border p-3 rounded-lg"
        />

        {/* BUTTON */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Book"}
        </Button>

      </form>
    </div>
  );
};

export default AddBook;