import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";

import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track per user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.data?.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE ROLE
  const handleRoleChange = async (id, role) => {
    try {
      setActionLoading(id);

      await updateUserRole(id, role);

      toast.success("Role updated");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );

    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(null);
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      await deleteUser(id);

      toast.success("User deleted");

      setUsers((prev) => prev.filter((u) => u._id !== id));

    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Users Management
        </h1>
        <p className="text-gray-500">
          Manage roles and users
        </p>
      </div>

      <Card className="p-6 rounded-2xl shadow-md">

        {!users.length ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* NAME */}
                    <td className="py-3 px-2 font-medium text-gray-800">
                      {u.name}
                    </td>

                    {/* EMAIL */}
                    <td className="py-3 px-2 text-gray-500">
                      {u.email}
                    </td>

                    {/* ROLE DROPDOWN */}
                    <td className="py-3 px-2">
                      <select
                        value={u.role}
                        disabled={actionLoading === u._id}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={actionLoading === u._id}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {actionLoading === u._id ? "..." : "Delete"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;