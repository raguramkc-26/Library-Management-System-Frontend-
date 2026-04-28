import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const BorrowedBooks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get("/borrow/me").then((res) => {
      setData(res.data.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {data.map((b) => (
        <Card key={b._id}>
          <h2>{b.book?.title}</h2>
          <p>{b.status}</p>
        </Card>
      ))}
    </div>
  );
};

export default BorrowedBooks;