import express, { Application } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFount } from "./app/middleware/notFound";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", IndexRoutes);

app.use(globalErrorHandler);
app.use(notFount);

export default app;
