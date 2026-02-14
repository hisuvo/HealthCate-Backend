import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:doctorId", DoctorController.getDoctorById);
router.patch("/:doctorId", DoctorController.updateDoctor);
router.delete("/:doctorId", DoctorController.deleteDoctor);

export const DoctorRoutes = router;
