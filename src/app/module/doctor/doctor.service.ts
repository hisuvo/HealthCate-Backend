import status from "http-status";
import { prisma } from "../../lib/prisma";
import { IUpgradeDoctorPaylod } from "./doctor.interface";
import AppError from "../../errorHalper/AppError";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      doctorSchedules: {
        select: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });

  return doctors;
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });

  return doctor;
};

const updateDoctor = async (
  payload: IUpgradeDoctorPaylod,
  doctorId: string,
) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const udpateDoctor = await prisma.$transaction(async (tx) => {
    if (payload.doctor) {
      await tx.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          ...payload.doctor,
        },
      });
    }
    if (payload.specialization && payload.specialization.length > 0) {
      for (const specialty of payload.specialization) {
        if (specialty.shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              id: specialty.specialtyId,
            },
          });
        } else {
          await tx.doctorSpecialty.update({
            where: {
              id: specialty.specialtyId,
            },
            data: {
              ...specialty,
            },
          });
        }
      }
    }
    return;
  });

  return udpateDoctor;
};

const deleteDoctor = async (doctorId: string) => {
  const isDoctorExist = await prisma.doctor.findFirst({
    where: {
      id: doctorId,
    },
    include: {
      user: true,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found or already deleted");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: {
        id: isDoctorExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: isDoctorExist.userId,
      },
    });

    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId,
      },
    });
  });

  return { message: "Doctor Deleted Successfully" };
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
