function createError(message, statusCode, errors = null) {
	const error = new Error(message);
	error.statusCode = statusCode;
	error.errors = errors;
	return error;
}

export function BadRequestException({
	errmMsg = "Bad Request exception",
	errors = null,
} = {}) {
	return createError(errmMsg, 400, errors);
}

export function conflictException({
	errmMsg = "Conflict",
	errors = null,
} = {}) {
	return createError(errmMsg, 409, errors);
}

export function notFoundException({
	errmMsg = "Not found",
	errors = null,
} = {}) {
	return createError(errmMsg, 404, errors);
}

export function UnauthorizedException({
	errmMsg = "Unauthorized access",
} = {}) {
	return createError(errmMsg, 401);
}
