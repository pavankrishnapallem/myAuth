// services/session.service.js

import { Session } from "../models/session-model.js";

export const createSession = async ({
  userId,
  refreshToken,
  userAgent,
  ip,
  expiresAt,
}) => {
  return await Session.create({
    userId,
    refreshToken,
    userAgent,
    ip,
    expiresAt,
  });
};

export const findSessionByToken = async (refreshToken) => {
  return await Session.findOne({ refreshToken });
};

export const updateSessionToken = async (sessionId, newToken, expiresAt) => {
  return await Session.findByIdAndUpdate(sessionId, {
    refreshToken: newToken,
    expiresAt,
  });
};

export const deleteSession = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};