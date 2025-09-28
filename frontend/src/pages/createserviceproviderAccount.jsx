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

const ServiceProviderRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role] = useState("provider");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !name || !phone || !address) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await api.post("/auth/register/provider", {
        username,
        password,
        email,
        role,
        name,
        phone,
        address,
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
