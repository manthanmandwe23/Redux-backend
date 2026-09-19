import React from 'react'

const FeaturesSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          Everything in one place
        </p>

        <h2 className="text-4xl font-bold tracking-tight">
          Built around your shopping journey.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-xl text-purple-400">
            ◈
          </div>

          <h3 className="text-2xl font-semibold">Explore Products</h3>

          <p className="mt-3 leading-7 text-gray-400">
            Search and explore products with useful product information,
            pricing, categories, and availability.
          </p>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-xl text-purple-400">
            ◎
          </div>

          <h3 className="text-2xl font-semibold">Manage Your Orders</h3>

          <p className="mt-3 leading-7 text-gray-400">
            Add products to your cart, place orders, view your order history,
            and manage your purchases.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection