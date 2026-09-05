export const notFound = async (req, res) => {
	return res.status(404).json({ message: `INVALID URL ${req.url} OR METHOD` });
};
