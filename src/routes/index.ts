import { router as userRouter } from "@routes/user.route";
import { router as dataStoreRouter } from "@routes/datastore.route";
import { Router } from "express";
export const router = Router();

router.use("/auth", userRouter);
router.use("/datastore", dataStoreRouter);
