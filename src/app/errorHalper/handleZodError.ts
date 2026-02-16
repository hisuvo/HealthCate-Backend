import status from "http-status";
import { IErrorResponse, IErrorSources } from "../interface/error.interface";
import z from "zod";

export const handleZodError = (error: z.ZodError): IErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources: IErrorSources[] = [];

  error.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" ") || "unknown",
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    statusCode,
    errorSources,
  };
};
