import { NavLink, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth"
import ThemeToggle from "../ui/ThemeToggle";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "inline-flex items-center px-3 py-2 text-sm md:text-base font-semibold",
        "transition-all duration-150 rounded-md",
        "hover:bg-base-200/80 dark:hover:bg-base-200/20 hover:scale-[1.03]",
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
    <header className="navbar bg-base-100 border-b sticky top-0 z-20 w-full">
      <div className="container mx-auto px-3 flex items-center gap-3">
        {/* Brand */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold hover:opacity-90 transition-all duration-150"
        >
          <span className="text-2xl">🐾</span>
          <span>PawMart</span>
        </Link>

        {/* Desktop menu */}
        <nav className="ml-auto hidden md:flex items-center gap-2">
          <Item to="/">Home</Item>
          <Item to="/explore">Explore</Item>
          <Item to="/about">About</Item>
          <Item to="/contact">Contact</Item>

          {user && (
            <>
              {/* Protected routes after login */}
              <Item to="/dashboard">Dashboard</Item>
            </>
          )}

          <ThemeToggle />

          {loading ? (
            <span className="loading loading-spinner loading-sm ml-2" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-base-200 dark:bg-base-200/20 cursor-pointer hover:bg-base-300/80 dark:hover:bg-base-200/40 transition-all"
              >
                <div className="avatar placeholder">
                  <div className="bg-base-300 rounded-full w-8 flex items-center justify-center">
                    <span className="text-sm">
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                </div>
                <span className="ml-1 hidden lg:inline font-semibold truncate max-w-[220px]">
                  {user.displayName || user.email}
                </span>
              </div>

              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-60 p-2 border border-base-200"
              >
                <li className="menu-title">
                  <span className="truncate">
                    {user.displayName || user.email}
                  </span>
                </li>
                <li>
                  <Link to="/dashboard" className="rounded-lg">
                    Dashboard Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="rounded-lg">
                    Profile
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
              <Link to="/login" className="btn btn-primary font-semibold">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline font-semibold">
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
              className="px-3 py-2 rounded-md hover:bg-base-200/70 dark:hover:bg-base-200/20 transition-all"
              aria-label="Open menu"
            >
              ☰
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-64 p-2 border border-base-200"
            >
              <li>
                <Item to="/">Home</Item>
              </li>
              <li>
                <Item to="/supplies">Explore</Item>
              </li>
              <li>
                <Item to="/about">About</Item>
              </li>
              <li>
                <Item to="/contact">Contact</Item>
              </li>

              {user && (
                <li>
                  <Item to="/dashboard">Dashboard</Item>
                </li>
              )}

              <li className="px-3 py-2">
                <ThemeToggle />
              </li>

              {loading ? (
                <li className="px-4 py-2">
                  <span className="loading loading-spinner loading-sm" />
                </li>
              ) : user ? (
                <li>
                  <button
                    onClick={logout}
                    className="text-error hover:bg-error/10 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="btn btn-primary w-full font-semibold"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn btn-outline w-full font-semibold"
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
