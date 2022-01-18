import type { VercelRequest, VercelResponse } from "@vercel/node";

export default (request: VercelRequest, response: VercelResponse) => {
	const { name } = request.query;

	const body = {
		greeting: `Hello ${name}! Comment allez-vous?`,
	};

	response.status(200).json(body);
};
