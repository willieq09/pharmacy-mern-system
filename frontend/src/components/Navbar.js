import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="p-4 bg-gray-100">
      <Link to="/">Home</Link>
      <Link to="/drugs" className="ml-4">Drugs</Link>
      <Link to="/sales" className="ml-4">Sales</Link>
      {user ? (
        <button onClick={logout} className="ml-4">Logout</button>
      ) : (
        <Link to="/login" className="ml-4">Login</Link>
      )}
    </nav>
  );
}
