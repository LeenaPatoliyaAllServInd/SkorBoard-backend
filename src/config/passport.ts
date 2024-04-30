import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import User from '@models/user.model'; // Import your User model
import { LOGIN_WITH } from '@constants/config.constant';

export default function (passport: PassportStatic): void {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
				callbackURL: 'http://localhost:3000/v1/auth/google/callback',
				userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // Specify the user profile URL
				scope: ['profile', 'email', 'offline_access'], // Request access to profile and email information
			},
			async (
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: any,
			) => {
				try {
					// Access the user's name from the profile
					const firstName = profile.name?.givenName;
					const lastName = profile.name?.familyName;

					// Example: Save user data to your database
					const newUser: any = {
						first_name: firstName,
						last_name: lastName,
						email: profile.emails[0].value,
						logged_in_with: LOGIN_WITH.GOOGLE
					};

					// Example: Check if the user already exists in your database
					let user: any = await User.findOne({
						where: { email: profile.emails[0].value },
					});

					if (user) {
						done(null, user); // User exists, authenticate
					} else {
						// User doesn't exist, create a new user
						user = await User.createUser(newUser);
						done(null, user); // Authenticate new user
					}
				} catch (err) {
					console.error('Error in Google OAuth callback:', err);
					done(err); // Pass error to Passport
				}
			},
		),
	);

	passport.serializeUser(function (user: any, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user: any, done) {
		done(null, user);
	});
}
