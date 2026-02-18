import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await AuthServices.registerPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = user;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User created successfull",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await AuthServices.loginPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = user;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User logged in successfull",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

export const AuthController = {
  registerPatient,
  loginPatient,
};
