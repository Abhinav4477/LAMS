import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

const AboutPage = () => {
  const words = [
    { text: "Local." },
    { text: "Trusted." },
    { text: "Connected." },
    { text: "Empowering Communities." },
    { text: "This is LAMS.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div>
      <Navbar />
      <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full px-6 text-center">
        <div className="flex flex-col items-center justify-center h-[40rem] max-w-3xl mx-auto space-y-6">
          
          <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-white">
            About Local Aid Management System
          </p>

          <TypewriterEffectSmooth words={words} />

          <p className="text-neutral-300 dark:text-neutral-100 text-sm sm:text-base leading-relaxed mt-4">
            The <span className="font-semibold text-blue-400">Local Aid Management System (LAMS)</span> 
            is a web-based platform that bridges the gap between users and trusted local service providers. 
            Whether you need an electrician, plumber, babysitter, or any other verified professional, 
            LAMS ensures that you can connect quickly, securely, and conveniently — all in one place.
          </p>

          <p className="text-neutral-300 dark:text-neutral-100 text-sm sm:text-base leading-relaxed mt-4">
            With features like <span className="font-medium">real-time availability, secure payments, 
            AI chatbot support, and verified credentials</span>, our goal is to simplify access 
            to essential services while ensuring trust and reliability within communities.
          </p>

          <p className="text-neutral-400 dark:text-neutral-200 italic mt-6">
            "LAMS — bringing local help closer to you, one click at a time."
          </p>
        </div>

        <ShootingStars />
        <StarsBackground />
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage
