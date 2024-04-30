import User from '@models/user.model';
import { handleErrorResponse } from '@utils/messages/errorMessage';
import { successResponse } from '@utils/messages/successMessage';
import jwt from 'jsonwebtoken';

const generateToken = (user: any, remember_me: boolean) => {
	let ACCES_TOKEN_SECRET_KEY: string | undefined =
		process.env.ACCESS_TOKEN_JWT_SECRET_KEY;
	let REFRESH_TOKEN_SECRET_KEY: string | undefined =
		process.env.REFRESH_TOKEN_JWT_SECRET_KEY;
	const payload = {
		id: user.id,
		email: user.email,
	};
	let options: jwt.SignOptions = {};
	if (!remember_me)
		options = {
			expiresIn: '1h',
		};

	const token = jwt.sign(payload, ACCES_TOKEN_SECRET_KEY!, options);
	const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY!, {
		expiresIn: '1d',
	});
	return { token, refreshToken };
};

const validateToken = (req: any, res: any, next: any) => {
	try {
		const jwtSecretKey: any = process.env.ACCESS_TOKEN_JWT_SECRET_KEY;
		const token = req.header('token');
		if (token) {
			const verified = jwt.verify(token, jwtSecretKey);
			console.log('verifiedverifiedverified', verified);
			if (verified) {
				// req.userId = verified.id ?? verified.userId;
				console.log('Token verify successfully');
				next();
			} else {
				return handleErrorResponse(res, {
					message: 'User not found. Token invalid or expired',
					statusCode: 403,
				});
			}
		} else {
			return handleErrorResponse(res, {
				message: 'Please provide token',
				statusCode: 403,
			});
		}
	} catch (error) {
		return handleErrorResponse(res, error);
	}
};

const validateRefreshToken = async (req: any, res: any, next: any) => {
	try {
		const jwtSecretKey: any = process.env.ACCESS_TOKEN_JWT_SECRET_KEY;
		const { refreshToken, email, id } = req.body;
		const isValid = verifyRefresh(email, refreshToken);
		if (!isValid) {
			return handleErrorResponse(res, {
				message: 'Invalid token,try login again',
				statusCode: 403,
			});
		}
		const accessToken = jwt.sign({ id, email }, jwtSecretKey, {
			expiresIn: '1h',
		});
		if (accessToken) {
			const loggedinUser = await User.findOne({
				where: {
					email: email,
					id: id,
				},
			}).then(async (result: any) => {
				if (result) {
					result.token = accessToken;
					result.refresh_token = refreshToken;
					await result.save();
				}
				return result;
			});
			return res.json(
				successResponse('Token generated successfully', loggedinUser),
			);
		}
	} catch (error) {
		return handleErrorResponse(res, error);
	}
};

const verifyRefresh = (email: any, token: any) => {
	try {
		const jwtSecretKey: any = process.env.REFRESH_TOKEN_JWT_SECRET_KEY;
		const decoded: any = jwt.verify(token, jwtSecretKey);
		console.log('jjjjjj', decoded);
		return decoded.email === email;
	} catch (error) {
		// console.error(error);
		return false;
	}
};

export { generateToken, validateToken, validateRefreshToken };
