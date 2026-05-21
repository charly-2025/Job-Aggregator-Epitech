import express from "express";
import middleware from "../middleware/middleware.js";
import {
  similarOffers,
  personalizedRecommendations,
  recommendationsBySkills,
} from "../controllers/recommendationController.js";

const recommendationRoutes = express.Router();
//route GET to see similar offers(detail page)
recommendationRoutes.get("/similar/:offerId", middleware, similarOffers);
//route POST to see custom recommendations based on the views(dashboard)
recommendationRoutes.post(
  "/personalized",
  middleware,
  personalizedRecommendations,
);
recommendationRoutes.get('/by-skills', middleware, recommendationsBySkills);

export default recommendationRoutes;
