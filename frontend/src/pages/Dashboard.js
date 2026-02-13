// 📄 frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [drugs, setDrugs] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesPerDrug, setSalesPerDrug] = useState([]);
  const [revenuePerHour, setRevenuePerHour] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [drugsRes, salesRes] = await Promise.all([
          API.get("/drugs", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/sales", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDrugs(drugsRes.data);
        setSales(salesRes.data);
        processCharts(salesRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    const processCharts = (salesData) => {
      // Sales per drug
      const perDrug = {};
      salesData.forEach((s) => {
        const name = s.drug.name;
        if (!perDrug[name]) perDrug[name] = 0;
        perDrug[name] += s.quantity;
      });
      setSalesPerDrug(
        Object.keys(perDrug).map((k) => ({ name: k, quantity: perDrug[k] }))
      );

      // Revenue per hour (today)
      const today = new Date().toISOString().slice(0, 10);
      const perHour = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        revenue: 0,
      }));
      salesData.forEach((s) => {
        if (s.createdAt.slice(0, 10) === today) {
          const hour = new Date(s.createdAt).getHours();
          perHour[hour].revenue += s.totalPrice;
        }
      });
      setRevenuePerHour(perHour);
    };

    fetchData();
  }, [token]);

  // Calculate totals
  const totalSales = sales.reduce((acc, s) => acc + s.quantity, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const lowStockDrugs = drugs.filter((d) => d.stock <= 10);

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-500 text-white rounded shadow">
          <h3 className="font-semibold">Total Sales (units)</h3>
          <p className="text-2xl">{totalSales}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded shadow">
          <h3 className="font-semibold">Total Revenue ($)</h3>
          <p className="text-2xl">{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-red-500 text-white rounded shadow">
          <h3 className="font-semibold">Low Stock Drugs</h3>
          {lowStockDrugs.length === 0 ? (
            <p>All drugs sufficiently stocked</p>
          ) : (
            <ul>
              {lowStockDrugs.map((d) => (
                <li key={d._id}>
                  {d.name} — {d.stock} units
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Sales Per Drug</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesPerDrug}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Revenue Per Hour (Today)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenuePerHour}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
