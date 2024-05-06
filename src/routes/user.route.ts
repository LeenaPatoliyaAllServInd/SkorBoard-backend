// Define authentication routes

import userController from '@controllers/user.controller';
import { Router } from 'express';
import passport from 'passport';
import {
	validateRefreshToken,
	validateToken,
} from '../middleware/jsonWebToken/jwt_token';

export const router = Router();

// Google Authentication
router.get(
	'/google',
	passport.authenticate('google', { scope: ['email', 'profile'] }),
);
router.get('/google/callback', (req, res, next) => {
	passport.authenticate('google', (err: any, user: any, info: any) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			// Redirect to a failure page if authentication fails
			return res.redirect('/login-failure');
		}
		// Authentication successful, redirect to a success page or home page
		res.render('success', { user: req.user });
	})(req, res, next);
});

// Other Authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post(
	'/change-password',
	(req: any, res: any, next) => {
		validateToken(req, res, next);
	},
	userController.changePassword,
);
router.post(
	'/update-profile',
	(req, res, next) => {
		validateToken(req, res, next);
	},
	userController.updateProfile,
);

router.get(
	'/user/profile/:profileId',
	(req, res, next) => {
		validateToken(req, res, next);
	},
	userController.retriveProfileById,
);

router.post('/refresh/token', (req, res, next) => {
	validateRefreshToken(req, res, next);
});

router.post(
	'/verify/otp',
	(req, res, next) => {
		validateToken(req, res, next);
	},
	userController.verifyOTP,
);

router.post('/google-signin', userController.signinWithGoogle)