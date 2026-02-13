// 📄 frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Drugs from "./pages/Drugs";
import Sales from "./pages/Sales";
import SalesDashboard from "./pages/SalesDashboard";
// import Prescriptions from "./pages/Prescriptions"; // enable later

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Dashboard — accessible to any logged-in user */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Login — public */}
          <Route path="/login" element={<Login />} />

          {/* Drugs — Admin & Pharmacist */}
          <Route
            path="/drugs"
            element={
              <ProtectedRoute roles={["admin", "pharmacist"]}>
                <Drugs />
              </ProtectedRoute>
            }
          />

          {/* Sales — Admin, Pharmacist, Cashier */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute roles={["admin", "pharmacist", "cashier"]}>
                <Sales />
              </ProtectedRoute>
            }
          />

          {/* Sales Dashboard — Admin & Pharmacist */}
          <Route
            path="/sales-dashboard"
            element={
              <ProtectedRoute roles={["admin", "pharmacist"]}>
                <SalesDashboard />
              </ProtectedRoute>
            }
          />

          {/* Prescriptions — Pharmacist ONLY (enable later)
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute roles={["pharmacist"]}>
                <Prescriptions />
              </ProtectedRoute>
            }
          />
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
