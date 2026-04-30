import { useEffect, useState } from "react";
import { getMe } from "../../services/authService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  if (!user) return <p>No user data</p>;

  return (
    <Card>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </Card>
  );
};

export default Profile;