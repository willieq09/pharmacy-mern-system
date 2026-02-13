// 📄 frontend/src/components/Navbar.js
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {/* Drugs — Admin & Pharmacist */}
        {user && ["admin", "pharmacist"].includes(user.role) && (
          <Link to="/drugs" className="hover:underline">
            Drugs
          </Link>
        )}

        {/* Sales — Admin, Pharmacist, Cashier */}
        {user && ["admin", "pharmacist", "cashier"].includes(user.role) && (
          <Link to="/sales" className="hover:underline">
            Sales
          </Link>
        )}

        {/* Sales Dashboard — Admin & Pharmacist */}
        {user && ["admin", "pharmacist"].includes(user.role) && (
          <Link to="/sales-dashboard" className="hover:underline">
            Sales Dashboard
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
