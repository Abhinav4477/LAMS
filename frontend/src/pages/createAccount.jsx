import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";
import { motion, AnimatePresence } from "framer-motion";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState(""); // ✅ new state for address
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !name || !phone || !age || !gender || !address) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        password,
        email,
        role,
        name,
        phone,
        age,
        gender,
        address, // ✅ include address in request
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.error) {
        if (error.response.data.error.includes("duplicate key")) {
          if (error.response.data.error.includes("username")) {
            toast.error("Username already exists");
          } else if (error.response.data.error.includes("email")) {
            toast.error("Email is already registered");
          } else {
            toast.error("Duplicate value error");
          }
          return;
        } else {
          toast.error(error.response.data.error);
          return;
        }
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Internal server error";

      toast.error(message);
    }
  };

  const handleGenderSelect = (value) => {
    setGender(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-neutral-900 relative overflow-y-auto py-10">
        <div className="shadow-input w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black z-10">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to L.A.M.S
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Create your account here
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
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </LabelInputContainer>

            {/* Age + Gender */}
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
              <LabelInputContainer className="flex-1">
                <Label>Age</Label>
                <Input
                  placeholder="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </LabelInputContainer>

              <LabelInputContainer className="flex-1 relative">
                <Label>Gender</Label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-left text-sm text-black dark:bg-zinc-900 dark:text-white flex justify-between items-center"
                >
                  {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Select"}
                  <span className="ml-2 text-gray-500">▼</span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 mt-1 rounded-md border border-gray-300 bg-white dark:bg-zinc-900 shadow-lg z-20"
                    >
                      {["Male", "Female", "Other"].map((option) => (
                        <motion.li
                          key={option}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer px-3 py-2 text-sm text-black dark:text-white"
                          onClick={() => handleGenderSelect(option.toLowerCase())}
                        >
                          {option}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </LabelInputContainer>
            </div>

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
              Sign up &rarr;
            </button>

            <p className="mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              <span onClick={() => navigate("/register/provider")}>
                Register as a Service Provider?
              </span>
            </p>
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

export default CreateAccount;
