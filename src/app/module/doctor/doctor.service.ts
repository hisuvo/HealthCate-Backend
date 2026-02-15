import { prisma } from "../../lib/prisma";
import { IUpgradeDoctorPaylod } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return doctors;
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  return doctor;
};

const updateDoctor = async (
  payload: IUpgradeDoctorPaylod,
  doctorId: string,
) => {
  const udpateDoctor = await prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findUniqueOrThrow({
      where: {
        id: doctorId,
      },
      select: {
        id: true,
      },
    });

    const update = await tx.doctor.update({
      where: {
        id: doctor.id,
      },
      data: payload,
    });

    return update;
  });

  return udpateDoctor;
};

const deleteDoctor = async (doctorId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findFirst({
      where: {
        id: doctorId,
        isDeleted: false,
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or already deleted");
    }

    return await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isDeleted: true,
      },
      select: {
        id: true,
        name: true,
        specialties: true,
      },
    });
  });

  return result;
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
