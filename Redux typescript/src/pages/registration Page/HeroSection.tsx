import React from "react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32">
      <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-purple-500" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
              Modern Shopping
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Shop smarter.
            <br />
            <span className="text-purple-500">Live better.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
            Discover products, manage your cart, and keep track of your orders —
            all in one simple and modern shopping experience.
          </p>

          <a
            href="#register"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-purple-600 px-7 py-3.5 font-semibold transition duration-300 hover:-translate-y-1 hover:bg-purple-500"
          >
            Create Account
            <span className="text-lg">→</span>
          </a>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute inset-0 rounded-3xl bg-purple-600/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Your shopping experience
              </span>

              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                Simple
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 text-purple-400">01</div>
                <h3 className="text-lg font-semibold">Discover Products</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse products and find what you need.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 text-purple-400">02</div>
                <h3 className="text-lg font-semibold">Manage Your Cart</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add products and manage quantities easily.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
                <div className="mb-2 text-purple-400">03</div>
                <h3 className="text-lg font-semibold">Track Your Orders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Place orders and keep track of their status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
