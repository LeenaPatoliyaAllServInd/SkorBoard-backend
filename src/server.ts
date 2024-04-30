import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';

import { router as Router } from '@routes/index';
import createDatabaseConnection from '@database/connect.database';

import winston from 'winston';
import crypto from 'crypto';

import session from 'express-session';
import passport from 'passport';
import passportConfig from './config/passport';
passportConfig(passport);

const PORT = process.env.PORT || 3001;

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your views/templates are located
app.set('views', path.join(__dirname, 'views'));

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(
	session({
		secret: secretKey, 
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
winston.add(new winston.transports.Console());
app.use(express.json());
app.use('/v1', Router);

const establishDatabaseConnection = async (): Promise<void> => {
	try {
		await createDatabaseConnection();
		winston.info('Database connected successfully');
	} catch (error) {
		winston.error('Error connecting to database:', error);
		process.exit(1); // Exit process on database connection error
	}
};
function initServer(): void {
	app.listen(PORT, () => {
		winston.info(`Server started on port ${PORT}`);
	});

	// Handle server errors
	app.on('error', (err) => {
		winston.error('Server error:', err);
	});
}

export async function init(): Promise<void> {
	try {
		await establishDatabaseConnection();
		initServer();
	} catch (error) {
		winston.error('Initialization error:', error);
		process.exit(1); // Exit process on initialization error
	}
}
init();
