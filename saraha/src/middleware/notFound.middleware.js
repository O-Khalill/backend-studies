export function notFound(req, res) {
  res.status(404).json({ message: `${req.originalUrl} or ${req.method}` });
}
