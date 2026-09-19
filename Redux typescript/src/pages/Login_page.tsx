import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { loginUser } from "../features/auth/auth_slice";

export const LoginUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    try {
      await dispatch(loginUser(formData)).unwrap();

      navigate("/product");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      {/* Header */}
      <header className="fixed left-0 top-0 z-50 w-full bg-[#07070a]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Shop<span className="text-purple-500">Sphere</span>
          </Link>

          <Link
            to="/"
            className="rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Login Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20">
        {/* Background glow */}
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
          {/* Left Content */}
          <div className="hidden lg:block">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Welcome Back
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Your shopping
              <br />
              <span className="text-purple-500">journey continues.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
              Sign in to access your products, cart, and orders from one simple
              and secure place.
            </p>

            <div className="mt-8 space-y-4 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✦</span>
                Access your saved cart
              </div>

              <div className="flex items-center gap-3">
                <span className="text-purple-400">✦</span>
                View your order history
              </div>

              <div className="flex items-center gap-3">
                <span className="text-purple-400">✦</span>
                Secure authentication
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full">
            {/* Mobile heading */}
            <div className="mb-8 text-center lg:hidden">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                Welcome Back
              </p>

              <h1 className="text-4xl font-bold">
                Sign in to Shop
                <span className="text-purple-500">Sphere</span>
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-9"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Sign in</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter your credentials to continue.
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Username or Email
                </label>

                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-gray-400">Password</label>

                  <button
                    type="button"
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-purple-500"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-purple-600 py-3.5 font-semibold transition duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>

              {/* Register */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full px-6 py-5 text-center text-xs text-gray-600">
        © 2026 ShopSphere. Built with React, TypeScript & Node.js.
      </footer>
    </div>
  );
};
