import { Router } from "express";
import { userController } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { UserValidation } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// router.post(
//   "/create-doctor",
//   (req: Request, res: Response, next: NextFunction) => {
//     const parseResult = createDoctorZodSchema.safeParse(req.body);

//     if (!parseResult.success) {
//       next(parseResult.error);
//     }

//     // sanitize the data
//     req.body = parseResult.data;

//     next();
//   },
//   userController.createDoctor,
// );

router.post(
  "/create-doctor",
  validationRequest(UserValidation.createDoctorZodSchema),
  userController.createDoctor,
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPERADMIN),
  validationRequest(UserValidation.createAdminZodValidationSchema),
  userController.createAdmin,
);

// trial version
router.post(
  "/create-super-admin",
  validationRequest(UserValidation.createSuperAdminZodValidationSchema),
  userController.createSuperAdmin,
);

export const UserRoutes = router;
