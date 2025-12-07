import { NavLink, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        // আর btn না, normal link style
        "inline-flex items-center px-3 py-2 text-sm md:text-base font-semibold",
        "text-black dark:text-white",
        "transition-all duration-150",
        "hover:bg-base-200/80 dark:hover:bg-base-200/20 hover:scale-[1.03] rounded-md",
        isActive ? "border-b-2 border-primary rounded-none" : "",
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="navbar bg-base-100 border-b sticky top-0 z-20">
      <div className="container mx-auto px-3 flex items-center gap-3">
        {/* Left: Brand (btn-ghost বাদ) */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-black dark:text-white hover:opacity-90 transition-all duration-150"
        >
          <span className="text-2xl">🐾</span>
          <span>PawMart</span>
        </Link>

        {/* Middle: Menu */}
        <nav className="ml-auto hidden md:flex items-center gap-2">
          <Item to="/">Home</Item>
          <Item to="/supplies">Pets &amp; Supplies</Item>

          {user && (
            <>
              <Item to="/add-listing">Add Listing</Item>
              <Item to="/my-listings">My Listings</Item>
              <Item to="/my-orders">My Orders</Item>
            </>
          )}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Right: Auth actions */}
          {loading ? (
            <span className="loading loading-spinner loading-sm ml-2" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-base-200 dark:bg-base-200/20  cursor-pointer hover:bg-base-300/80 dark:hover:bg-base-200/40 transition-all"
              >
                <div className="avatar placeholder">
                  <div className="bg-base-200 text-black dark:bg-neutral  rounded-full w-8 flex items-center justify-center">
                    <span className="text-sm">
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                </div>
                <span className="ml-1 hidden lg:inline font-semibold">
                  {user.displayName || user.email}
                </span>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-56 p-2 "
              >
                <li className="menu-title">
                  <span className="truncate">
                    {user.displayName || user.email}
                  </span>
                </li>
                <li>
                  <Link
                    to="/my-orders"
                    className="hover:bg-base-200/80 dark:hover:bg-base-200/20 rounded-lg"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-error hover:bg-error/10 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-primary font-semibold  hover:scale-[1.03] transition-transform duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-outline font-semibold  hover:scale-[1.03] transition-transform duration-150"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden ml-auto">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="  hover:bg-base-200/70 dark:hover:bg-base-200/20 transition-all duration-150"
            >
              ☰
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-56 p-2"
            >
              <li>
                <Item to="/">Home</Item>
              </li>
              <li>
                <Item to="/supplies">Pets &amp; Supplies</Item>
              </li>

              {user && (
                <>
                  <li>
                    <Item to="/add-listing">Add Listing</Item>
                  </li>
                  <li >
                    <Item to="/my-listings">My Listings</Item>
                  </li>
                  <li>
                    <Item to="/my-orders">My Orders</Item>
                  </li>
                </>
              )}

              <li className="px-4 py-2">
                <ThemeToggle />
              </li>

              {loading ? (
                <li className="px-4 py-2">
                  <span className="loading loading-spinner loading-sm" />
                </li>
              ) : user ? (
                <>
                  <li className="menu-title">
                    <span className="truncate">
                      {user.displayName || user.email}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="text-error hover:bg-error/10 rounded-lg"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="btn btn-primary w-full font-semibold text-black dark:text-white hover:scale-[1.03] transition-transform duration-150"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn btn-outline w-full font-semibold text-black dark:text-white hover:scale-[1.03] transition-transform duration-150"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
