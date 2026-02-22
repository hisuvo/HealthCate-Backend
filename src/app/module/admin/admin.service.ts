import status from "http-status";
import { prisma } from "../../lib/prisma";
import { IUpdateAdmin } from "./admin.interface";
import AppError from "../../errorHalper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";

const getAllAdmin = async () => {
  const allAdmin = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
  });
  return allAdmin;
};

const getAdminById = async (adminId: string) => {
  const admin = await prisma.admin.findFirst({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  return admin;
};

const updateAdmin = async (payload: Partial<IUpdateAdmin>, adminId: string) => {
  const admin = await prisma.admin.findFirst({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const updateAdmin = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: { ...payload },
  });

  return updateAdmin;
};

const softDeleteAdmin = async (adminId: string, user: IRequestUser) => {

  // validation soft deleting
  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
    select: {
      id: true,
      isDeleted: true,
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (admin.isDeleted) {
    throw new Error("Admin is already deleted");
  }

  if(user.userId === admin.id){
    throw new AppError(status.BAD_REQUEST, "You can not delete yourself");
  }

  return await prisma.admin.update({
    where: {
      id: admin.id,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const AdminService = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  softDeleteAdmin,
};
