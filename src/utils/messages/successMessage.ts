export const successResponse = (
	message: String,
	data: any,
): {
	message: String;
	data: any;
} => {
	return {
		message,
		data,
	};
};