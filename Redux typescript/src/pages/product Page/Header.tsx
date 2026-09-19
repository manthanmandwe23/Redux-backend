import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/auth_slice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const Header = ({ search, setSearch }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.user);
  const cart = useAppSelector((state) => state.cart.cart);

  const [showProfile, setShowProfile] = useState(false);
  const [showCartBadge, setShowCartBadge] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Show cart badge for 60 seconds when cart changes
  useEffect(() => {
    if (cart.length === 0) {
      setShowCartBadge(false);
      return;
    }

    setShowCartBadge(true);

    const timer = setTimeout(() => {
      setShowCartBadge(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [cart]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="shrink-0 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            to="/products"
            className="shrink-0 text-2xl font-black tracking-tight sm:text-3xl"
          >
            <span className="text-white">Shop</span>
            <span className="text-purple-500">Sphere</span>
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden flex-1 md:block md:max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-purple-600/80 bg-white/[0.03] px-5 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>

          {/* RIGHT NAVIGATION */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-7">
            {/* CART */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-base text-gray-200 transition hover:text-white sm:text-lg"
            >
              <span className="text-xl">🛒</span>
              <span>Cart</span>

              {showCartBadge && cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ORDERS */}
            <Link
              to="/orders"
              className="flex items-center gap-2 text-base text-gray-200 transition hover:text-white sm:text-lg"
            >
              <span className="text-xl">📦</span>
              <span>My Orders</span>
            </Link>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
                className="flex items-center gap-2"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-purple-500 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span className="hidden text-sm text-gray-300 lg:block">
                  {user?.username || "User"}
                </span>

                <span className="text-gray-300">▼</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.username || "User"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user?.email || ""}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-4 md:hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-purple-600/80 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
          />
        </div>
      </div>
    </header>
  );
};
