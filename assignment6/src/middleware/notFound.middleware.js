export function notFound(req, res) {
  return res
    .status(404)
    .json({ message: "invalid url " + req.url + " or method" });
}
