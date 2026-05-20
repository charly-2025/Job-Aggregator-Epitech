import express from "express";
import middleware from "../middleware/middleware.js";
import {
  getAllSkills,
  getTop10Skills,
} from "../controllers/skillsController.js";

const skillsRoutes = express.Router();

skillsRoutes.get("/allSkills", middleware, getAllSkills);
skillsRoutes.get("/top10Skills", middleware, getTop10Skills);

export default skillsRoutes;
