import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAllDoctors();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors retrived successfully",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;

  const result = await DoctorService.getDoctorById(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor fetch successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;

  const result = await DoctorService.updateDoctor(req.body, doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor fetch successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await DoctorService.deleteDoctor(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
