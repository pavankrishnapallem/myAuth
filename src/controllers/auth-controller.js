// controllers/auth.controller.js

import * as authService from "../services/auth-service.js";
import * as oauthService from "../services/oauth-service.js"
import * as tokenService from "../services/token-service.js";
import * as sessionService from "../services/session-service.js";
import { User } from "../models/user-model.js";
import { Account } from "../models/account-model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await authService.signup(email, password);

    await Account.create({
      userId: user._id,
      provider: "gmail",
      providerId: email,
      email: email,
    })

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
    
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await sessionService.createSession({
        userId: user._id,
        refreshToken,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        expiresAt,
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

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // 1. verify token
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // 2. find session
    const session = await sessionService.findSessionByToken(token);

    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    // 3. generate new tokens
    const newAccessToken = tokenService.generateAccessToken({
      userId: payload.userId,
    });

    const newRefreshToken = tokenService.generateRefreshToken({
      userId: payload.userId,
    });

    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 4. rotate refresh token
    await sessionService.updateSessionToken(
      session._id,
      newRefreshToken,
      newExpiry
    );

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
      })
      .json({ accessToken: newAccessToken });

  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const session = await sessionService.findSessionByToken(token);

    if (session) {
      await sessionService.deleteSession(session._id);
    }
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    const googleUser = await oauthService.getGoogleUser(code);

    const { sub, email, name } = googleUser;

    // 1. check account
    let account = await Account.findOne({
      provider: "google",
      providerId: sub,
    });

    let user;

    if (account) {
      user = await User.findById(account.userId);
    } else {
      // check if user exists by email
      user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({
             message: "User not found. Please register first.",
          });
        }
      }

      // link account
      await Account.create({
        userId: user._id,
        provider: "google",
        providerId: sub,
        email,
      });

    // create session (same as login)
    const accessToken = tokenService.generateAccessToken({
      userId: user._id,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: user._id,
    });

    await sessionService.createSession({
      userId: user._id,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.json({ accessToken, user });

  } catch (err) {
    next(err);
  }
};

export const googleRedirect = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;

  res.redirect(url);
};