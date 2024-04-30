import { Response } from 'express';

export const handleErrorResponse = (
  response: Response,
  error: any
): Response => {
  const code =
    error.statusCode === undefined ? error.response?.status : error.statusCode;

  if (code !== undefined) {
    return response.status(code).json({
      message: error.message,
    });
  } else {
    return response.status(500).json({ message: error.message });
  }
};