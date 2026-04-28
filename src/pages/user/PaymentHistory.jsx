import { useEffect, useState } from "react";
import instance from "../../instances/instance";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await instance.get("/payment/history");
        setPayments(res.data.data || []);
      } catch {
        console.error("Failed to fetch payments");
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payment History</h1>

      {payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Book</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td>{p.book?.title}</td>
                <td>₹{p.fineAmount}</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;