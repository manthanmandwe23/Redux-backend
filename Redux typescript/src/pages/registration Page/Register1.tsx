import React from 'react'
import { Link } from 'react-router-dom';

const Register1 = () => {
  return (
 
      <header className="absolute top-0 left-0 z-50 w-full bg-[#07070a]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Shop<span className="text-purple-500">Sphere</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="#register"
              className="rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
            >
              Sign Up
            </a>

            <Link
              to="/login"
              className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold transition hover:bg-purple-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
   
  );
}

export default Register1