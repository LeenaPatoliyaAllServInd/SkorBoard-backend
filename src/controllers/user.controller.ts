// Controller for handling authentication logic
import { Request, Response, response } from 'express';
import authService from '@services/user.service';
import { CustomError } from '@utils/error';
import { successResponse } from '@utils/messages/successMessage';
import { handleErrorResponse } from '@utils/messages/errorMessage';
import userService from '@services/user.service';

const googleAuth = authService.authenticateWithGoogle;
const googleAuthCallback = authService.authenticateWithGoogleCallback;

const registerUser = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	try {
		const requestBody = request.body;
		if (!requestBody.email) {
			throw new CustomError(`Please provide email address`, 400);
		}

		const constraint = await userService.createUser(requestBody);

		if (constraint) {
			return response.json(
				successResponse('User created successfully', constraint),
			);
		} else {
			return response.json(
				successResponse('User not created', constraint),
			);
		}
	} catch (error) {
		return handleErrorResponse(response, error);
	}
};

const loginUser = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	try {
		const requestBody = request.body;
		if (!requestBody.email) {
			throw new CustomError(`Invalid request body`, 400);
		}
		const constraint = await userService.loginUser(requestBody);
		if (constraint) {
			return response.json(
				successResponse('User loggedin successfully', constraint),
			);
		} else {
			return response.json(
				successResponse('Invalid credentials', constraint),
			);
		}
	} catch (error) {
		return handleErrorResponse(response, error);
	}
};

const changePassword = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	try {
		const requestBody = request.body;
		if (!requestBody.newPassword) {
			throw new CustomError(`Please enter password`, 400);
		}
		const constraint = await userService.changePassword(requestBody);
		if (constraint) {
			return response.json(
				successResponse('Password changed successfully', constraint),
			);
		} else {
			return response.json(
				successResponse('Password not changed', constraint),
			);
		}
	} catch (error) {
		return handleErrorResponse(response, error);
	}
};

const updateProfile = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	try {
		const requestBody = request.body;
		if (!requestBody) {
			throw new CustomError(`Please provide profile details`, 400);
		}
		const constraint = await userService.updateProfile(requestBody);
		if (constraint) {
			return response.json(
				successResponse('Profile updated successfully', constraint),
			);
		} else {
			return response.json(
				successResponse('Profile not updated', constraint),
			);
		}
	} catch (error) {
		return handleErrorResponse(response, error);
	}
};

const retriveProfileById = async (
	request: Request,
	response: Response,
): Promise<Response> => {
	try {
		const requestBody = request.params.profileId;
		if (!requestBody) {
			throw new CustomError(`Please provide profile Id`, 400);
		}
		const constraint = await userService.retriveProfileById(requestBody);
		if (constraint) {
			return response.json(
				successResponse('Profile fetched successfully', constraint),
			);
		} else {
			return response.json(
				successResponse('Profile not fetched', constraint),
			);
		}
	} catch (error) {
		return handleErrorResponse(response, error);
	}
};

export = {
	googleAuth,
	googleAuthCallback,
	registerUser,
	loginUser,
	changePassword,
	updateProfile,
	retriveProfileById,
};
