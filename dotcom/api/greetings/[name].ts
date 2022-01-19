import type { VercelRequest, VercelResponse } from "@vercel/node";

const cache: Record<
	string,
	{
		expire: number;
		data: unknown;
	}
> = {};

let count = 0;

const SERVER_EXPIRE = 15 * 60;
const CLIENT_EXPIRE = 3 * 60;

export default (request: VercelRequest, response: VercelResponse) => {
	const now = Math.round(new Date().getTime() / 1_000);
	const { name } = request.query;

	const key = `${name}`;

	if (cache[key].expire ?? 0 < now) {
		cache[key] = {
			expire: now + SERVER_EXPIRE,
			data: Math.round(Math.random() * 1200),
		};
	}
	const { data } = cache[key];

	response.setHeader("Cache-Control", `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}`);

	const body = {
		greeting: `Hello ${name}! Comment allez-vous?`,
		data,
		date: new Date().toISOString(),
		expire: now + SERVER_EXPIRE,
		count,
		cache,
	};

	count++;

	response.status(200).json(body);
};
