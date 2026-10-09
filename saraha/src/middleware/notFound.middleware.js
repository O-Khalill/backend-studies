export function notFound(req, res, next) {
  res.status(404).json({ message: `${req.originalUrl} or ${req.method}` });
}
