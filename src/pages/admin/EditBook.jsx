import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById, updateSingleBook } from "../../services/bookService";
import { toast } from "react-toastify";

const EditBook = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchBook = async () => {
      const res = await getBookById(id);
      setForm(res.data.data);
    };

    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateSingleBook(id, form);
      toast.success("Updated");
    } catch {
      toast.error("Failed");
    }
  };

  return <button onClick={handleUpdate}>Update</button>;
};

export default EditBook;