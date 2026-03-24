const mongoose = require("mongoose");
const User = require("../models/User"); // adjust path if needed

// Connect to MongoDB (use your real DB URL if not local)
mongoose.connect("mongodb://localhost:27017/pharmacy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createUsers() {
  const users = [
    { username: "pharmacist1", password: "password123", role: "pharmacist" },
    { username: "pharmacist2", password: "password123", role: "pharmacist" },
    { username: "manager1", password: "password123", role: "manager" },
    { username: "staff1", password: "password123", role: "staff" }
  ];

  for (let u of users) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) await User.create(u);
  }

  console.log("✅ Users created successfully!");
  mongoose.disconnect();
}

createUsers();