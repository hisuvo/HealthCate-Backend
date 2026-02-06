/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await specialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      message: "Specialty created successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to created specilty",
      error: error.message,
    });
  }
};

const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await specialtyService.getAllSpecialties();

    res.status(201).json({
      success: true,
      message: "Specialty created successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to created specilty",
      error: error.message,
    });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const { specialtyId } = req.params;

    const result = await specialtyService.deleteSpecialty(
      specialtyId as string,
    );

    res.status(201).json({
      success: true,
      message: "Specialty deleted successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to deleted specilty",
      error: error.message,
    });
  }
};

const updateSpecialty = async (req: Request, res: Response) => {
  try {
    const { specialtyId } = req.params;
    const payload = req.body;

    const result = await specialtyService.updateSpecialty(
      payload,
      specialtyId as string,
    );

    res.status(201).json({
      success: true,
      message: "Specialty updated successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to updated specilty",
      error: error.message,
    });
  }
};

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
