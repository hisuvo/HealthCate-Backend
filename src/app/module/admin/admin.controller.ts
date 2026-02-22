import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { AdminService } from "./admin.service";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmin();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admins retived succssfully",
    data: result,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { adminId } = req.params;

  const result = await AdminService.getAdminById(adminId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get Admin by id",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { adminId } = req.params;

  const result = await AdminService.updateAdmin(payload, adminId as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin Updated successfully",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { adminId } = req.params;
  const user = req.user;

  const result = await AdminService.softDeleteAdmin(adminId as string, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin deleted successfull",
    data: result,
  });
});

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  softDeleteAdmin,
};
