import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ShootingStars } from "../components/ui/shooting-stars";
import { StarsBackground } from "../components/ui/stars-background";

const homePage = () => {
  return (
    <div>
      <Navbar />
      {/* <div
  className="hero min-h-screen"
  style={{
    backgroundImage:
      "url(/c.jpg)",
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
      <p className="mb-5">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div> */}

    <div
      className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2
        className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Shooting Star</span>
        <span className="text-white text-lg font-thin">x</span>
        <span>Star Background</span>
      </h2>
      <br></br>
      <button className="btn btn-outline btn-primary">Get Started</button>
      <ShootingStars />
      <StarsBackground />
    </div>
<Footer />
    </div>
  )
}

export default homePage