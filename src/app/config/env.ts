import dotenv from "dotenv";
import AppError from "../errorHalper/AppError";
import status from "http-status";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRE_IN: string;
  REFRESH_TOKEN_EXPIRE_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPAIRE_IN: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
  const env = process.env;

  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRE_IN",
    "REFRESH_TOKEN_EXPIRE_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPAIRE_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];

  requiredEnvVariable.forEach((variable) => {
    if (!env[variable]) {
      // throw new Error(`Environment variable ${variable} is required but not set in .env file`)

      throw new AppError(
        status.NOT_FOUND,
        `Environment variable ${variable} is required but not set in .env file`,
      );
    }
  });

  return {
    NODE_ENV: env.NODE_ENV as string,
    PORT: env.PORT as string,
    DATABASE_URL: env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRE_IN: env.ACCESS_TOKEN_EXPIRE_IN as string,
    REFRESH_TOKEN_EXPIRE_IN: env.REFRESH_TOKEN_EXPIRE_IN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPAIRE_IN:
      env.BETTER_AUTH_SESSION_TOKEN_EXPAIRE_IN as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE:
      env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
    SUPER_ADMIN_EMAIL: env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: env.SUPER_ADMIN_PASSWORD as string,
  };
};

export const envVars = loadEnvVariables();
