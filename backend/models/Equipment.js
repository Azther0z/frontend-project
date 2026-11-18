const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add an equipment name"], trim: true, unique: true },
    category: { type: String, required: [true, "Please add a category"], trim: true },
    description: { type: String, required: [true, "Please add a description"], trim: true },
    quantity: {
      type: Number,
      required: [true, "Please add an available quantity"],
      min: [0, "Quantity cannot be negative"],
      validate: { validator: Number.isInteger, message: "Quantity must be an integer" },
    },
    rentalRate: { type: Number, required: [true, "Please add a rental rate"], min: [0, "Rental rate cannot be negative"] },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
      maxLength: [2048, "Image URL must be at most 2048 characters"],
      validate: {
        validator(value) {
          if (value === "") return true;
          try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
          } catch { return false; }
        },
        message: "Image URL must be a complete HTTP or HTTPS URL without embedded credentials",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", EquipmentSchema);
