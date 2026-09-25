import { useState, type JSX } from "react";
import { Home, FileText, Folder, Trash2, Activity, Search, LogOut, UserRound, Camera } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, clearUser } from "../lib/auth";
import { request } from "../api";

interface NavItem {
  name: string;
  icon: JSX.Element;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Home", icon: <Home size={20} />, path: "/home" },
  { name: "Notes", icon: <FileText size={20} />, path: "/notes" },
  { name: "Folders", icon: <Folder size={20} />, path: "/folders" },
  { name: "Trash", icon: <Trash2 size={20} />, path: "/trash" },
  { name: "Activity Log", icon: <Activity size={20} />, path: "/activity" },
];

export default function Navbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await request("/logout", { method: "POST" });
    clearUser();
    navigate("/login");
    setLoggingOut(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="p-2 md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 flex flex-col transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="inline-block size-5">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            SafeVault
          </h1>

          <form onSubmit={handleSearch} className="mt-4 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes & folders..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pl-9 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </form>
        </div>

        <nav className="flex-1 space-y-2 px-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-700 text-gray-200"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}

          <NavLink
            to="/facesave"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            <Camera size={20} />
            <span>My Face</span>
          </NavLink>
        </nav>

        <div className="border-t border-gray-700 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-indigo-600 flex items-center justify-center">
              <UserRound size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">
                {user?.hasFace ? "Face registered" : "No face registered"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <main className="flex-1 md:pl-64 p-4">{children}</main>
    </>
  );
}