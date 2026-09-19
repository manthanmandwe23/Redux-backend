import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getProductById } from "../../features/products/product_slice";
import { createOrder } from "../../features/orders/order_slice";
import { getcart } from "../../features/cart/cart_slice";

interface CheckoutProduct {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  quantity: number;
}

export const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart } = useAppSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError } = useAppSelector(
    (state) => state.order,
  );

  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    dispatch(getcart());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (cart.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);

        const results = await Promise.all(
          cart.map(async (item) => {
            const product = await dispatch(
              getProductById({
                product_id: item.product_id,
              }),
            ).unwrap();

            return {
              product_id: item.product_id,
              name: product.name,
              description: product.description,
              price: Number(product.price),
              stock: Number(product.stock),
              category: product.category,
              image_url: product.images?.[0]?.image_url || "",
              quantity: item.quantity,
            };
          }),
        );

        setProducts(results);
      } catch (error) {
        console.error("Failed to fetch checkout products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [cart, dispatch]);

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);

      await dispatch(createOrder()).unwrap();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      setPlacingOrder(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading checkout...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mb-8 text-sm text-purple-400 transition hover:text-purple-300"
          >
            ← Continue Shopping
          </button>

          <div className="rounded-2xl border border-white/10 bg-[#09090b] p-10 text-center">
            <h1 className="text-2xl font-bold">Your cart is empty</h1>

            <p className="mt-2 text-gray-400">
              Add some products before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/product")}
              className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-4 text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to Cart
          </button>

          <h1 className="text-3xl font-bold sm:text-4xl">Checkout</h1>

          <p className="mt-2 text-gray-400">
            Review your order before placing it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Order Items */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order Items</h2>

              <span className="text-sm text-gray-400">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#09090b] p-4"
                >
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black sm:h-28 sm:w-28">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <h3 className="truncate text-base font-semibold sm:text-lg">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-purple-400">
                          {item.category}
                        </p>
                      </div>

                      <p className="text-lg font-semibold">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Quantity:{" "}
                        <span className="font-medium text-white">
                          {item.quantity}
                        </span>
                      </span>

                      <span className="font-semibold text-white">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#09090b] p-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>

                    <span className="text-2xl font-bold text-purple-400">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {orderError && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {orderError}
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || products.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Your cart will be cleared after the order is successfully
                placed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
