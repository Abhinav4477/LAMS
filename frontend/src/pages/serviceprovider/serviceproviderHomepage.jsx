import React from "react";
import { useNavigate } from "react-router-dom";
import { WavyBackground } from "../../components/ui/wavy-background";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";
import { FloatingDock } from "../../components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconUserScreen,
  IconBriefcase2,
} from "@tabler/icons-react";

const ServiceProviderHomepage = () => {
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
      title: "Add Service",
      icon: (
        <div onClick={() => navigate("/serviceprovider/addservice")}>
          <IconBriefcase2 className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "View Services",
      icon: (
        <div onClick={() => navigate("/serviceprovider/viewservices")}>
          <IconUserScreen className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "Aceternity UI",
      icon: (
        <div onClick={() => navigate("/aceternity-ui")}>
          <img src="https://assets.aceternity.com/logo-dark.png" width={20} height={20} alt="Aceternity Logo" />
        </div>
      ),
    },
    {
      title: "Changelog",
      icon: (
        <div onClick={() => navigate("/changelog")}>
          <IconExchange className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "Twitter",
      icon: (
        <div onClick={() => window.open("https://twitter.com", "_blank")}>
          <IconBrandX className="h-6 w-6 text-black" />
        </div>
      ),
    },
    {
      title: "GitHub",
      icon: (
        <div onClick={() => window.open("https://github.com", "_blank")}>
          <IconBrandGithub className="h-6 w-6 text-black" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <WavyBackground className="w-full flex flex-col items-center justify-start pt-24 pb-32 relative">
        <div className="w-full fixed top-0 left-0 z-50 bg-black">
          <SPNavbar />
        </div>

        <div className="flex flex-col items-center text-center mt-32 px-4">
          <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold inter-var">
            Welcome to Your Dashboard
            <br />
            Manage your services,
            <br />
            Connect with customers,
            <br />
            And grow your business — all in one place.
          </p>

          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var max-w-xl">
            Empowering service providers to deliver quality, efficiently.
          </p>
        </div>

        <div className="absolute bottom-4 w-full flex justify-center">
          <FloatingDock
            mobileClassName="translate-y-0"
            desktopClassName="bg-black rounded-2xl px-4 py-2"
            items={dockItems}
          />
        </div>
      </WavyBackground>

      <Footer />
    </div>
  );
};

export default ServiceProviderHomepage;
