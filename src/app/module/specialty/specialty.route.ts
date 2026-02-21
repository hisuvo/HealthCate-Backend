/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", specialtyController.getAllSpecialties);
router.delete("/:specialtyId", specialtyController.deleteSpecialty);
router.patch("/:specialtyId", specialtyController.updateSpecialty);

export const SpecialtyRoutes = router;
