import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div data-theme="corporate">
<div className="navbar bg-base-100 shadow-sm relative z-[1] ">
        <div className="navbar-start">
          <div className="dropdown relative">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content absolute bg-base-100 rounded-box z-[9999] mt-3 w-52 p-2 shadow"
            >
            <li><Link to="/">Home</Link></li>
              <li>
                <a>Account</a>
                <ul className="p-2">
                  <li><Link to="/register">New Account</Link></li>
                  <li><Link to="/login">Log-In</Link></li>
                </ul>
              </li>
              <li><a>About</a></li>
            </ul>
          </div>
          <Link to="/" >
           <img src="/src/assets/lams.png" alt="Logo" className="h-12" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/">Home</Link></li>
            <li>
              <details>
                <summary>Account</summary>
                <ul className="p-2">
                  <li><Link to="/register">New Account</Link></li>
                  <li><Link to="/login">Log-In</Link></li>
                </ul>
              </details>
            </li>
            <li><a>About</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/login" className='btn btn-outline btn-primary' >
          Sign In

            </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar