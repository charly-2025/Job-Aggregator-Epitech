import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser' ; 
import { config } from 'dotenv';

import swaggerUi from "swagger-ui-express";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const swaggerFile = require('./config/swagger.json');

import usersRoutes from "./routes/usersRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import offersRoutes from "./routes/offersRoutes.js"

config({ path: '.env' ,quiet:true});   
const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));   
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(cookieParser()); 

app.listen(port,() => {
    console.log(`Server is runnong on port ${port}`)
})

app.get("/",(req,res) =>{
    res.send("Hello from Node Api server")
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/users',usersRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/offers',offersRoutes)