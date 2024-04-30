import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from '@models/user.model';

const googleAuth = async () => {
	try {
		await passport.use(
			new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID!,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
					callbackURL:
						'http://localhost:3000/v1/auth/google/callback',
				},
				async (accessToken, refreshToken, profile, done) => {
					let newUser = {};
					if (profile.name && profile.emails) {
						newUser = {
							first_name: profile.name.givenName,
							last_name: profile.name.familyName,
							email: profile.emails[0].value,
							logged_in_with: profile.provider,
						};
					}
					try {
						if (profile.name && profile.emails) {
							//find the user in our database
							let user = await User.findOne({
								where: { email: profile.emails[0].value },
							});

							if (user) {
								//If user present in our database.
								done(null, user);
							} else {
								// if user is not preset in our database save user data to database.
								let newUsers = await User.create(newUser);
								done(null, newUsers);
							}
						}
					} catch (err) {
						console.error(err);
					}
				},
			),
		);
	} catch (err) {
		console.error(err);
	}
};

export = {
	googleAuth,
};
