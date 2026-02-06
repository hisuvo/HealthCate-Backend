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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Specialty created failed",
      details: error,
    });
  }
};

export const specialtyController = {
  createSpecialty,
};
