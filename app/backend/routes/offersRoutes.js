import express from "express";
import middleware from "../middleware/middleware.js"

import { getAllOffers,getOffer,getOfferLike } from "../controllers/offersController.js";

const offersRoutes = express.Router()


offersRoutes.get("/allOffers",middleware,getAllOffers)
offersRoutes.get("/offer/:offerId",middleware,getOffer)
offersRoutes.get("/offerLike/:offerId",middleware,getOfferLike)

export default offersRoutes;