import { useEffect, useState } from "react";
import { getMyBorrowings } from "../../services/bookService";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowed = async () => {
      try {
        const res = await getMyBorrowings();
        setBooks(res?.data?.data || []);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowed();
  }, []);

  if (loading) return <Loader />;

  if (!books.length)
    return <EmptyState title="No borrowed books" />;

  return (
    <div className="p-6 space-y-4">
      {books.map((b) => (
        <Card key={b._id}>{b.book?.title}</Card>
      ))}
    </div>
  );
};

export default BorrowedBooks;