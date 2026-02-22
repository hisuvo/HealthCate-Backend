import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerPatient);
router.post("/login", AuthController.loginPatient);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPERADMIN),
  AuthController.getMe,
);
router.get("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPERADMIN),
  AuthController.changePassword,
);
router.post(
  "/log-out",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPERADMIN),
  AuthController.logOutUser,
);
router.post("/verify-email", AuthController.verifyEmail);

export const AuthRoutes = router;
