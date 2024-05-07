import { Response } from "express";
import { CustomError } from "@utils/error";
import { successResponse } from "@utils/messages/successMessage";
import { handleErrorResponse } from "@utils/messages/errorMessage";
import dataStoreService from "@services/datastore.service";

const retriveUserDataStoreTemplates = async (
  request: any,
  response: any
): Promise<Response> => {
  try {
    const userId = request?.userId;
    if (!userId) {
      throw new CustomError(`Token invalid or expired`, 400);
    }
    const constraint = await dataStoreService.retriveUserDataStoreTemplates(
      userId
    );
    if (constraint) {
      return response.json(
        successResponse("Reports fetched successfully", constraint)
      );
    } else {
      return response.json(successResponse("Reports not fetched", constraint));
    }
  } catch (error) {
    return handleErrorResponse(response, error);
  }
};

const createNewDataStoreTemplate = async (
  request: any,
  response: any
): Promise<Response> => {
  try {
    const requestBody = request.body;
    if (!requestBody?.name) throw new CustomError(`Please provide name`, 400);
    if (!requestBody?.description)
      throw new CustomError(`Please provide description`, 400);
    if (!requestBody?.tableData || !requestBody?.tableData?.length)
      throw new CustomError(`Please provide table data`, 400);

    const userId = request?.userId;
    requestBody["userId"] = userId;

    const constraint = await dataStoreService.createNewDataStoreTemplate(
      requestBody
    );
    if (constraint) {
      return response.json(
        successResponse("Data store created successfully", constraint)
      );
    } else {
      return response.json(
        successResponse("Data store not created", constraint)
      );
    }
  } catch (error) {
    return handleErrorResponse(response, error);
  }
};

const updateDataStore = async (request: any, response: any) => {
  try {
    const requestBody = request.body;

    if (!requestBody?.templateId)
      throw new CustomError(`Please provide templateId`, 400);
    if (!requestBody?.tableData || !requestBody?.tableData?.length)
      throw new CustomError(`Please provide table data`, 400);

    const userId = request?.userId;
    requestBody["userId"] = userId;

    const constraint = await dataStoreService.updateDataStore(
      requestBody
    );
    if (constraint) {
      return response.json(
        successResponse("Data store updated successfully", constraint)
      );
    } else {
      return response.json(
        successResponse("Data store not updated", constraint)
      );
    }
  } catch (error) {
    return handleErrorResponse(response, error);
  }
};

export = {
  retriveUserDataStoreTemplates,
  createNewDataStoreTemplate,
  updateDataStore,
};
