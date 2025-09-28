import React from "react";
import { Spotlight } from "../../components/ui/spotlight-new";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";
import { FlipWords } from "../../components/ui/flip-words";
import { FloatingDock } from "../../components/ui/floating-dock";
import { IconUser,IconHistory, IconHome, IconUserScreen, IconBriefcase2 } from "@tabler/icons-react";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";

const UserHomepage = () => {
  const words = ["fast", "reliable", "trusted", "local"];
  const navigate = useNavigate();

  const dockItems = [
    {
      title: "Home",
      icon: (
        <div onClick={() => navigate("/serviceprovider/serviceproviderhomepage")}>
          <IconHome className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: " Services",
      icon: (
        <div onClick={() => navigate("/user/viewservices")}>
          <IconBriefcase2 className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "View Requests",
      icon: (
        <div onClick={() => navigate("/user/viewrequests")}>
          <IconUserScreen className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "History",
      icon: (
        <div onClick={() => navigate("/user/history")}>
          <IconHistory className="h-6 w-6 text-black" />
        </div>
      ),
    },
   
    {
      title: "Account",
      icon: (
        <div onClick={() => navigate("/user/account")}>
          <IconUser className="h-6 w-6 text-black" />
        </div>
      ),
    },
  ];

   useEffect(() => {
  // Prevent browser from caching the page
  window.history.replaceState(null, "", window.location.href);
  window.onpopstate = () => {
    window.location.replace("/login"); // force redirect if back is clicked
  };
}, []);

  return (
    <div className="flex flex-col min-h-screen bg-black antialiased overflow-hidden relative">
      
      {/* Navbar */}
      <div className="relative z-20">
        <NavbarDemo />
      </div>

      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0">
        <Spotlight />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Page Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center min-h-screen">
        
        {/* Heading */}
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-white">
            Find{" "}
            <span className="text-white font-extrabold inline-block">
              <FlipWords words={words} />
            </span>{" "}
            <br />
            professionals near you
          </h1>

          {/* Floating Dock with Menu Label */}
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

      {/* Footer */}
      <footer className="relative z-10 w-full">
        <Footer />
      </footer>

    </div>
  );
};

export default UserHomepage;
