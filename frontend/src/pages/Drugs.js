import { useEffect, useState } from "react";

const API_URL = "https://pharmacy-mern-system-eunam.onrender.com/api";

export default function Drugs() {
  const [drugs, setDrugs] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // "success" or "error"
  const [editDrug, setEditDrug] = useState(null); // For modal edit

  const token = localStorage.getItem("token");

  // Fetch all drugs
  const fetchDrugs = async () => {
    try {
      const res = await fetch(`${API_URL}/drugs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrugs(data);
    } catch (err) {
      console.error("FETCH DRUGS ERROR:", err);
      showMessage("Failed to load drugs", "error");
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  // Show inline message
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  // Add or update drug
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !stock) return;

    try {
      const payload = { name, price: Number(price), stock: Number(stock) };
      const res = await fetch(`${API_URL}/drugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save drug");

      showMessage(data.message || "Drug saved successfully");
      setName("");
      setPrice("");
      setStock("");
      fetchDrugs(); // refresh list
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    }
  };

  // Open edit modal
  const openEdit = (drug) => {
    setEditDrug(drug);
    setPrice(drug.price);
    setStock(0); // Adding new stock
  };

  // Update stock & price
  const handleUpdate = async () => {
    try {
      if (!editDrug || price === "" || stock === "") return;
      const payload = {
        drugId: editDrug._id,
        price: Number(price),
        stock: Number(stock),
      };
      const res = await fetch(`${API_URL}/drugs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      showMessage(data.message || "Drug updated successfully");
      setEditDrug(null);
      setPrice("");
      setStock("");
      fetchDrugs();
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Drugs</h2>

      {/* Add new drug form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          placeholder="Drug name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Drug
        </button>
      </form>

      {/* Inline message */}
      {message && (
        <div
          className={`mb-4 text-center p-2 rounded ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Drug list */}
      <ul className="space-y-2">
        {drugs.map((drug) => (
          <li
            key={drug._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>
              {drug.name} — {drug.stock} units — ${drug.price}
            </span>
            <button
              onClick={() => openEdit(drug)}
              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Add Stock / Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Edit modal */}
      {editDrug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-80">
            <h3 className="text-xl font-bold mb-3">
              Update {editDrug.name}
            </h3>
            <input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <input
              placeholder="Add Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => setEditDrug(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}