import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createDoctor(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctors created successfull",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin created successfull",
    data: result,
  });
});

// trial version adim wile superAdmin
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "SuperAdmin created successfull",
    data: result,
  });
});

export const userController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
