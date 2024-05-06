import { router as userRouter } from "@routes/user.route";
import { router as reportRouter } from "@routes/report.route";
import { Router } from "express";
export const router = Router();

router.use("/auth", userRouter);
router.use("/report", reportRouter);
