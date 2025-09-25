import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";
import { Spotlight } from "../../components/ui/spotlight-new";
import { FlipWords } from "../../components/ui/flip-words";
import { FloatingDock } from "../../components/ui/floating-dock";
import {
  IconUser,
  IconHistory,
  IconHome,
  IconUserScreen,
  IconBriefcase2,
} from "@tabler/icons-react";

const UserHomepage = () => {
  const navigate = useNavigate();
  const words = ["fast", "reliable", "trusted", "local"];

  // ---------- Login check ----------
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login", { replace: true });
  }, [navigate]);

  const dockItems = [
    { title: "Home", icon: <IconHome className="h-6 w-6 text-white" />, onClick: () => navigate("/user/userHomepage") },
    { title: "Services", icon: <IconBriefcase2 className="h-6 w-6 text-white" />, onClick: () => navigate("/user/viewservices") },
    { title: "View Requests", icon: <IconUserScreen className="h-6 w-6 text-white" />, onClick: () => navigate("/user/viewrequests") },
    { title: "History", icon: <IconHistory className="h-6 w-6 text-white" />, onClick: () => navigate("/user/history") },
    { title: "Account", icon: <IconUser className="h-6 w-6 text-white" />, onClick: () => navigate("/user/account") },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black antialiased overflow-hidden relative">
      <div className="relative z-20">
        <NavbarDemo />
      </div>

      <div className="absolute inset-0 z-0">
        <Spotlight />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center min-h-screen">
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-white">
            Find{" "}
            <span className="text-white font-extrabold inline-block">
              <FlipWords words={words} />
            </span>{" "}
            <br />
            professionals near you
          </h1>

          <div className="absolute bottom-4 w-full flex flex-col items-center">
            <p className="text-white text-sm mb-2">Menu</p>
            <FloatingDock
              mobileClassName="translate-y-0"
              desktopClassName="bg-black rounded-2xl px-4 py-2"
              items={dockItems}
            />
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default UserHomepage;
