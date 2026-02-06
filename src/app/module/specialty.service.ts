import { Specialty } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });

  return specialty;
};

const getAllSpecialties = async () => {
  const specialty = await prisma.specialty.findMany();

  return specialty;
};

const deleteSpecialty = async (specialtyId: string) => {
  const specialty = await prisma.specialty.delete({
    where: {
      id: specialtyId,
    },
  });

  return specialty;
};

const updateSpecialty = async (payload: Specialty, specialtyId: string) => {
  const specialty = await prisma.specialty.update({
    where: {
      id: specialtyId,
    },
    data: payload,
  });

  return specialty;
};

export const specialtyService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
