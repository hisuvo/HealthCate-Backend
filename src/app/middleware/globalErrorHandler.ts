/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { IErrorResponse, IErrorSources } from "../interface/error.interface";
import { handleZodError } from "../errorHalper/handleZodError";
import AppError from "../errorHalper/AppError";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from Global Error Handler : ", error);
  }

  let errorSources: IErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let stack: string | undefined = undefined;

  if (error instanceof z.ZodError) {
    const simpilifiedError = handleZodError(error);
    statusCode = simpilifiedError.statusCode as number;
    message = simpilifiedError.message;
    errorSources = [...simpilifiedError.errorSources];
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [
      {
        path: "",
        message: error.message,
      },
    ];
    stack = error.stack;
  } else if (error instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = error.message;
    stack = error.stack;
  }

  const errorResponse: IErrorResponse = {
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? message : undefined,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
