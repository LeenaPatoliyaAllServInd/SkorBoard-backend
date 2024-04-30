import { LOGIN_WITH } from '@constants/config.constant';
import User from '@models/user.model';
import passport from 'passport';
import crypto from 'crypto';
import MailService from '@utils/mail/verifyMail';
import {
	validateToken,
	generateToken,
} from '../middleware/jsonWebToken/jwt_token';
import {
	encryptData,
	decryptData,
} from '../middleware/cryptography/encryption_decryption';
const authenticateWithGoogle = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

const authenticateWithGoogleCallback = passport.authenticate('google', {
	successRedirect: 'success',
	failureRedirect: 'www.gmail.com',
});

const createUser = async (data: any): Promise<any> => {
	return await createConstraint(data);
};

const createConstraint = async (data: any): Promise<any> => {
	const password = crypto.randomBytes(4).toString('hex');
	const encrypted_password = await encryptData(password);
	const constraint = new User();

	constraint.email = data.email;
	constraint.logged_in_with = LOGIN_WITH.OTHER;
	constraint.password = encrypted_password;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: data.email,
		subject: 'Welcome to our platform',
		text: `Your password is: ${password}`,
	};

	await MailService.sendMail(mailOptions);

	await constraint.save();

	return constraint;
};

const loginUser = async (data: any): Promise<any> => {
	const password = await encryptData(data.password);
	const userData = await User.findOne({ where: { email: data.email } });
	const { token, refreshToken } = await generateToken(userData, false);
	const loggedinUser = await User.findOne({
		where: {
			email: data.email,
			password: password,
		},
	}).then(async (result: any) => {
		if (result) {
			if (result.is_password_changed) {
				result.otp = generateOTP();
				const mailOptions = {
					from: process.env.EMAIL_USER,
					to: data.email,
					subject: 'Login OTP',
					text: `Your OTP for login is: ${result.otp}`,
				};
				await MailService.sendMail(mailOptions);
			}
			result.token = token;
			result.refresh_token = refreshToken;
			await result.save();
		}
		return result;
	});

	return loggedinUser;
};

const changePassword = async (data: any): Promise<any> => {
	try {
		const new_password = await encryptData(data.newPassword);
		const user = await User.findOne({
			where: {
				email: data.email,
				is_password_changed: false,
			},
		}).then(async (result) => {
			if (result) {
				result.password = new_password;
				result.is_password_changed = true;
				await result.save();
			}
			return result;
		});
		return user;
	} catch (error) {
		console.error('Error while updating user:', error);
		throw error; // Rethrow the error to handle it outside this function if needed
	}
};

const updateProfile = async (data: any): Promise<any> => {
	try {
		const filter = { id: data.id }; // Define the filter to find the user

		// Update the user document
		const result = await User.update(filter, data);

		if (result.affected === 0) {
			throw new Error('User not updated'); // Handle the case when user is not updated
		}

		// Fetch the updated user document
		const updatedUser = await User.findOne({ where: { id: data.id } });

		if (!updatedUser) {
			throw new Error('User not found after update'); // Handle the case when user is not found after update
		}

		return updatedUser; // Return the updated user object
	} catch (error) {
		console.error('Error while updating user:', error);
		throw error;
	}
};

const retriveProfileById = async (data: any): Promise<any> => {
	try {
		const profileData = await User.findOne({ where: { id: data } }).then(
			(result) => {
				return result;
			},
		);

		return profileData;
	} catch (error) {
		console.error('Error while updating user:', error);
		throw error;
	}
};

const verifyOTP = async (data: any): Promise<any> => {
	try {
		const profileData = await User.findOne({ where: data }).then(
			(result) => {
				return result;
			},
		);
		return profileData;
	} catch (error) {
		console.error('Error while updating user:', error);
		throw error;
	}
};

const generateOTP = (): string => {
	return Math.floor(1000 + Math.random() * 9000).toString();
};

export = {
	authenticateWithGoogle,
	authenticateWithGoogleCallback,
	createUser,
	loginUser,
	changePassword,
	updateProfile,
	retriveProfileById,
	verifyOTP,
};
