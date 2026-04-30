import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService"; 
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { getUsers } from "../../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
const res = await getBooks();

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data.data || []);
    });
  }, []);

  return (
    <div className="p-6">
      <Card>
        <h2 className="font-semibold mb-4">Users</h2>

        {users.length === 0 ? (
          <EmptyState title="No users yet" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;