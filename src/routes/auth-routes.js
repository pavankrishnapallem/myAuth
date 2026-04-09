// routes/auth.routes.js

import express from "express";
import { googleSignUp, signup } from "../controllers/auth-controller.js";
import { login } from "../controllers/auth-controller.js";
import { refresh } from "../controllers/auth-controller.js";
import { logout } from "../controllers/auth-controller.js";
import { googleRedirect } from "../controllers/auth-controller.js";
import { googleLogin } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/google", googleRedirect);
router.get("/google/login", googleLogin);
router.get("/google/signup", googleSignUp);

export default router;