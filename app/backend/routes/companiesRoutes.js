import express from "express"
import middleware from "../middleware/middleware.js";

import { getCompanyInfo, getCompanyReview, postCompanyReviews } from "../controllers/companiesController.js";

const companiesRoutes = express.Router()

companiesRoutes.get("/companyInfo/:companyId",middleware,getCompanyInfo)
companiesRoutes.get("/companyReviews/:companyId",middleware,getCompanyReview)

companiesRoutes.post("/companyReviews/:companyId",middleware,postCompanyReviews)

export default companiesRoutes;