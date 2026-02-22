/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHalper/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";
import { IRequestUser } from "../interface/requestUser.interface";

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session-token",
      );
      const accessToken = await CookieUtils.getCookie(req, "accessToken");

      if (!sessionToken && !accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No authentication token provided",
        );
      }

      let authenticatedUser: IRequestUser | null = null;

      // 1. Try Session Authentication (Prioritize better-auth session)
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists?.user) {
          const user = sessionExists.user;

          // Session refresh logic
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
          }

          authenticatedUser = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      // 2. Try JWT Access Token Authentication if Session failed
      if (!authenticatedUser && accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          envVars.ACCESS_TOKEN_SECRET,
        );

        if (verifiedToken.success && verifiedToken.data) {
          authenticatedUser = {
            userId: verifiedToken.data.userId,
            role: verifiedToken.data.role as Role,
            email: verifiedToken.data.email,
          };
        }
      }

      // 3. Final Validation
      if (!authenticatedUser) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid or expired token",
        );
      }

      // User state validation
      if (
        authenticatedUser.status === UserStatus.BLOCKED ||
        authenticatedUser.status === UserStatus.DELETED
      ) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! User is not active",
        );
      }

      if (authenticatedUser.isDeleted) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! User is deleted",
        );
      }

      // Role authorization check
      if (authRoles.length > 0 && !authRoles.includes(authenticatedUser.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource",
        );
      }

      // Populate req.user for subsequent middlewares/controllers
      req.user = {
        userId: authenticatedUser.userId,
        role: authenticatedUser.role,
        email: authenticatedUser.email,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
