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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavbarDemo = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Services", link: "/user/viewservices" },
    { name: "My Requests", link: "/user/viewrequests" },
    { name: "History", link: "/user/history" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to handle navigation and close mobile menu if open
  const handleNavigate = (link) => {
    navigate(link);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div
            onClick={() => handleNavigate("/user/userHomepage")}
            className="cursor-pointer"
          >
            <NavbarLogo />
          </div>
          <NavItems
            items={navItems.map((item) => ({
              ...item,
              onClick: () => handleNavigate(item.link),
            }))}
          />
          <div className="flex items-center gap-4">
            <NavbarButton onClick={() => handleNavigate("/login")} variant="secondary">
              Login
            </NavbarButton>
            <NavbarButton onClick={() => handleNavigate("/book")} variant="primary">
              Book a call
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div
              onClick={() => handleNavigate("/user/userHomepage")}
              className="cursor-pointer"
            >
              <NavbarLogo />
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
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
              <NavbarButton
                onClick={() => handleNavigate("/login")}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => handleNavigate("/book")}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default NavbarDemo;
