/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", checkAuth(Role.PATIENT), specialtyController.getAllSpecialties);
router.delete("/:specialtyId", specialtyController.deleteSpecialty);
router.patch("/:specialtyId", specialtyController.updateSpecialty);

export const SpecialtyRoutes = router;
