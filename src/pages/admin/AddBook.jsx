import { useState } from "react";
import { createBook } from "../../services/bookService";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    image: "",
    description: "",
    year: "",
    isbn: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.title || !form.author) {
      return toast.error("Title and Author are required");
    }

    if (form.year && (form.year < 1000 || form.year > new Date().getFullYear())) {
      return toast.error("Enter a valid year");
    }

    if (form.isbn && form.isbn.length < 10) {
      return toast.error("ISBN must be at least 10 characters");
    }

    try {
      setLoading(true);

      await createBook({
        ...form,
        year: Number(form.year),
      });

      toast.success("Book added successfully");

      setForm({
        title: "",
        author: "",
        image: "",
        description: "",
        year: "",
        isbn: "",
      });

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
          placeholder="Published Year (e.g. 2022)"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* ISBN */}
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          placeholder="ISBN Number"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* IMAGE */}
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Adding..." : "Add Book"}
        </Button>

      </form>

    </div>
  );
};

export default AddBook;