import express from "express";
import rateLimit from "express-rate-limit";

import { Register, Login, Logout,refreshToken } from "../controllers/authController.js";

const authRoutes = express.Router();

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,

  message: {
    error: "Too many login attempts. Try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,

  message: {
    error: "Too many registration attempts. Try again later."
  } 
});

authRoutes.post("/register", registerLimiter, Register);
authRoutes.post("/login", loginLimiter, Login);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", Logout);

export default authRoutes;
