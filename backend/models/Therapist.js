const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
  {
    // Basic account information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password_hash: {
      type: String,
      required: true,
      select: false,
    },

    // Professional profile
    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // Unique public profile URL identifier
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Therapist", therapistSchema);