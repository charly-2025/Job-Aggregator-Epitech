import express from "express";
import middleware from '../middleware/middleware.js';
import {
  similarOffers,
  personalizedRecommendations,
  triggerIngestion,
} from '../controllers/recommendationController.js';

const recommendationRoutes = express.Router();
//route GET to see similar offers(detail page)
recommendationRoutes.get('/similar/:offerId', middleware, similarOffers);
//route POST to see custom recommendations based on the views(dashboard)
recommendationRoutes.post('/personalized', middleware, personalizedRecommendations);
//route POST manual triggering of WeLoveDevs ingestion(admin only)
recommendationRoutes.post('/admin/ingest', middleware, triggerIngestion);

export default recommendationRoutes
