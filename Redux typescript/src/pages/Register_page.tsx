import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { registerUser } from "../features/auth/auth_slice";
import Register1 from "./registration Page/Register1";
import HeroSection from "./registration Page/HeroSection";
import FeaturesSection from "./registration Page/FeaturesSection";
import RegistrationForm from "./registration Page/RegistrationForm";
import Footer from "./registration Page/Footer";

export const RegisterUser = () => {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Register1 />

      {/* Hero Section */}

      <HeroSection />

      {/* Features Section */}

      <FeaturesSection />

      {/* Registration Section */}
      <RegistrationForm />
      {/* Footer */}

      <Footer />
    </div>
  );
};
