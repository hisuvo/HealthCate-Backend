import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHalper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import {
  IChangePasswordPayload,
  ILoginPayload,
  IRegisterPatientPayload,
} from "./auth.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (txt) => {
      const patientTx = await txt.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return { ...data, accessToken, refreshToken, patient };
  } catch (error) {
    console.error("Transection error : ", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const loginPatient = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { ...data, accessToken, refreshToken };
};

const getMe = async (payload: IRequestUser) => {
  const { userId } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      patient: {
        select: {
          name: true,
          email: true,
          address: true,
          appointments: true,
          prescriptions: true,
        },
      },
      doctor: {
        include: {
          reviews: true,
          appointments: true,
          doctorSchedules: true,
          specialties: true,
        },
      },
      admin: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  // session token stand in database and check user is deleted or not
  const isSessionExists = await prisma.session.findUnique({
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

  if (!isSessionExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifyRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifyRefreshToken.success && verifyRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifyRefreshToken.data as JwtPayload;

  const getAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const getRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: getAccessToken,
    refreshToken: getRefreshToken,
    sessionToken: sessionToken,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  // const isSessionExists = await prisma.session.findUnique({
  //   where: {
  //     token: sessionToken,
  //   },
  //   include: {
  //     user: true,
  //   },
  // });

  const isSessionExists = await auth.api.getSession({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!isSessionExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const { user } = isSessionExists;

  const getAccessToken = tokenUtils.getAccessToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  const getRefreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  const result = await auth.api.changePassword({
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  return { ...result, getAccessToken, getRefreshToken };
};

const logOutUser = async(sessionToken:string)=>{
  const result = await auth.api.signOut({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  })

  return result;
}

const verifyEmail = async (email:string,otp:string) => {
// verify email otp
  const result = await auth.api.verifyEmailOTP({
    body:{
      email,
      otp
    }
  })

  // if user is verified then update user emailVerified status
  if(result.status && !result.user.emailVerified){
    await prisma.user.update({
      where:{
        email
      },
      data:{
        emailVerified:true
      }
    })
  }

  return result;
};

export const AuthServices = {
  registerPatient,
  loginPatient,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail
};
