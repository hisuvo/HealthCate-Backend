import { Router } from "express";

const router = Router();

router.use("/", () => console.log("super admin route"));

export const SuperAdminRouter = router;
