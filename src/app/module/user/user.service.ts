/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/browser";
import AppError from "../../errorHalper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];
  /**
   * check have specialty[] inside specialtiesId if get then next other wise error show
   * check user is exists if get then next otherwise error show
   * create userData by using better auth
   * now create transection and for create transection use try__catch
   *
   */

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });

    if (!specialty) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with id ${specialtyId} not found`,
      );
    }

    specialties.push(specialty);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, `User with this email already exists`);
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          userId: true,
          profilePhoto: true,
          experience: true,
          contactNumber: true,
          registrationNumber: true,
          gender: true,
          designation: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              createdAt: true,
              deletedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (error) {
    // Cleanup: Delete user if doctor creation fails
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw new Error("Failed to create doctor");
  }
};

const createAdmin = async (payload: ICreateAdminPayload) => {
  // step 1: Check if user already exists
  const ExistAdimn = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (ExistAdimn) {
    throw new AppError(status.CONFLICT, "Admin already exists");
  }

  // step-2: Create uer account with better-auth
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  // step-3: Create admin profile in transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin,
        },
      });

      // Fetch created admin with user data
      const CreateAdmin = await tx.admin.findUnique({
        where: {
          id: admin.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          porfilePhoto: true,
          contactNumber: true,
          address: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      return CreateAdmin;
    });

    return result;
  } catch (error) {
    // Cleanup: Delete user if admin creation fails
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw new Error("Failed to create admin");
  }
};

export const userService = {
  createDoctor,
  createAdmin,
};
