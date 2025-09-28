import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
    age: "",
    gender: "",
  });
  const [originalForm, setOriginalForm] = useState({});

  // ---------- Fetch user details ----------
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get("/user/account", {
          withCredentials: true,
        });

        if (!res.data) throw new Error("No data received");

        const userData = {
          username: res.data.username || "",
          email: res.data.email || "",
          name: res.data.name || "",
          phone: res.data.phone || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
        };

        setForm(userData);
        setOriginalForm(userData);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch account details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // ---------- Handle input changes ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------- Check if changes were made ----------
  const hasChanges = Object.keys(form).some((key) => form[key] !== originalForm[key]);

  // ---------- Handle update ----------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      toast("No changes to update");
      return;
    }

    setUpdating(true);

    try {
      // ✅ send full form instead of partial update
      await api.put("/user/account", form, {
        withCredentials: true,
      });

      toast.success("Account updated successfully!");
      setOriginalForm(form);
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update account");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col">
      <NavbarDemo />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-3xl p-10 bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-700">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Account Details</h2>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Always Read-only */}
            <InputField label="Username" name="username" value={form.username} readOnly />
            <InputField label="Email" name="email" value={form.email} readOnly />

            {/* Editable only when editing */}
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={!editing}
            />
            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={!editing}
            />
            <InputField
              label="Age"
              name="age"
              value={form.age}
              onChange={handleChange}
              readOnly={!editing}
            />

            <DropdownField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
            />

            {/* Action buttons */}
            <div className="md:col-span-2 flex justify-center gap-4">
              {editing ? (
                <>
                  <button
                    type="submit"
                    disabled={!hasChanges || updating} // only enabled if changes exist
                    className={`mt-4 flex-1 py-3 rounded-lg font-semibold text-white transition ${
                      !hasChanges || updating
                        ? "bg-gray-600 cursor-not-allowed opacity-60"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                    }`}
                  >
                    {updating ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(originalForm);
                      setEditing(false);
                    }}
                    className="mt-4 flex-1 py-3 bg-neutral-700 rounded-lg font-semibold text-white hover:bg-neutral-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg font-semibold text-white hover:opacity-90 transition"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// ---------- Input field component ----------
const InputField = ({ label, name, value, onChange, readOnly }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-neutral-300 font-medium">
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`px-4 py-3 rounded-lg border text-white transition ${
        readOnly
          ? "bg-neutral-800 border-neutral-700 opacity-70 cursor-not-allowed"
          : "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      }`}
    />
  </div>
);

// ---------- Dropdown field component ----------
const DropdownField = ({ label, name, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-neutral-300 font-medium">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`px-4 py-3 rounded-lg border text-white transition ${
        disabled
          ? "bg-neutral-800 border-neutral-700 opacity-70 cursor-not-allowed"
          : "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      }`}
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
);

export default AccountPage;
