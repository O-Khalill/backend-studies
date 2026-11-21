import multer from "multer";
import crypto from "node:crypto";
import { BadRequestException } from "../exceptions/app.exception.js";

export const MAX_FILES = 3;

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
	destination: "uploads",
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${crypto.randomUUID()}.${ext}`);
	},
});

export const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024, files: MAX_FILES },
	fileFilter: (req, file, cb) => {
		if (ALLOWED.includes(file.mimetype)) return cb(null, true);
		cb(
			BadRequestException({
				errmMsg: "Only JPEG, PNG, GIF and WebP images are allowed",
			}),
		);
	},
});
