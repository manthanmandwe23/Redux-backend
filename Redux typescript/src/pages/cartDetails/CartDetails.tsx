import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getcart,
  removeFromCart,
  updateCartItem,
} from "../../features/cart/cart_slice";
import { getProductById } from "../../features/products/product_slice";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

interface CartProduct {
  product_id: string;
  quantity: number;
  product: any;
}

export const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart, loading, error } = useAppSelector((state) => state.cart);

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState<string | null>(null);
  const [removingProduct, setRemovingProduct] = useState<string | null>(null);
  const [proceedingToCheckout, setProceedingToCheckout] = useState(false);
  /*
   * Fetch cart when page loads
   */
  useEffect(() => {
    dispatch(getcart());
  }, [dispatch]);

  /*
   * Fetch product details for every cart item
   */
  useEffect(() => {
    const fetchProducts = async () => {
      if (cart.length === 0) {
        setCartProducts([]);
        setLoadingProducts(false);
        return;
      }

      setLoadingProducts(true);

      try {
        const results = await Promise.all(
          cart.map(async (item) => {
            const result = await dispatch(
              getProductById({
                product_id: item.product_id,
              }),
            ).unwrap();

            return {
              product_id: item.product_id,
              quantity: item.quantity,
              product: result,
            };
          }),
        );

        setCartProducts(results);
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [cart, dispatch]);

  /*
   * Increase quantity
   */
  const handleIncrease = async (
    product_id: string,
    currentQuantity: number,
    stock: number,
  ) => {
    if (currentQuantity >= stock) return;

    try {
      setUpdatingProduct(product_id);

      await dispatch(
        updateCartItem({
          product_id,
          quantity: currentQuantity + 1,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    } finally {
      setUpdatingProduct(null);
    }
  };
  const handleProceedToCheckout = async () => {
    setProceedingToCheckout(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate("/checkout");
  };
  /*
   * Decrease quantity
   */
  const handleDecrease = async (
    product_id: string,
    currentQuantity: number,
  ) => {
    if (currentQuantity <= 1) return;

    try {
      setUpdatingProduct(product_id);

      await dispatch(
        updateCartItem({
          product_id,
          quantity: currentQuantity - 1,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    } finally {
      setUpdatingProduct(null);
    }
  };

  /*
   * Remove product
   */
  const handleRemove = async (product_id: string) => {
    try {
      setRemovingProduct(product_id);

      await dispatch(
        removeFromCart({
          product_id,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to remove product:", error);
    } finally {
      setRemovingProduct(null);
    }
  };

  /*
   * Calculate subtotal
   */
  const subtotal = cartProducts.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const totalItems = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  /*
   * Loading
   */
  if (loading || loadingProducts) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />

          <p className="text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error && cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5">
          <div className="w-full rounded-2xl border border-red-500/20 bg-[#09090b] p-8 text-center">
            <h2 className="text-2xl font-bold">Unable to load cart</h2>

            <p className="mt-3 text-gray-400">{error}</p>

            <button
              type="button"
              onClick={() => dispatch(getcart())}
              className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Empty cart
   */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* HEADER */}

        <header className="shrink-0 bg-[#09090b]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              to="/products"
              className="text-2xl font-black tracking-tight sm:text-3xl"
            >
              <span className="text-white">Shop</span>

              <span className="text-purple-500">Sphere</span>
            </Link>

            <Link
              to="/product"
              className="text-sm font-semibold text-gray-300 transition hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </header>

        {/* EMPTY CART */}

        <main className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5">
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10 text-4xl">
              🛒
            </div>

            <h1 className="mt-7 text-4xl font-black">Your Cart is Empty</h1>

            <p className="mt-4 text-gray-400">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/product"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-8 py-4 font-bold transition hover:bg-purple-500"
            >
              Start Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

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

          <Link
            to="/product"
            className="text-sm font-semibold text-gray-300 transition hover:text-white sm:text-base"
          >
            ← Continue Shopping
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* HEADING */}

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-500">
            Your Selection
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-gray-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ================= CART ITEMS ================= */}

          <section>
            <div className="space-y-4">
              {cartProducts.map((item) => {
                const product = item.product;

                const itemTotal = Number(product.price) * item.quantity;

                const isUpdating = updatingProduct === item.product_id;

                const isRemoving = removingProduct === item.product_id;

                return (
                  <div
                    key={item.product_id}
                    className="rounded-2xl border border-white/10 bg-[#09090b] p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* IMAGE */}

                      <Link
                        to={`/product/${product.id}`}
                        className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#111113] sm:h-36 sm:w-36"
                      >
                        {product.images?.[0]?.image_url ? (
                          <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-600">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* DETAILS */}

                      <div className="flex min-w-0 flex-1 flex-col">
                        {/* CATEGORY */}

                        <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
                          {product.category}
                        </p>

                        {/* NAME */}

                        <Link
                          to={`/product/${product.id}`}
                          className="mt-1 line-clamp-2 text-lg font-bold transition hover:text-purple-400 sm:text-xl"
                        >
                          {product.name}
                        </Link>

                        {/* PRICE */}

                        <p className="mt-2 text-base font-semibold text-white">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        {/* DESKTOP ACTION AREA */}

                        <div className="mt-auto hidden items-end justify-between pt-4 sm:flex">
                          {/* QUANTITY */}

                          <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
                            <button
                              type="button"
                              onClick={() =>
                                handleDecrease(item.product_id, item.quantity)
                              }
                              disabled={
                                item.quantity <= 1 || isUpdating || isRemoving
                              }
                              className="px-4 py-2 text-lg text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <span className="min-w-12 border-x border-white/10 px-4 py-2 text-center font-semibold">
                              {isUpdating ? "..." : item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleIncrease(
                                  item.product_id,
                                  item.quantity,
                                  product.stock,
                                )
                              }
                              disabled={
                                item.quantity >= product.stock ||
                                isUpdating ||
                                isRemoving
                              }
                              className="px-4 py-2 text-lg text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() => handleRemove(item.product_id)}
                            disabled={isRemoving || isUpdating}
                            className="text-sm font-medium text-red-400 transition hover:text-red-300 disabled:opacity-40"
                          >
                            {isRemoving ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>

                      {/* ITEM TOTAL */}

                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-gray-500">Total</p>

                        <p className="mt-1 text-xl font-black">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* MOBILE ACTIONS */}

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 sm:hidden">
                      {/* QUANTITY */}

                      <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecrease(item.product_id, item.quantity)
                          }
                          disabled={
                            item.quantity <= 1 || isUpdating || isRemoving
                          }
                          className="px-3 py-1.5 text-lg disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="min-w-10 border-x border-white/10 px-3 py-1.5 text-center text-sm">
                          {isUpdating ? "..." : item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleIncrease(
                              item.product_id,
                              item.quantity,
                              product.stock,
                            )
                          }
                          disabled={
                            item.quantity >= product.stock ||
                            isUpdating ||
                            isRemoving
                          }
                          className="px-3 py-1.5 text-lg disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      {/* TOTAL */}

                      <p className="font-bold">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() => handleRemove(item.product_id)}
                        disabled={isRemoving || isUpdating}
                        className="text-sm text-red-400 disabled:opacity-40"
                      >
                        {isRemoving ? "..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= ORDER SUMMARY ================= */}

          <aside>
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#09090b] p-6 sm:p-7">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              {/* ITEMS */}

              <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Items</span>

                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>

                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>

                  <span className="text-green-400">Free</span>
                </div>
              </div>

              {/* TOTAL */}

              <div className="flex items-end justify-between pt-6">
                <div>
                  <p className="text-sm text-gray-500">Total</p>

                  <p className="mt-1 text-3xl font-black">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={proceedingToCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {proceedingToCheckout ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Proceeding...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
              {/* CONTINUE */}

              <Link
                to="/product"
                className="mt-3 block text-center text-sm text-gray-400 transition hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
