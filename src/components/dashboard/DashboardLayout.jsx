import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl transition ${
      isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
    }`;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Topbar */}
      <div className="sticky top-0 z-30 border-b border-base-300 bg-base-100/80 backdrop-blur">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Dashboard</span>
            <span className="text-xs opacity-70 hidden sm:block">
              {user?.email}
            </span>
          </div>

          {/* Profile dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost rounded-full">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      alt="profile"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="hidden sm:block font-semibold">
                  {user?.displayName || "User"}
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 border border-base-300 rounded-2xl w-52"
            >
              <li>
                <NavLink to="/dashboard" end>
                  Dashboard Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/profile">Profile</NavLink>
              </li>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="container mx-auto px-3 py-6 grid gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-3">
            <p className="text-xs uppercase opacity-70 px-3 py-2">Menu</p>
            <nav className="flex flex-col gap-2">
              <NavLink className={navClass} to="/dashboard" end>
                📊 Overview
              </NavLink>
              <NavLink className={navClass} to="/dashboard/my-listings">
                🧾 My Listings
              </NavLink>
              <NavLink className={navClass} to="/dashboard/my-orders">
                🛒 My Orders
              </NavLink>
              <NavLink className={navClass} to="/add-listing">
                ➕ Add Listing
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
