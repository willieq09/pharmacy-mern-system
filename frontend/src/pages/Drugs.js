import { useEffect, useState } from "react";

const API_URL = "https://pharmacy-mern-system-eunam.onrender.com/api";

export default function Drugs() {
  const [drugs, setDrugs] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchDrugs = async () => {
    try {
      const res = await fetch(`${API_URL}/drugs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrugs(data);
    } catch {
      setMessage("Failed to fetch drugs");
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/drugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
          barcode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Save failed");
        return;
      }

      setMessage("Drug saved successfully");

      setName("");
      setPrice("");
      setStock("");
      setBarcode("");

      fetchDrugs();
    } catch {
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Drugs</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          placeholder="Drug name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          placeholder="Stock to add"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Save Drug
        </button>
      </form>

      {message && (
        <p className="mb-3 text-center text-blue-600">{message}</p>
      )}

      <ul>
        {drugs.map((drug) => (
          <li key={drug._id} className="border-b py-2">
            <strong>{drug.name}</strong> —
            Barcode: {drug.barcode || "N/A"} —
            {drug.stock} units —
            ${drug.price}
          </li>
        ))}
      </ul>
    </div>
  );
}