import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const specialty = await prisma.specialty.create({
    data: {
      title: "Cardiology",
      description: "Heart related treatments",
      icon: "heart-icon",
    },
  });

  res.status(201).json({
    success: true,
    message: "API is working",
    data: specialty,
  });
});

export default app;
