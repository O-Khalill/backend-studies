import nodemailer from "nodemailer";
import {
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_USER,
	EMAIL_PASS,
} from "../../config/config.service.js";

const transporter = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: EMAIL_PORT,
	secure: EMAIL_PORT === 465,
	auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export const sendEmail = ({ to, subject, html }) =>
	transporter.sendMail({ from: `"Saraha" <${EMAIL_USER}>`, to, subject, html });
