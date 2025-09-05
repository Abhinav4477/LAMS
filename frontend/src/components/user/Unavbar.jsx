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

const NavbarDemo = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Services", link: "/user/viewservices" },
    { name: "My Requests", link: "/user/viewrequests" },
    { name: "History", link: "/user/history" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ---------- Check login with backend ----------
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not logged in");
      } catch (err) {
        window.location.replace("/login"); // redirect to login if not logged in
      }

      // Disable back navigation
      window.history.pushState(null, "", window.location.href);
      const handleBack = () => window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBack);

      return () => window.removeEventListener("popstate", handleBack);
    };

    checkLogin();
  }, []);

  // ---------- Navigation ----------
  const handleNavigate = (link) => {
    navigate(link, { replace: true });
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  // ---------- Logout ----------
  const handleLogout = async () => {
  try {
    await fetch("http://localhost:5001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.replace("/login"); // force reload
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <div onClick={() => handleNavigate("/user/userHomepage")} className="cursor-pointer">
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
          <div onClick={() => handleNavigate("/user/userHomepage")} className="cursor-pointer">
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
