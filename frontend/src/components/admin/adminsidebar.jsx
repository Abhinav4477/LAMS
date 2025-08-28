import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconLocationPin,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/auth/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  };

  const toggleItem = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const links = [
    {
      label: "Dashboard",
      href: "/admin/adminhomepage",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "State",
      icon: (
        <IconLocationPin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      subItems: [
        { label: "Add State", href: "/admin/addstate" },
        { label: "View State", href: "/admin/viewstate" },
      ],
    },
    {
      label: "District",
      icon: (
        <IconLocationPin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      subItems: [
        { label: "Add District", href: "/admin/adddistrict" },
        { label: "View District", href: "/admin/viewdistrict" },
      ],
    },
     {
      label: "Location",
      icon: (
        <IconLocationPin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      subItems: [
        { label: "Add Location", href: "/admin/addlocation" },
        { label: "View Location", href: "/admin/viewlocation" },
      ],
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      isLogout: true,
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full h-screen flex-col md:flex-row overflow-hidden",
        "border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
      )}
    >
      {/* Sidebar Section */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} className="relative">
                  <SidebarLink
                    link={{
                      ...link,
                      icon: link.icon,
                      label: (
                        <div className="flex justify-between items-center w-full">
                          <span className="text-left flex-1">{link.label}</span>
                          {link.subItems &&
                            (expandedItems[link.label] ? (
                              <IconChevronDown className="ml-2 h-4 w-4 text-neutral-500" />
                            ) : (
                              <IconChevronRight className="ml-2 h-4 w-4 text-neutral-500" />
                            ))}
                        </div>
                      ),
                    }}
                    onClick={() =>
                      link.isLogout
                        ? handleLogout()
                        : link.subItems
                        ? toggleItem(link.label)
                        : navigate(link.href)
                    }
                  />

                  {/* Sub-items with animation */}
                  {link.subItems && (
                    <AnimatePresence initial={false}>
                      {expandedItems[link.label] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 flex flex-col gap-1 mt-1 overflow-hidden"
                        >
                          {link.subItems.map((sub, subIdx) => (
                            <SidebarLink
                              key={subIdx}
                              link={sub}
                              onClick={() => navigate(sub.href)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: "Abhinav",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Section */}
      <main className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </main>
    </div>
  );
};

export const Logo = () => (
  <a
    href="/admin/adminhomepage"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    {/* Logo Image */}
    <img
      src="/logo.png" // Replace with your logo path or URL
      alt="Logo"
      className="h-5 w-6 shrink-0"
    />
    {/* Animated Text */}
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      LAMS
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a
    href="/admin/adminhomepage"
    className="relative z-20 flex items-center justify-center py-1 text-sm font-normal text-black"
  >
    {/* Logo Image for collapsed sidebar */}
    <img
      src="/logo.png" // Replace with your logo path or URL
      alt="Logo"
      className="h-5 w-6 shrink-0"
    />
  </a>
);

export default SidebarLayout;
