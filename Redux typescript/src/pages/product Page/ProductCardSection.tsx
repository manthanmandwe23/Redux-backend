import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getAllProducts } from "../../features/products/product_slice";
import { Header } from "./Header";
import { addtocart } from "../../features/cart/cart_slice";

type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

export const ProductCardSection = () => {
  const dispatch = useAppDispatch();

  const { product, loading, error } = useAppSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [page, setPage] = useState(1);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  // Mobile filter popup
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const limit = 12;

  // Fetch products
  useEffect(() => {
    dispatch(
      getAllProducts({
        page,
        limit,
        sort,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search: search || undefined,
      }),
    );
  }, [dispatch, page, limit, sort, category, minPrice, maxPrice, search]);

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSort = (value: SortOption) => {
    setSort(value);
    setPage(1);
  };

  const handleMinPrice = (value: string) => {
    setMinPrice(value);
    setPage(1);
  };

  const handleMaxPrice = (value: string) => {
    setMaxPrice(value);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  // Get categories from currently loaded products
  const categories = Array.from(
    new Set(product.map((item) => item.category).filter(Boolean)),
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      {/* HEADER */}
      <Header search={search} setSearch={setSearch} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#09090b] px-6 py-8 lg:block">
          <FilterContent
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sort={sort}
            categories={categories}
            onCategoryChange={handleCategory}
            onMinPriceChange={handleMinPrice}
            onMaxPriceChange={handleMaxPrice}
            onSortChange={handleSort}
            onClear={handleClearFilters}
          />
        </aside>

        {/* ================= MOBILE FILTER POPUP ================= */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-24 lg:hidden">
            <div
              ref={filterRef}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#09090b] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>

                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-xl text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <FilterContent
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                sort={sort}
                categories={categories}
                onCategoryChange={handleCategory}
                onMinPriceChange={handleMinPrice}
                onMaxPriceChange={handleMaxPrice}
                onSortChange={handleSort}
                onClear={handleClearFilters}
              />

              <button
                type="button"
                onClick={handleApplyFilters}
                className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS AREA ================= */}
        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10 lg:py-2">
          <div className="w-full">
            {/* HEADING */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-purple-500">
                Our Collection
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Discover Products
              </h1>

              <p className="mt-3 max-w-2xl text-base text-gray-400 sm:text-lg">
                Explore our collection and find something you'll love.
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111113] px-5 py-3 font-semibold text-white transition hover:border-purple-500"
              >
                <span>⚙</span>
                Filters
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-60 items-center justify-center">
                <p className="text-gray-400">Loading products...</p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-red-400">
                {error}
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && product.length === 0 && (
              <div className="flex min-h-60 items-center justify-center">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && !error && product.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {product.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] transition duration-300 hover:-translate-y-1 hover:border-purple-500/40"
                    >
                      {/* IMAGE */}
                      <div className="h-56 w-full overflow-hidden bg-[#111113] sm:h-60">
                        {item.images?.[0]?.image_url ? (
                          <img
                            src={item.images[0].image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="p-5">
                        {/* CATEGORY + STOCK */}
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="text-sm font-medium uppercase tracking-wide text-purple-500">
                            {item.category}
                          </span>

                          <span
                            className={`text-sm ${
                              item.stock > 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {item.stock > 0
                              ? `${item.stock} available`
                              : "Out of stock"}
                          </span>
                        </div>

                        {/* NAME */}
                        <h2 className="truncate text-lg font-bold text-white">
                          {item.name}
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="mt-1 h-8 overflow-hidden text-sm leading-6 text-gray-400">
                          {item.description}
                        </p>

                        {/* PRICE */}
                        <p className="mt-2 text-lg font-black text-white">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>

                        {/* BUTTONS */}
                        <div className="mt-5 flex gap-3">
                          <Link
                            to={`/product/${item.id}`}
                            className="flex-1 rounded-xl border border-white/10 px-3 py-3 text-center text-sm font-semibold text-white transition hover:border-purple-500 hover:bg-white/5"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            disabled={item.stock <= 0}
                            onClick={async () => {
                              try {
                                await dispatch(
                                  addtocart({
                                    product_id: item.id,
                                    quantity: 1,
                                  }),
                                ).unwrap();

                                setAddedProduct(item.id);

                                setTimeout(() => {
                                  setAddedProduct(null);
                                }, 2000);
                              } catch (error) {
                                console.error(
                                  "Failed to add product to cart:",
                                  error,
                                );
                              }
                            }}
                            className="flex-1 rounded-xl bg-purple-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {addedProduct === item.id
                              ? "Added to Cart ✓"
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="mt-10 flex items-center justify-center gap-4 pb-6">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-purple-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <span className="rounded-xl bg-white/5 px-5 py-2.5 text-sm font-semibold">
                    Page {page}
                  </span>

                  <button
                    type="button"
                    disabled={product.length < limit}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-purple-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   FILTER CONTENT
========================================================= */

interface FilterContentProps {
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  categories: string[];

  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClear: () => void;
}

const FilterContent = ({
  category,
  minPrice,
  maxPrice,
  sort,
  categories,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onClear,
}: FilterContentProps) => {
  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Filters</h2>

      {/* CATEGORY */}
      <div className="mb-7">
        <label className="mb-3 block text-sm text-gray-300">Category</label>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3 text-white outline-none focus:border-purple-500"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="mb-7">
        <label className="mb-3 block text-sm text-gray-300">Price Range</label>

        <div className="space-y-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Minimum ₹"
            className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Maximum ₹"
            className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* SORT */}
      <div className="mb-7">
        <label className="mb-3 block text-sm text-gray-300">Sort By</label>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3 text-white outline-none focus:border-purple-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* CLEAR */}
      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-red-500/50 hover:text-red-400"
      >
        Clear Filters
      </button>
    </div>
  );
};
