import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/auth_slice";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js";

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [phone, setPhone] = useState<E164Number | undefined>();
  const { loading } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
    address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!avatar) {
      return;
    }
    if (!phone) {
      // show invalid phone
      return;
    }

    if (loading) return;

    try {
      await dispatch(
        registerUser({
          ...formData,
          avatar,
        }),
      ).unwrap();

      setFormData({
        username: "",
        fullname: "",
        email: "",
        password: "",
        role: "user",
        address: "",
        phone: "",
      });

      setAvatar(null);

      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section
      id="register"
      className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-8"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left Content */}
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
            Get Started
          </p>

          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Create your
            <br />
            <span className="text-purple-500">account.</span>
          </h2>

          <p className="mt-5 max-w-md text-lg leading-8 text-gray-400">
            Join ShopSphere and experience a simple, modern way to discover
            products, manage your cart, and track your orders.
          </p>

          <div className="mt-8 space-y-4 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="text-purple-400">✦</span>
              Secure JWT authentication
            </div>

            <div className="flex items-center gap-3">
              <span className="text-purple-400">✦</span>
              Easy product and cart management
            </div>

            <div className="flex items-center gap-3">
              <span className="text-purple-400">✦</span>
              Complete order tracking
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                Full Name
              </label>

              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                Phone
              </label>

              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                placeholder="Enter phone"
                className="
                  w-full rounded-xl border border-white/10 bg-black/30
                  px-4 py-2.5 text-white
                  focus-within:border-purple-500
                  [&_.PhoneInputInput]:w-full
                  [&_.PhoneInputInput]:border-none
                  [&_.PhoneInputInput]:bg-transparent
                  [&_.PhoneInputInput]:text-white
                  [&_.PhoneInputInput]:outline-none
                  [&_.PhoneInputCountrySelect]:bg-[#111]
                  [&_.PhoneInputCountrySelect]:text-white
                "
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-gray-400">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-gray-400">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-gray-400">
              Profile Picture
            </label>

            <input
              ref={avatarInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 text-white
             transition hover:bg-purple-700
             disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering user...
              </span>
            ) : (
              "Create Account →"
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
