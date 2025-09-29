import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios"; // make sure api has withCredentials: true

const NavbarDemo = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", link: "/user/userHomepage" },
    { name: "Services", link: "/user/viewservices" },
    { name: "My Requests", link: "/user/viewrequests" },
    { name: "History", link: "/user/history" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // ---------- Check login with backend ----------
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await api.get("/auth/me"); // cookie automatically sent via api
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };
    checkLogin();
  }, [navigate]);

  if (!isAuthenticated) return null;

  // ---------- Navigation ----------
  const handleNavigate = (link) => {
    navigate(link, { replace: true });
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  // ---------- Logout ----------
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // cookie included via api
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <div className="pointer-events-none">
          <NavbarLogo />
        </div>
        <NavItems
          items={navItems.map((item) => ({
            ...item,
            onClick: () => handleNavigate(item.link),
          }))}
        />
        <div className="flex items-center gap-4">
          <NavbarButton onClick={() => handleNavigate("/user/account")} variant="secondary">
            Account
          </NavbarButton>
          <NavbarButton onClick={handleLogout} variant="primary">
            Logout
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <div className="pointer-events-none">
            <NavbarLogo />
          </div>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <button
              key={`mobile-link-${idx}`}
              onClick={() => handleNavigate(item.link)}
              className="relative text-neutral-300 hover:text-white text-left w-full"
            >
              {item.name}
            </button>
          ))}
          <div className="flex w-full flex-col gap-4 mt-4">
            <NavbarButton onClick={() => handleNavigate("/user/account")} variant="secondary" className="w-full">
              Account
            </NavbarButton>
            <NavbarButton onClick={handleLogout} variant="primary" className="w-full">
              Logout
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default NavbarDemo;
