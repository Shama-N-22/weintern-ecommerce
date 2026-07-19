const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password by default in queries
    },
    // --- Role-Based Access Control ---
    // Rudra's Admin Panel relies on this field, keep it here for everyone.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // --- Space left for Rudra (Admin Panel) to extend later ---
    // e.g. isBanned, lastLogin, etc. Ping the group before adding fields.
  },
  { timestamps: true }
);

// Hash password before saving, only if it was modified.
// NOTE: this is an async function, so Mongoose does NOT pass a `next`
// callback — mixing async + next() is what was causing every registration
// to crash with "next is not a function". Just await and return instead.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
