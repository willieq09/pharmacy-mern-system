import React, { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "";

// debounce helper
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function SalesDashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [range, setRange] = useState("day"); // day, week, month

  const fetchSales = async (
    searchParam = search,
    dateParam = selectedDate,
    rangeParam = range
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (searchParam) params.append("search", searchParam);
      if (dateParam) params.append("date", dateParam);
      if (rangeParam && rangeParam !== "day") params.append("range", rangeParam);

      const res = await fetch(`${API_URL}/api/sales?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSales, 500), []);

  useEffect(() => {
    debouncedFetch(search, selectedDate, range);
  }, [search, selectedDate, range, debouncedFetch]);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.totalPrice || 0), 0);

  const chartData = sales.map((sale) => ({
    hour: new Date(sale.createdAt).getHours(),
    revenue: sale.totalPrice || 0,
  }));

  const predictedRevenue =
    sales.length >= 3
      ? Math.round(
          (sales[sales.length - 1].totalPrice +
            sales[sales.length - 2].totalPrice +
            sales[sales.length - 3].totalPrice) /
            3
        )
      : 0;

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    doc.setFontSize(12);
    if (selectedDate) doc.text(`Date: ${selectedDate}`, 14, 28);
    if (range && range !== "day") doc.text(`Range: ${range}`, 14, 36);

    // Summary totals
    doc.text(`Total Sales: ${totalSales}`, 14, 44);
    doc.text(`Total Revenue: $${totalRevenue}`, 14, 52);
    doc.text(`Predicted Next Sale Revenue: $${predictedRevenue}`, 14, 60);

    const startY = 68;
    const tableColumn = ["Drug", "Quantity", "Total Price", "Sold By", "Date"];
    const tableRows = sales.map((s) => [
      s.drug?.name || "",
      s.quantity || 0,
      `$${s.totalPrice || 0}`,
      s.soldBy?.username || "",
      new Date(s.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY,
    });

    doc.save("sales-report.pdf");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>

      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by drug or cashier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Export PDF
        </button>
      </div>

      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-500">Total Sales</p>
              <p className="text-xl font-bold">{totalSales}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">${totalRevenue}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-500">Predicted Next Sale Revenue</p>
              <p className="text-xl font-bold">${predictedRevenue}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Revenue per Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sales Records</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Drug</th>
                  <th className="border px-2 py-1">Quantity</th>
                  <th className="border px-2 py-1">Total Price</th>
                  <th className="border px-2 py-1">Sold By</th>
                  <th className="border px-2 py-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="border px-2 py-1">{sale.drug?.name}</td>
                      <td className="border px-2 py-1">{sale.quantity}</td>
                      <td className="border px-2 py-1">${sale.totalPrice}</td>
                      <td className="border px-2 py-1">{sale.soldBy?.username}</td>
                      <td className="border px-2 py-1">
                        {new Date(sale.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="border px-2 py-1 text-center">
                      No sales recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
