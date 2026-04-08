import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
//import Session from "./session-model.js";



const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false, // never return by default
    },

    providers: [
      {
        type: String, // "email", "google", etc.
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    profile: {
      name: String,
      avatar: String,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function() {
    if (!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);
    //next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
  if(!this.password) return false;  
  return await bcrypt.compare(password,this.password);
}


export const User = mongoose.model("User",userSchema);

