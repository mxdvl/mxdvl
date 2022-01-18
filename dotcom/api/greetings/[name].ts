import type { VercelRequest, VercelResponse } from "@vercel/node";

export default (request: VercelRequest, response: VercelResponse) => {
	const { name } = request.query;

	const SERVER_EXPIRE = 15 * 60;
	const CLIENT_EXPIRE = 3 * 60;
	response.setHeader("Cache-Control", `maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}`);

	const body = {
		greeting: `Hello ${name}! Comment allez-vous?`,
	};

	response.status(200).json(body);
};
