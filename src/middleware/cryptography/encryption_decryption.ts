import { CustomError } from '@utils/error';
import * as crypto from 'crypto';

const { SECRET_KEY, SECRET_IV, ECNRYPTION_METHOD } = process.env;

if (!SECRET_KEY || !SECRET_IV || !ECNRYPTION_METHOD) {
	throw new CustomError(
		`secretKey, secretIV, and ecnryptionMethod are required`,
		400,
	);
}

const ENCRYPTION_METHOD = 'aes-256-cbc';

const key = crypto
	.createHash('sha512')
	.update(SECRET_KEY)
	.digest('hex')
	.substring(0, 32);
const encryptionIV = crypto
	.createHash('sha512')
	.update(SECRET_IV)
	.digest('hex')
	.substring(0, 16);

// Encrypt data
function encryptData(data: string): string {
	const cipher = crypto.createCipheriv(ENCRYPTION_METHOD, key, encryptionIV);
	let encryptedData = cipher.update(data, 'utf8', 'hex');
	encryptedData += cipher.final('hex');
	return Buffer.from(encryptedData, 'hex').toString('base64');
}

// Decrypt data
function decryptData(encryptedData: string): string {
	const buff = Buffer.from(encryptedData, 'base64');
	const decipher = crypto.createDecipheriv(
		ENCRYPTION_METHOD,
		key,
		encryptionIV,
	);
	let decryptedData = decipher.update(buff.toString('hex'), 'hex', 'utf8');
	decryptedData += decipher.final('utf8');
	return decryptedData;
}

export { encryptData, decryptData };
