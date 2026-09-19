import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../features/products/product_slice";
import { addtocart } from "../../features/cart/cart_slice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

export const ProductDetails = () => {
  const { product_id } = useParams<{ product_id: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product,
  );

  const user = useAppSelector((state) => state.user.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product
  useEffect(() => {
    if (!product_id) return;

    dispatch(getProductById({ product_id }));
  }, [dispatch, product_id]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [selectedProduct?.id]);

  const handleIncreaseQuantity = () => {
    if (!selectedProduct) return;

    if (quantity < selectedProduct.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    if (selectedProduct.stock <= 0) return;

    try {
      setAddingToCart(true);

      await dispatch(
        addtocart({
          product_id: selectedProduct.id,
          quantity,
        }),
      ).unwrap();

      navigate("/cart");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#09090b] p-8 text-center">
          <h2 className="text-2xl font-bold">Unable to load product</h2>

          <p className="mt-3 text-gray-400">{error}</p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-gray-400">Product not found.</p>

          <Link
            to="/products"
            className="mt-5 inline-block text-purple-500 hover:text-purple-400"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = selectedProduct.images || [];

  const currentImage = images[selectedImage]?.image_url || "";

  const totalPrice = Number(selectedProduct.price) * quantity;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ================= HEADER ================= */}

      <header className="border-b border-white/10 bg-[#09090b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/products"
            className="text-2xl font-black tracking-tight sm:text-3xl"
          >
            <span className="text-white">Shop</span>
            <span className="text-purple-500">Sphere</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-7">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-300 transition hover:text-white"
            >
              <span className="text-xl">🛒</span>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-2 text-gray-300 transition hover:text-white"
            >
              <span className="text-xl">📦</span>
              <span className="hidden sm:inline">My Orders</span>
            </Link>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-purple-600">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-8">
        {/* BACK BUTTON */}

        <Link
          to="/product"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"
        >
          <span>←</span>
          Back to Products
        </Link>

        {/* ================= PRODUCT ================= */}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ================= LEFT IMAGE SECTION ================= */}

          <div>
            {/* MAIN IMAGE */}

            <div className="relative w-full max-w-[550px] overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]">
              <div className="h-[350px] w-full max-w-[550px]  sm:h-[510px]">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>

              {/* STOCK BADGE */}

              <div className="absolute left-4 top-4">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-md ${
                    selectedProduct.stock > 0
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border transition ${
                      selectedImage === index
                        ? "border-purple-500 ring-2 ring-purple-500/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT PRODUCT INFO ================= */}

          <div className="flex flex-col justify-center">
            {/* CATEGORY */}

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-500">
              {selectedProduct.category}
            </p>

            {/* NAME */}

            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-3xl">
              {selectedProduct.name}
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-4 text-base leading-7 text-gray-400 sm:text-lg">
              {selectedProduct.description}
            </p>

            {/* PRICE */}

            <div className="mt-8 border-y border-white/10 py-6">
              <p className="text-sm text-gray-500">Price</p>

              <div className="mt-1 flex items-end gap-3">
                <span className="text-2xl font-black">
                  ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
                </span>

                {quantity > 1 && (
                  <span className="pb-1 text-sm text-gray-500">
                    × {quantity}
                  </span>
                )}
              </div>

              {quantity > 1 && (
                <p className="mt-2 text-sm text-purple-400">
                  Total: ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* STOCK INFO */}

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Availability</p>

                <p
                  className={`mt-1 font-semibold ${
                    selectedProduct.stock > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} units available`
                    : "Currently unavailable"}
                </p>
              </div>

              {/* QUANTITY */}

              {selectedProduct.stock > 0 && (
                <div>
                  <p className="mb-2 text-right text-sm text-gray-500">
                    Quantity
                  </p>

                  <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-[#09090b]">
                    <button
                      type="button"
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2.5 text-lg text-gray-300 transition hover:bg-white/5 disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="min-w-12 border-x border-white/10 px-4 py-2.5 text-center font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={handleIncreaseQuantity}
                      disabled={quantity >= selectedProduct.stock}
                      className="px-4 py-2.5 text-lg text-gray-300 transition hover:bg-white/5 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0 || addingToCart}
                className="flex-1 rounded-xl bg-purple-600 px-6 py-4 font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {addingToCart
                  ? "Adding to Cart..."
                  : selectedProduct.stock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              <Link
                to="/cart"
                className="rounded-xl border border-white/10 px-6 py-4 text-center font-semibold text-gray-200 transition hover:border-purple-500 hover:bg-white/5"
              >
                View Cart
              </Link>
            </div>

            {/* SMALL INFORMATION */}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-gray-500">Category</p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {selectedProduct.category}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-gray-500">Stock</p>

                <p className="mt-1 text-sm font-semibold">
                  {selectedProduct.stock}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-gray-500">Product ID</p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {selectedProduct.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
