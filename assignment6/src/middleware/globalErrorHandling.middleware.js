export function globalErrorHandling(err, req, res, next) {
  res.status(400).json({ message: err.message, stack: err.stack });
}
