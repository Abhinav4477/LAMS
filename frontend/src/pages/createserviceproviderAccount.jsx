import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";
import { motion, AnimatePresence } from "framer-motion";

const ServiceProviderRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role] = useState("provider");
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/admin/getcategories");

        let cats = [];
        if (Array.isArray(res.data)) {
          cats = res.data;
        } else if (Array.isArray(res.data.categories)) {
          cats = res.data.categories;
        }

        setCategories(cats);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !name || !phone || !address || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/register/provider", {
        username,
        password,
        email,
        role,
        name,
        phone,
        address,
        categoryId: category,
      });
      toast.success("Service Provider registered successfully");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(message);
    }
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-neutral-900 relative overflow-y-auto py-10">
        <div className="shadow-input w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black z-10">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Service Provider Registration
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Create your service provider account here
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            {/* Name */}
            <LabelInputContainer className="mb-4">
              <Label>Name</Label>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </LabelInputContainer>

            {/* Phone */}
            <LabelInputContainer className="mb-4">
              <Label>Phone</Label>
              <Input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </LabelInputContainer>

            {/* Address */}
            <LabelInputContainer className="mb-4">
              <Label>Address</Label>
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </LabelInputContainer>

            {/* Category */}
            <LabelInputContainer className="mb-8 relative">
              <Label>Category</Label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-left text-sm text-black dark:bg-zinc-900 dark:text-white flex justify-between items-center"
              >
                {categories.find((c) => c._id === category)?.name || "Select"}
                <span className="ml-2 text-gray-500">▼</span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 mt-1 rounded-md border border-gray-300 bg-white dark:bg-zinc-900 shadow-lg z-20 max-h-40 overflow-y-auto"
                  >
                    {categories.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-gray-500">No categories available</li>
                    ) : (
                      categories.map((c) => (
                        <motion.li
                          key={c._id}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer px-3 py-2 text-sm text-black dark:text-white"
                          onClick={() => handleCategorySelect(c._id)}
                        >
                          {c.name}
                        </motion.li>
                      ))
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </LabelInputContainer>

            {/* Email */}
            <LabelInputContainer className="mb-4">
              <Label>Email Address</Label>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </LabelInputContainer>

            {/* Username */}
            <LabelInputContainer className="mb-8">
              <Label>Username</Label>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </LabelInputContainer>

            {/* Password */}
            <LabelInputContainer className="mb-4">
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </LabelInputContainer>

            <button
              type="submit"
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white"
            >
              Register &rarr;
            </button>
          </form>
        </div>

        <ShootingStars />
        <StarsBackground />
      </main>
      <Footer />
    </div>
  );
};

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

export default ServiceProviderRegister;
