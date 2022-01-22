import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const cities = ["london", "montreal", "tokyo", "paris", "berlin"] as const;

const cache: Record<
	typeof cities[number],
	{
		expire: number;
		data: unknown;
	}
> = {};

let count = 0;

const SERVER_EXPIRE = 1 * 60;
const CLIENT_EXPIRE = 36;

export default async (request: VercelRequest, response: VercelResponse) => {
	const now = Math.round(new Date().getTime() / 1_000);
	const { name } = request.query;

	if(!cities.includes(name)) response.status(404).json({error: `I never lived in ${name}`})

	if (cache[name]?.expire ?? 0 < now) {
	   const api = await fetch("api.openweathermap.org/data/2.5/weather?q=London,UK&appid=${process.env.WEATHER_API}").then(r=> r.json())

		cache[name] = {
			expire: now + SERVER_EXPIRE,
			data: Math.round(Math.random() * 1200),
		};
	}
	const { data } = cache[name] ?? { data: undefined };

	response.setHeader("Cache-Control", `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}`);

	const body = {
	    name,
		date: new Date().toISOString(),
		data,
	};

	count++;

	response.status(200).json(body);
};
