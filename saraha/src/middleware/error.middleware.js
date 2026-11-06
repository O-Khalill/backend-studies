export function globalError(err, req, res, next) {
	return res
		.status(err.statusCode || 500)
		.json({ error: err.message, errors: err.errors, stack: err.stack });
}
