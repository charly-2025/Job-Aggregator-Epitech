import express from "express";
import middleware from "../middleware/middleware.js";

import {
  getUserInfo,
  getOffersUserLikes,
  getOffersUserViews,
  updateUserInfo,
  updateUserPassword,
  deleteUser
} from "../controllers/usersController.js";

const usersRoutes = express.Router();


usersRoutes.get("/userInfo", middleware, getUserInfo);
usersRoutes.get("/offersUserLikes", middleware, getOffersUserLikes);
usersRoutes.get("/offersUserViews", middleware, getOffersUserViews);

usersRoutes.put("/userInfo", middleware, updateUserInfo);
usersRoutes.put("/userPassword", middleware, updateUserPassword);

usersRoutes.delete("/deleteUser", middleware, deleteUser);

export default usersRoutes;