import { cache } from "$lib/cache";
import { getWeather } from "$lib/weather";
import type { RequestHandler } from "./__types/hi";

export const get: RequestHandler = async () => {
	const data = await getWeather("london");

	if (data?.cod === 200) {
		return {
			headers: { ...cache },
			body: { data },
		};
	}

	// Failure
	return {
		body: {
			data: {
				weather: [{ id: 800, main: "cloudy", description: data?.message ?? "failed API call", icon: "--" }],
				main: {
					temp: 270,
					feels_like: 270,
					temp_min: 240,
					temp_max: 300,
					pressure: 1200,
					humidity: 60,
				},
			},
		},
	};
};
