import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/axios";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      const { role, is_verified } = res.data;
      const isVerified = Boolean(is_verified);

      if (role === "provider" && !isVerified) {
        setModalMessage(
          "Your account is not verified yet. Please wait for admin approval."
        );
        setShowModal(true);
        return;
      }

      localStorage.setItem("user", JSON.stringify({ ...res.data, isVerified }));

      toast.success("Login successful");

      if (role === "admin") navigate("/admin/adminHomepage");
      else if (role === "user") navigate("/user/userHomepage");
      else if (role === "provider")
        navigate("/serviceprovider/serviceproviderHomepage");
      else toast.error("Unknown user role");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403 || error.response?.data?.error) {
        setModalMessage(
          error.response.data.error || "Your account is not verified yet."
        );
        setShowModal(true);
      } else {
        toast.error(error.response?.data?.error || "Error logging in");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <Navbar />

      <div className="h-[40rem] flex flex-col items-center justify-center relative w-full bg-neutral-900">
        <div className="mx-auto w-full max-w-md rounded-2xl backdrop-blur-lg bg-white/10 dark:bg-black/30 p-6 md:p-10 shadow-2xl border border-white/20 z-20">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-neutral-300 text-center mt-1">
            Sign in to continue
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="uname" className="text-white">Username</Label>
              <Input
                id="uname"
                placeholder="Enter your username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="text-black placeholder-neutral-400"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-6">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="text-black placeholder-neutral-400"
              />
            </LabelInputContainer>

            <button
              className={cn(
                "group/btn relative block h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-medium text-white shadow-lg hover:shadow-indigo-500/40 transition duration-300",
                loading ? "opacity-70 cursor-not-allowed" : ""
              )}
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In →"}
              <BottomGradient />
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-neutral-300 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-200 font-medium transition"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        <ShootingStars />
        <StarsBackground />
      </div>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full text-center shadow-xl border border-neutral-700">
            <h3 className="text-lg font-bold mb-4 text-white">
              Account Pending Verification
            </h3>
            <p className="mb-6 text-neutral-300">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default LoginPage;
