import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/auth/me");
      setUser(res?.data?.user);

    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!user) return <p className="text-center mt-10">No user data</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">

      <Card>
        <h1 className="text-xl font-bold mb-4">Profile</h1>

        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </Card>

    </div>
  );
};

export default Profile;