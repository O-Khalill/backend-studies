import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../config/config.service.js";
import { UnauthorizedException } from "../exceptions/app.exception.js";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID,
		});
		return ticket.getPayload();
	} catch {
		throw UnauthorizedException({ errmMsg: "Invalid Google token" });
	}
}
