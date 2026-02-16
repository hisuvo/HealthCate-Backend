import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validationRequest = (zodSchama: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = zodSchama.safeParse(req.body);

    if (!parseResult.success) {
      next(parseResult.error);
    }

    // sanitize the data
    req.body = parseResult.data;

    next();
  };
};
