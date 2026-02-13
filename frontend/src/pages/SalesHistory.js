import React, { useEffect, useState } from "react";
import API from "../api";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data || []);
    } catch (err) {
      setError("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-4">Loading sales history...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
          {error}
        </div>
      )}

      {sales.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Drug</th>
                <th className="border p-2 text-right">Qty</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {sale.drug?.name || "N/A"}
                  </td>
                  <td className="border p-2 text-right">
                    {sale.quantity}
                  </td>
                  <td className="border p-2 text-right">
                    ${sale.drug?.price ?? 0}
                  </td>
                  <td className="border p-2 text-right font-semibold">
                    ${sale.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
