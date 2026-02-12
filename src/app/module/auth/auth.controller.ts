import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await AuthServices.registerPatient(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User created successfull",
    data: user,
  });
});

const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await AuthServices.loginPatient(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User logged in successfull",
    data: user,
  });
});

export const AuthController = {
  registerPatient,
  loginPatient,
};
