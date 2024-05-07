import { Router } from "express";
import { validateToken } from "../middleware/jsonWebToken/jwt_token";
import dataStoreController from "@controllers/datastore.controller";

export const router = Router();

router.get(
  "/get-template",
  (req, res, next) => {
    validateToken(req, res, next);
  },
  dataStoreController.retriveUserDataStoreTemplates
);

router.post(
  "/create-template",
  (req, res, next) => {
    validateToken(req, res, next);
  },
  dataStoreController.createNewDataStoreTemplate
);

router.post(
  "/update-template",
  (req, res, next) => {
    validateToken(req, res, next);
  },
  dataStoreController.updateDataStore
);
