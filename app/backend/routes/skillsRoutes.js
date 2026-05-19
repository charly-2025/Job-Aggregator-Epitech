import express from "express";
import middleware from "../middleware/middleware.js";
import { getAllSkills } from "../controllers/skillsController.js";

const skillsRoutes = express.Router();

skillsRoutes.get("/allSkills", middleware, getAllSkills);

export default skillsRoutes;