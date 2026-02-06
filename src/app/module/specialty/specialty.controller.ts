/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

// const createSpecialty = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const result = await specialtyService.createSpecialty(payload);

//     res.status(201).json({
//       success: true,
//       message: "Specialty created successfull",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to created specilty",
//       error: error.message,
//     });
//   }
// };

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Specialty created successfull",
    data: result,
  });

  // res.status(201).json({
  //   success: true,
  //   message: "Specialty created successfull",
  //   data: result,
  // });
});

// const getAllSpecialties = async (req: Request, res: Response) => {
//   try {
//     const result = await specialtyService.getAllSpecialties();

//     res.status(201).json({
//       success: true,
//       message: "Specialty created successfull",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to created specilty",
//       error: error.message,
//     });
//   }
// };

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialties();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty retrived successfull",
    data: result,
  });

  // res.status(200).json({
  //   success: true,
  //   message: "Specialty retrived successfull",
  //   data: result,
  // });
});

// const deleteSpecialty = async (req: Request, res: Response) => {
//   try {
//     const { specialtyId } = req.params;

//     const result = await specialtyService.deleteSpecialty(
//       specialtyId as string,
//     );

//     res.status(201).json({
//       success: true,
//       message: "Specialty deleted successfull",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to deleted specilty",
//       error: error.message,
//     });
//   }
// };

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { specialtyId } = req.params;

  const result = await specialtyService.deleteSpecialty(specialtyId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty deleted successfull",
    data: result,
  });

  // res.status(200).json({
  //   success: true,
  //   message: "Specialty deleted successfull",
  //   data: result,
  // });
});

// const updateSpecialty = async (req: Request, res: Response) => {
//   try {
//     const { specialtyId } = req.params;
//     const payload = req.body;

//     const result = await specialtyService.updateSpecialty(
//       payload,
//       specialtyId as string,
//     );

//     res.status(201).json({
//       success: true,
//       message: "Specialty updated successfull",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to updated specilty",
//       error: error.message,
//     });
//   }
// };

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { specialtyId } = req.params;
  const payload = req.body;

  const result = await specialtyService.updateSpecialty(
    payload,
    specialtyId as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty updated successfull",
    data: result,
  });

  // res.status(201).json({
  //   success: true,
  //   message: "Specialty updated successfull",
  //   data: result,
  // });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
