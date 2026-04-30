import express from "express";
import middleware from "../middleware/middleware.js"

import { Register,Login } from "../controllers/userController.js";

const userRoutes = express.Router()

userRoutes.post("/register",Register)
userRoutes.post("/login",Login)


export default userRoutes