import type { VercelRequest, VercelResponse } from "@vercel/node";

const cache: Record<
	string,
	{
		timestamp: number;
		data: unknown;
	}
> = {};

const SERVER_EXPIRE = 15 * 60;
const CLIENT_EXPIRE = 3 * 60;

export default (request: VercelRequest, response: VercelResponse) => {
	const now = new Date().getTime();
	const { name } = request.query;

	const key = `${name}`;
	if (cache[key].timestamp + SERVER_EXPIRE > now) delete cache[key];
	if (!cache[key])
		cache[key] = {
			timestamp: now,
			data: Math.random() * 1200,
		};

	const { data } = cache[key];

	response.setHeader("Cache-Control", `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}`);

	const body = {
		greeting: `Hello ${name}! Comment allez-vous?`,
		data,
		date: new Date().toISOString(),
		key,
	};

	response.status(200).json(body);
};
