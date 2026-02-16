import { Router } from "express";
import { userController } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-doctor",
  // (req: Request, res: Response, next: NextFunction) => {
  //   const parseResult = createDoctorZodSchema.safeParse(req.body);

  //   if (!parseResult.success) {
  //     next(parseResult.error);
  //   }

  //   // sanitize the data
  //   req.body = parseResult.data;

  //   next();
  // },
  validationRequest(createDoctorZodSchema),
  userController.createDoctor,
);

export const UserRoutes = router;
