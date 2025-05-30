// createAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");

dotenv.config(); // Load .env

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@bazourieh.com";
    const plainPassword = "A100B200C300"; 
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log("⚠️ Admin already exists.");
    } else {
      const newAdmin = new Admin({ email, passwordHash });
      await newAdmin.save();
      console.log("✅ Admin created successfully.");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

createAdmin();
