import { Link } from "react-router";
import { PlusIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
              <img
                src="./logo-notezy.png"
                alt="Notezy Logo"
                className="h-14 w-auto inline-block"
              />
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/create" className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
            
            {user && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  {user.avatar ? (
                    <div className="w-10 rounded-full">
                      <img
                        alt={user.name}
                        src={user.avatar}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <UserIcon className="size-6" />
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li className="menu-title">
                    <span className="text-xs text-gray-500">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user.email}
                    </span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={logout} className="text-error">
                      <LogOutIcon className="size-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;