import { getWeather } from "$lib/weather";
import type { RequestHandler } from "../../.svelte-kit/types/src/routes/hi";

export const get: RequestHandler = async () => {
	const weather = await getWeather("london");

	if (weather?.cod === 200) return { body: { weather } };

	return {
		body: {
			weather: {
				weather: [{ id: 800, main: "cloudy", description: weather?.message ?? "failed API call", icon: "--" }],
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
