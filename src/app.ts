import express, { Application } from "express";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", IndexRoutes);

export default app;
