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
  const deleteDoctor = await prisma.$transaction(async (tx) => {
    const result = await tx.doctor.delete({
      where: {
        id: doctorId,
      },
      select: {
        id: true,
        name: true,
        specialties: true,
      },
    });

    return result;
  });

  return deleteDoctor;
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
