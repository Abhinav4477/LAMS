import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { Link } from 'react-router-dom';

const homePage = () => {
   const words = [
    {
      text: "Fast.",
    },
    {
      text: "Reliable.",
    },
    {
      text: "Hassle-Free.",
    },
    {
      text: "All in one place.",
    },
    {
      text: "LAMS, Made Simple.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div>
      <Navbar />
    <div
      className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-white  ">
        Your Local Services, One Click Away
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
       
         <Link to="/login"  className="w-40 h-10 rounded-xl bg-transparent border dark:border-white border-white text-white text-sm flex items-center justify-center z-10 hover:bg-white hover:text-black transition-colors duration-300">
  Login
</Link>

        
         <Link to="/register"  className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm flex items-center justify-center z-10 hover:bg-black hover:text-white transition-colors duration-300">
  Signup
</Link>
      </div>
    </div>
      <ShootingStars />
      <StarsBackground />
    </div>
<Footer />
    </div>
  )
}

export default homePage