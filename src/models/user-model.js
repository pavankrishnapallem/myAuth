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

//export const User = mongoose.model("User", userSchema);


userSchema.pre("save", async function() {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    //next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
  if(!this.password) return false;  
  return await bcrypt.compare(password,this.password);
}

// userSchema.methods.generateAccessToken = function() {
//     jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,  
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
//     );
// };


// userSchema.methods.generateRefreshToken = function() {
//     jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,  
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
//     );
// };

// userSchema.methods.generateTemporaryToken = function() {
//     const unHashedToken = crypto.randomBytes(20).toString("hex")

//     const hashedToken = crypto
//         .createHash("sha256")
//         .update(unHashedToken)
//         .digest("hex")

//     const tokenExpiry = Date.now() + (20*60*1000) //20 mins
//     return {unHashedToken, hashedToken, tokenExpiry}
// }

export const User = mongoose.model("User",userSchema);

