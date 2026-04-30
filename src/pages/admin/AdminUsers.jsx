import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminService";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsers(res.data.data || []);
    };

    fetchUsers();
  }, []);

  return (
    <Card>
      {!users.length ? (
        <EmptyState title="No users" />
      ) : (
        users.map((u) => <p key={u._id}>{u.name}</p>)
      )}
    </Card>
  );
};

export default AdminUsers;