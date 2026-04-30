import { useState } from "react";
import { createBook } from "../../services/bookService";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";

const AddBook = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createBook(form);
      toast.success("Book added");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={handleSubmit}>Add Book</Button>;
};

export default AddBook;