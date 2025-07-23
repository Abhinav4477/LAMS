import React from 'react'

const corousal = () => {
  return (
    <div>
        <div className="carousel w-full h-160 ">
  <div id="slide1" className="carousel-item relative w-full ">
    <img
      src="/src/assets/c.jpg"
      className="w-full " />
      {/* Text overlay */}
<div className="absolute inset-0 flex items-center justify-center">
  <h2 className="text-5xl font-bold text-white px-8 py-6 rounded-lg shadow-lg bg-gradient-to-r from-gray-800 via-blue-700 to-gray-800 bg-opacity-80 text-center tracking-wide drop-shadow-lg">
    Welcome to <span className="text-blue-300 font-extrabold">LAMS!</span>
  </h2>
</div>
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" className="btn btn-circle">❮</a>
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide2" className="carousel-item relative w-full ">
    <img
      src="/src/assets/c1.jpg"
    className="w-full blur-md"></img>
     <div className="absolute inset-0 flex items-center justify-center">
  <div className="text-center">
    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg tracking-wide">
      LAMS: Local Aid Management System
    </h2>
    <p className="text-lg text-white leading-relaxed drop-shadow">
      Empowering communities and institutions to efficiently manage, track, and distribute local aid and resources.<br />
      Streamline your operations, enhance transparency, and make a positive impact with LAMS.
    </p>
  </div>
</div>
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide1" className="btn btn-circle">❮</a>
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide3" className="carousel-item relative w-full">
    <img
      src="/src/assets/c2.jpg"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide2" className="btn btn-circle">❮</a>
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide4" className="carousel-item relative w-full">
    <img
      src="/src/assets/c4.jpg"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide3" className="btn btn-circle">❮</a>
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div>
</div>
    </div>
  )
}

export default corousal