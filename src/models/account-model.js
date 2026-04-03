import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String, // "google", "github"
      required: true,
    },

    providerId: {
      type: String, // e.g. Google "sub"
      required: true,
    },

    email: String,
  },
  { timestamps: true }
);

// prevent duplicate provider accounts
accountSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const Account = mongoose.model("Account", accountSchema);