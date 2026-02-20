import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:adminId", AdminController.getAdminById);
router.patch("/:adminId", AdminController.updateAdmin);
router.delete("/:adminId", AdminController.softDeleteAdmin);

export const AdminRouter = router;
