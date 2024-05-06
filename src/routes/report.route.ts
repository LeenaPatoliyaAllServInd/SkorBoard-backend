import { Router } from "express";
import { validateToken } from "../middleware/jsonWebToken/jwt_token";
import reportController from "@controllers/report.controller";

export const router = Router();

router.get(
  "/",
  (req, res, next) => {
    validateToken(req, res, next);
  },
  reportController.retriveUserReports
);

router.post(
  "/",
  (req, res, next) => {
    validateToken(req, res, next);
  },
  reportController.createNewReport
);
