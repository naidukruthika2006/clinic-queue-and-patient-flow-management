const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "patient", enum: ["doctor", "staff", "patient", "admin"] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
