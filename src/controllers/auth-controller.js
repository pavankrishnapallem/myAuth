// controllers/auth.controller.js

import * as authService from "../services/auth-service.js";
import * as tokenService from "../services/token-service.js";

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await authService.signup(email, password);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await authService.login(email, password);

    const accessToken = tokenService.generateAccessToken({
      userId: user._id,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: user._id,
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // set false if testing locally
      })
      .json({
        accessToken,
        user: {
          _id: user._id,
          email: user.email,
        },
      });

  } catch (err) {
    next(err);
  }
};