import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // axios instance or fetch wrapper
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { username, password });

      // ✅ 1. Save JWT token for authenticated requests
      localStorage.setItem("token", res.data.token);

      // ✅ 2. Save user info (username & role) for role-based access
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ 3. Update React Context
      setUser(res.data.user);

      // ✅ 4. Redirect user based on role (optional)
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/sales-dashboard"); // pharmacist/staff route
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed, please try again");
    }
  };

  return (
    <div className="login-container p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}