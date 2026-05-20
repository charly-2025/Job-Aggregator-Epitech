import express from "express";
import middleware from "../middleware/middleware.js";

import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOffer,
  getOfferLike,
  handleOfferLike,
  newOfferView,
  searchOffers,
  updateOffer,
  getLast24hOffers
} from "../controllers/offersController.js";

const offersRoutes = express.Router();

offersRoutes.get("/allOffers", middleware, getAllOffers);
offersRoutes.get("/offer/:offerId", middleware, getOffer);
offersRoutes.get("/offerLike/:offerId", middleware, getOfferLike);
offersRoutes.get("/search/:searchText", middleware, searchOffers);
offersRoutes.get("/last24hOffers", middleware, getLast24hOffers);

offersRoutes.post("/newOfferView/:offerId", middleware, newOfferView);
offersRoutes.post("/createOffer", middleware, createOffer);

offersRoutes.put("/handleOfferLike/:offerId", middleware, handleOfferLike);
offersRoutes.put("/updateOffer/:offerId", middleware, updateOffer);

offersRoutes.delete("/deleteOffer/:offerId", middleware, deleteOffer);

export default offersRoutes;
