import { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/userService";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);

    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ROLE UPDATE
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      toast.success("Role updated");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
    } catch {
      toast.error("Failed to update role");
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted");

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* LOADING */}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">

                  <td className="p-3">{u.name}</td>
                  <td>{u.email}</td>

                  {/* ROLE DROPDOWN */}
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* DELETE */}
                  <td>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;