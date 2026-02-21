import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  DoctorController.getAllDoctors,
);

router.get(
  "/:doctorId",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  DoctorController.getDoctorById,
);

router.patch(
  "/:doctorId",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  DoctorController.updateDoctor,
);

router.delete(
  "/:doctorId",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  DoctorController.deleteDoctor,
);

export const DoctorRoutes = router;
