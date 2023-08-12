import { getWeather } from "$lib/weather.js";

export const prerender = true;

export const load = async () => {
	const data = await getWeather("london", process.env.WEATHER_API);

	if (data?.cod === 200) {
		return { feels_like: data.main.feels_like, id: data.weather[0]?.id ?? 803 };
	}

	return { feels_like: 270, id: 803 };
};
