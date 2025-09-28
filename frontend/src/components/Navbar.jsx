import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div data-theme="corporate">
      <div className="navbar bg-base-100 shadow-sm relative z-50">
        {/* Left side */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown relative">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content absolute bg-base-100 rounded-xl z-[9999] mt-3 w-56 p-2 shadow-lg"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li tabIndex={0}>
                <details>
                  <summary className="hover:text-primary">Account</summary>
                  <ul className="p-2 space-y-1">
                    <li>
                      <Link
                        to="/register"
                        className="hover:bg-primary hover:text-white rounded-lg transition"
                      >
                        New Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="hover:bg-primary hover:text-white rounded-lg transition"
                      >
                        Log-In
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <Link to="/">
            <img src="/src/assets/images/lams.png" alt="Logo" className="h-12" />
          </Link>
        </div>

        {/* Center (Desktop Menu) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            {/* Modernized Account Dropdown */}
            <li className="relative group">
              <button className="hover:text-primary transition-colors">
                Account
              </button>
              <ul className="absolute hidden group-hover:flex flex-col bg-base-100 shadow-xl rounded-xl mt-3 p-3 w-44 space-y-2 transition-all duration-300 ease-in-out">
                <li>
                  <Link
                    to="/register"
                    className="hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition"
                  >
                    New Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition"
                  >
                    Log-In
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end">
          <Link
            to="/login"
            className="w-40 h-10 rounded-xl bg-transparent border border-black text-black text-sm flex items-center justify-center z-10 hover:bg-black hover:text-white transition-colors duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
