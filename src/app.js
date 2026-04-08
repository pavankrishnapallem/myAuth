import express, { json, urlencoded } from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//cors config
app.use(cors({
  origin: "*"
}));

//auth routes
app.use("/auth", authRoutes);


export default app