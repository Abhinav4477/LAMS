import React, { useState } from "react";
import { Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-4xl mx-auto z-50 px-4 sm:px-6 lg:px-0",
        className
      )}
    >
      {/* Navbar "oval" background */}
      <div className="bg-gray-900/90 backdrop-blur-md rounded-full flex items-center justify-between px-6 py-2 shadow-lg">
        
        {/* Logo + LAMS text */}
        <Link
          to="/serviceprovider/serviceproviderhomepage"
          className="flex items-center space-x-2 flex-shrink-0"
        >
          <img
            src="/public/logo.png"
            alt="LAMS Logo"
            className="h-8 w-auto cursor-pointer"
          />
          <span className="text-white font-bold text-lg">LAMS</span>
        </Link>

        {/* Menu */}
        <div className="flex-1 ml-6">
          <Menu setActive={setActive}>
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

            <MenuItem setActive={setActive} active={active} item="Products">
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                {/* External links can remain as <a> */}
                <ProductItem
                  title="Algochurn"
                  href="https://algochurn.com"
                  src="https://assets.aceternity.com/demos/algochurn.webp"
                  description="Prepare for tech interviews like never before."
                />
                <ProductItem
                  title="Tailwind Master Kit"
                  href="https://tailwindmasterkit.com"
                  src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                  description="Production ready Tailwind CSS components for your next project"
                />
                <ProductItem
                  title="Moonbeam"
                  href="https://gomoonbeam.com"
                  src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                  description="Never write from scratch again. Go from idea to blog in minutes."
                />
                <ProductItem
                  title="Rogue"
                  href="https://userogue.com"
                  src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                  description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
                />
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-4 text-sm">
                <span
                  onClick={() => navigate("/hobby")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Hobby
                </span>
                <span
                  onClick={() => navigate("/individual")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Individual
                </span>
                <span
                  onClick={() => navigate("/team")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Team
                </span>
                <span
                  onClick={() => navigate("/enterprise")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Enterprise
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
