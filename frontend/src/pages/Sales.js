import { useEffect, useState } from "react";

const API_URL = "https://pharmacy-mern-system-eunam.onrender.com/api"; 
// Replace with your live backend URL

export default function Sales() {
  const [drugs, setDrugs] = useState([]);
  const [drugId, setDrugId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch drugs from backend
  useEffect(() => {
    if (!token) return;

    const fetchDrugs = async () => {
      try {
        const res = await fetch(`${API_URL}/drugs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch drugs");

        setDrugs(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load drugs");
      }
    };

    fetchDrugs();
  }, [token]);

  // Submit a sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const selectedDrug = drugs.find((d) => d._id === drugId);
      if (!selectedDrug) {
        setMessage("Please select a valid drug");
        setLoading(false);
        return;
      }

      const payload = {
        drug: drugId, // Must match backend field
        quantity: Number(quantity),
        totalPrice: Number(quantity) * Number(selectedDrug.price),
      };

      const res = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sale failed");

      setMessage("✅ Sale completed successfully");
      setQuantity(1);
      setDrugId("");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">New Sale</h2>

      {message && (
        <p className="mb-4 text-sm text-center text-red-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drug dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Drug</label>
          <select
            value={drugId}
            onChange={(e) => setDrugId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Select Drug --</option>
            {drugs.map((drug) => (
              <option key={drug._id} value={drug._id}>
                {drug.name} — Stock: {drug.stock} — ${drug.price}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Complete Sale"}
        </button>
      </form>
    </div>
  );
}
