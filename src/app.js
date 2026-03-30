import express, { json, urlencoded } from "express";
import cors from "cors";


const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//cors config
app.use(cors({
  origin: "*"
}));

export default app

