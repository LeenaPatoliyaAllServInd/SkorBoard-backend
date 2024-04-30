import * as _ from 'lodash';

export class CustomError extends Error {
	statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export function formatSchemaError(schemaValidationError: any): void {
	if (!_.isEmpty(schemaValidationError)) {
		const errorMessage = schemaValidationError.details
			.map((detail: any) => detail.message)
			.join(', ');
		throw new Error(errorMessage);
	}
}
