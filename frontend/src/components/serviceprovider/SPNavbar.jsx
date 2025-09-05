import React, { useState, useEffect } from "react";
import { Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Example: Import images from src/assets (optional)
import newWorkImg from "/pt1.png";
import manageWorkImg from "/pt2.png";
import transactionsImg from "/pt3.png";
import reportImg from "/pt4.png";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          "http://localhost:5001/api/provider/account/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setActive(null);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (!isAuthenticated) return null;

  // Helper for navigation on ProductItem click
  const handleNavigate = (path) => () => navigate(path);

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-4xl mx-auto z-50 px-4 sm:px-6 lg:px-0",
        className
      )}
    >
      <div className="bg-gray-900/90 backdrop-blur-md rounded-full flex items-center justify-between px-6 py-2 shadow-lg">
        {/* Logo */}
        <Link
          to="/serviceprovider/serviceproviderhomepage"
          className="flex items-center space-x-2 flex-shrink-0"
        >
          <img
            src="/logo.png" // public/logo.png
            alt="LAMS Logo"
            className="h-8 w-auto cursor-pointer"
          />
          <span className="text-white font-bold text-lg">LAMS</span>
        </Link>

        {/* Menu */}
        <div className="flex-1 ml-6">
          <Menu setActive={setActive}>
            {/* Services Menu */}
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <span
                  onClick={() => navigate("/serviceprovider/addservice")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Add Service
                </span>
                <span
                  onClick={() => navigate("/serviceprovider/viewservices")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  View Services
                </span>
              </div>
            </MenuItem>

            {/* Work Menu */}
            <MenuItem setActive={setActive} active={active} item="Work">
              <div className="text-sm grid grid-cols-2 gap-6 p-4">
                <div onClick={handleNavigate("/serviceprovider/viewrequests")}>
                  <ProductItem
                    title="New Work"
                    src={newWorkImg} // src/assets/pt1.png OR public path "/images/pt1.png"
                    description="Find Your New Requests Here."
                  />
                </div>

                <div onClick={handleNavigate("/serviceprovider/manage")}>
                  <ProductItem
                    title="Manage Work"
                    src={manageWorkImg} // src/assets/manage-work.png OR public path "/images/manage-work.png"
                    description="Manage Your Accepted Works Here."
                  />
                </div>

                <div onClick={handleNavigate("/serviceprovider/transaction")}>
                  <ProductItem
                    title="Transactions"
                    src={transactionsImg} // src/assets/transactions.png OR public path "/images/transactions.png"
                    description="See Your Transaction History."
                  />
                </div>

                <div onClick={handleNavigate("/serviceprovider/report")}>
                  <ProductItem
                    title="Report"
                    src={reportImg} // src/assets/report.png OR public path "/images/report.png"
                    description="See Your Service Reports."
                  />
                </div>
              </div>
            </MenuItem>

            {/* Account Menu */}
            <MenuItem setActive={setActive} active={active} item="Account">
              <div className="flex flex-col space-y-4 text-sm">
                <span
                  onClick={() => navigate("/serviceprovider/spaccount")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  About
                </span>
                <span
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-blue-400"
                >
                  LogOut
                </span>
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
