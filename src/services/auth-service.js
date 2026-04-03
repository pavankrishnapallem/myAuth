// services/auth.service.js

import { User } from "../models/user-model.js";

export const signup = async (email, password) => {
  // 1. check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. create user (password hashing happens via pre-save hook)
  const user = await User.create({
    email,
    password,
    providers: ["email"],
  });

  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};