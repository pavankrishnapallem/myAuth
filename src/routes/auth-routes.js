// routes/auth.routes.js

import express from "express";
import { signup } from "../controllers/auth-controller.js";
import { login } from "../controllers/auth-controller.js";
import { refresh } from "../controllers/auth-controller.js";
import { logout } from "../controllers/auth-controller.js";
import { googleRedirect } from "../controllers/auth-controller.js";
import { googleCallback } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

export default router;