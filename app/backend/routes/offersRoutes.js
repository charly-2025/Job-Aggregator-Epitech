import express from "express";
import middleware from "../middleware/middleware.js"

import { createOffer, getAllOffers,getOffer,getOfferLike, handleOfferLike, newOfferView, searchOffers } from "../controllers/offersController.js";

const offersRoutes = express.Router()

offersRoutes.get("/allOffers",middleware,getAllOffers)
offersRoutes.get("/offer/:offerId",middleware,getOffer)
offersRoutes.get("/offerLike/:offerId",middleware,getOfferLike)
offersRoutes.get("/searchOffer/:searchText",middleware,searchOffers)

offersRoutes.post("/newOfferView/:offerId",middleware,newOfferView)
offersRoutes.post("/createOffer",middleware,createOffer)

offersRoutes.put("/handleOfferLike/:offerId",middleware,handleOfferLike)

export default offersRoutes;