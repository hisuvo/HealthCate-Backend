import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  AdminController.getAllAdmin,
);
router.get(
  "/:adminId",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  AdminController.getAdminById,
);
router.patch(
  "/:adminId",
  checkAuth(Role.SUPERADMIN),
  AdminController.updateAdmin,
);
router.delete(
  "/:adminId",
  checkAuth(Role.SUPERADMIN),
  AdminController.softDeleteAdmin,
);

export const AdminRouter = router;
