import { Response } from "express";
import { CustomError } from "@utils/error";
import { successResponse } from "@utils/messages/successMessage";
import { handleErrorResponse } from "@utils/messages/errorMessage";
import reportService from "@services/report.service";

const retriveUserReports = async (
  request: any,
  response: any
): Promise<Response> => {
  try {
    const userId = request?.userId;
    if (!userId) {
      throw new CustomError(`Token invalid or expired`, 400);
    }
    const constraint = await reportService.retriveUserReports(userId);
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

const createNewReport = async (
  request: any,
  response: any
): Promise<Response> => {
  try {
    const requestBody = request.body;
    if (!requestBody || JSON.stringify(requestBody) === "{}") {
      throw new CustomError(`Please provide report details`, 400);
    }

    if (!requestBody?.name)
      throw new CustomError(`Please provide report name`, 400);
    if (!requestBody?.description)
      throw new CustomError(`Please provide report description`, 400);
    if (!requestBody?.tableData || !requestBody?.tableData?.length)
      throw new CustomError(`Please provide table data`, 400);

    const userId = request?.userId;
    requestBody["userId"] = userId;

    const constraint = await reportService.createNewReport(requestBody);
    if (constraint) {
      return response.json(
        successResponse("Report created successfully", constraint)
      );
    } else {
      return response.json(successResponse("Reports not created", constraint));
    }
  } catch (error) {
    return handleErrorResponse(response, error);
  }
};

export = {
  retriveUserReports,
  createNewReport,
};
