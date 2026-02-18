/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHalper/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth = (...authRole: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Session Token Verification
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      const accessToken = await CookieUtils.getCookie(req, "accessToken");

      let isAuth = false;

      if (!sessionToken && !accessToken) {
        throw new Error("Unauthorize access! No session token provided");
      }

      if (sessionToken) {
        // * check first have sessiontoken in database
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(), // if expire data is getterhand new Date() then valid
            },
          },

          include: {
            user: true,
          },
        });


        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session Expiring soon!!");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorize access! User is not active",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorize access! User is deleted",
            );
          }

          if (authRole.length > 0 && !authRole.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbiddem access! you don't have permission to access this resource",
            );
          }
          isAuth = true;
        }
      }

      //  Access Token Verification

      if (!accessToken && !isAuth) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token",
        );
      }

      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          envVars.ACCESS_TOKEN_SECRET,
        );

        if (!verifiedToken.seccess) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! Invalid access token",
          );
        }

        if (
          authRole.length > 0 &&
          !authRole.includes(verifiedToken.data!.role as Role)
        ) {
          throw new AppError(
            status.FORBIDDEN,
            "Forbidden access! you do not have permission to access this resourse",
          );
        }
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
