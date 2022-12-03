import { getWeather } from "$lib/weather";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const data = await getWeather("london");

	if (data?.cod === 200) {
		return { feels_like: data.main.feels_like, id: data.weather[0]?.id ?? 803 };
	}

	return { feels_like: 270, id: 803 };
};
