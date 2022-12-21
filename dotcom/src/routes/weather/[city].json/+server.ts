import { error, json } from "@sveltejs/kit";
import { getWeather, isValidCity, type City, type WeatherAPIResponse } from "$lib/weather";
import type { RequestHandler } from "./$types";

type WeatherData = {
	expire: number;
	data: WeatherAPIResponse;
};

const cache: Partial<Record<City, WeatherData>> = {};

const SERVER_EXPIRE = 1 * 60;
const CLIENT_EXPIRE = 36;

export const load: RequestHandler = async ({ params: { city } }) => {
	const now = Math.round(new Date().getTime() / 1_000);

	if (!isValidCity(city)) throw error(404, "Unknown city");

	if (cache[city]?.expire ?? 0 < now) {
		const data = await getWeather(city);

		if (data) {
			cache[city] = {
				expire: now + SERVER_EXPIRE,
				data,
			};
		}
	}
	const { data } = cache[city] ?? { status: 500, body: { message: `An error occured` } };

	return json(data, {
		headers: { "Cache-Control": `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}` },
	});
};
