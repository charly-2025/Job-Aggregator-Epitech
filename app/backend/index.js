import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ratelimit from "express-rate-limit";
import { config } from "dotenv";

import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const swaggerFile = require("./config/swagger.json");

import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import offersRoutes from "./routes/offersRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

config({ path: "../.env", quiet: true });

const backendPort = process.env.BACKEND_PORT;
const frontendPort = process.env.FRONTEND_PORT;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `http://localhost:${frontendPort}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }),
);
app.use(cookieParser());

app.listen(backendPort, () => {
  console.log(`Server is running on port ${backendPort}`);
});

app.get("/", (req, res) => {
  res.send("Hello from Node Api server");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/users',usersRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/offers',offersRoutes)
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/companies/',companiesRoutes)