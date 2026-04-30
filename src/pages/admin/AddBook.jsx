import { useState } from "react";
import { toast } from "react-toastify";
import { getBooks } from "../../services/bookService"; 
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    year: "",
    isbn: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const res = await getBooks();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.year || !form.isbn) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);

      await instance.post("/books", data);

      toast.success("Book added successfully");

      setForm({
        title: "",
        author: "",
        description: "",
        year: "",
        isbn: "",
      });
      setImage(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="space-y-4">

        <h2 className="text-xl font-semibold">Add New Book</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-24 h-32 object-cover rounded"
          />
        )}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </Button>

      </Card>
    </div>
  );
};

export default AddBook;