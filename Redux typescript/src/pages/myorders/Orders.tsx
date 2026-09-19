import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  cancelOrder,
  deleteOrder,
  getMyOrders,
} from "../../features/orders/order_slice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

export const MyOrders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleCancelOrder = async (order_id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      await dispatch(cancelOrder({ order_id })).unwrap();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleDeleteOrder = async (order_id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cancelled order?",
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteOrder({ order_id })).unwrap();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "confirmed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "shipped":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />

          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  /*
   * Backend currently returns 404 when there are no orders.
   * Treat that as an empty order state.
   */
  const isEmpty = orders.length === 0 && error === "order not found";

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

          <div className="flex items-center gap-5 sm:gap-8">
            <Link
              to="/product"
              className="text-sm text-gray-300 transition hover:text-white sm:text-base"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="text-sm text-gray-300 transition hover:text-white sm:text-base"
            >
              🛒 Cart
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        {/* HEADING */}

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-500">
            Purchase History
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-gray-400">Track and manage your orders.</p>
        </div>

        {/* ================= ERROR ================= */}

        {error && !isEmpty && orders.length === 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => dispatch(getMyOrders())}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {isEmpty && (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-[#09090b] px-5">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10 text-3xl">
                📦
              </div>

              <h2 className="mt-6 text-2xl font-bold">No Orders Yet</h2>

              <p className="mt-3 text-gray-400">
                You haven't placed any orders yet.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-block rounded-xl bg-purple-600 px-7 py-3 font-semibold transition hover:bg-purple-500"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* ================= ORDERS ================= */}

        {orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => {
              const canCancel =
                order.status === "pending" || order.status === "confirmed";

              return (
                <div
                  key={order.order_id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] transition hover:border-white/20"
                >
                  {/* TOP */}

                  <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-mono text-sm font-semibold text-white sm:text-base">
                        {order.order_id}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500">Ordered on</p>

                        <p className="mt-1 text-sm font-medium text-gray-300">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* ORDER DETAILS */}

                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                      {/* TOTAL */}

                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>

                        <p className="mt-1 text-xl font-black sm:text-2xl">
                          ₹{Number(order.total_amount).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div>
                        <p className="text-xs text-gray-500">Status</p>

                        <p className="mt-1 text-sm font-semibold capitalize text-gray-200">
                          {order.status}
                        </p>
                      </div>

                      {/* UPDATED */}

                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>

                        <p className="mt-1 text-sm font-semibold text-gray-200">
                          {formatDate(order.updated_at)}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                     
                      {order.status === "cancelled" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.order_id)}
                          className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      )}

                      {canCancel && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {loading ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
