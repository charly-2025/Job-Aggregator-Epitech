import express from "express";
import middleware from "../middleware/middleware.js"

import {getUserInfo,getOffersUserLikes,getOffersUserViews, updateUserInfo, updateUserPassword } from "../controllers/userController.js";

const userRoutes = express.Router()

userRoutes.get("/userInfo",middleware,getUserInfo)
userRoutes.get("/offersUserLike",middleware,getOffersUserLikes)
userRoutes.get("/offersUserViews",middleware,getOffersUserViews)

userRoutes.put("/userInfo",middleware,updateUserInfo)
userRoutes.put("/userPassword",middleware,updateUserPassword)


export default userRoutes