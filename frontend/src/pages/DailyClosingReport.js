import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DailyClosingReport = () => {
  const [sales, setSales] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, [date]);

  const fetchSales = async () => {
    try {
      setError(null);

      const response = await fetch(
        `/api/sales?date=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }

      const data = await response.json();
      setSales(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load sales data");
    }
  };

  // 🔢 Totals
  const totals = sales.reduce(
    (acc, sale) => {
      acc.revenue += sale.totalPrice || 0;
      acc.cost += sale.totalCost || 0;
      acc.count += 1;
      return acc;
    },
    { revenue: 0, cost: 0, count: 0 }
  );

  const profit = totals.revenue - totals.cost;

  // 📦 Group by Drug
  const drugSummary = {};
  sales.forEach((sale) => {
    (sale.items || []).forEach((item) => {
      if (!drugSummary[item.name]) {
        drugSummary[item.name] = {
          quantity: 0,
          revenue: 0,
        };
      }
      drugSummary[item.name].quantity += item.quantity;
      drugSummary[item.name].revenue +=
        item.quantity * item.price;
    });
  });

  // 🖨️ Export PDF
  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Daily_Closing_Report_${date}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <h1 className="text-2xl font-bold">
          Daily Closing Report
        </h1>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Search drug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export PDF
        </button>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Report */}
      <div
        ref={reportRef}
        className="bg-white p-6 rounded shadow print:shadow-none"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Eunam Pharmacy
          </h2>
          <p className="text-gray-600">
            Date: <strong>{date}</strong>
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Total Sales" value={totals.count} />
          <SummaryCard
            title="Revenue"
            value={`KES ${totals.revenue.toLocaleString()}`}
          />
          <SummaryCard
            title="Cost"
            value={`KES ${totals.cost.toLocaleString()}`}
          />
          <SummaryCard
            title="Profit"
            value={`KES ${profit.toLocaleString()}`}
          />
        </div>

        {/* Table */}
        <h3 className="font-semibold mb-2">Sales by Drug</h3>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Drug</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Revenue (KES)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(drugSummary)
              .filter(([name]) =>
                name.toLowerCase().includes(search.toLowerCase())
              )
              .map(([name, data]) => (
                <tr key={name}>
                  <td className="border p-2">{name}</td>
                  <td className="border p-2 text-center">
                    {data.quantity}
                  </td>
                  <td className="border p-2 text-right">
                    {data.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="mt-8 text-sm text-gray-600">
          Generated on{" "}
          {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded text-center">
    <div className="text-gray-600 text-sm">{title}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

export default DailyClosingReport;
