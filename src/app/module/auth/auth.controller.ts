import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { CookieUtils } from "../../utils/cookie";

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

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("User not found");
  }

  const result = await AuthServices.getMe(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session-token"];
  if (!sessionToken) {
    throw new Error("Session token not found");
  }

  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const result = await AuthServices.getNewToken(refreshToken, sessionToken);

  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, result.sessionToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New token generated successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const sessionToken = req.cookies["better-auth.session-token"];
  if (!sessionToken) {
    throw new Error("Session token not found");
  }

  const result = await AuthServices.changePassword(payload, sessionToken);

  const { getAccessToken, getRefreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, getAccessToken);
  tokenUtils.setRefreshTokenCookie(res, getRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const logOutUser = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session-token"];
  if (!sessionToken) {
    throw new Error("Session token not found");
  }

  const result = await AuthServices.logOutUser(sessionToken);

  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "better-auth.session-token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const result = await AuthServices.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully",
    data: result,
  });
});

export const AuthController = {
  registerPatient,
  loginPatient,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail,
};
