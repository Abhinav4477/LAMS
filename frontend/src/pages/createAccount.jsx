import React, { useState } from "react";
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

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role] = useState("user"); // default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        username,
        password,
        email,
        role,
        name,
        phone,
        age,
        gender,
      });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";
      toast.error(message);
    }
  };

  const handleGenderSelect = (value) => {
    setGender(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-neutral-900 relative overflow-y-auto py-10">
        <div className="shadow-input w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black z-10">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to L.A.M.S
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Create your account here
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label>Name</Label>
              <Input
                id="name"
                placeholder="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label>Phone</Label>
              <Input
                id="phone"
                placeholder="phone number"
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </LabelInputContainer>

            {/* Age and Gender in the same row */}
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
              <LabelInputContainer className="flex-1">
                <Label>Age</Label>
                <Input
                  id="age"
                  placeholder="age"
                  type="number"
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </LabelInputContainer>

              {/* Animated Dropdown */}
              <LabelInputContainer className="flex-1 relative">
                <Label>Gender</Label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-left text-sm text-black dark:bg-zinc-900 dark:text-white flex justify-between items-center"
                >
                  {gender || "Select"}
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

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-8">
              <Label htmlFor="uname">Username</Label>
              <Input
                id="uname"
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          </form>
        </div>

        {/* Background effects */}
        <ShootingStars />
        <StarsBackground />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default CreateAccount;
