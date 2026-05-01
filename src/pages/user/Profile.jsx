import { useEffect, useState } from "react";
import { getMe, updateProfile } from "../../services/authService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();

        const userData = res?.data?.user;

        setUser(userData);
        setForm({
          name: userData.name,
          email: userData.email,
        });

      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile
  const handleSave = async () => {
    if (!form.name || !form.email) {
      return toast.error("All fields required");
    }

    try {
      setSaving(true);

      const res = await updateProfile(form);

      setUser(res?.data?.user);
      setEditMode(false);

      toast.success("Profile updated");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return <p className="text-center text-gray-500">No user data</p>;
  }

  return (
    <div className="p-6 flex justify-center">

      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5">

        {/* HEADER */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-indigo-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-bold mt-3">Profile</h2>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <input
              value={user.role}
              disabled
              className="w-full border p-3 rounded-lg mt-1 bg-gray-100"
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-4">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    name: user.name,
                    email: user.email,
                  });
                }}
                className="w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </Card>

    </div>
  );
};

export default Profile;