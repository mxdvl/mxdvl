import type { RequestHandler } from "@sveltejs/kit";

const cities = ["london", "montreal", "tokyo", "paris", "berlin"] as const;
type City = typeof cities[number];

type WeatherAPIRespone = {
	coord: {
		lat: number;
		lon: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
};

type WeatherData = {
	expire: number;
	data: WeatherAPIRespone;
};

const cache: Partial<Record<City, WeatherData>> = {};

const SERVER_EXPIRE = 1 * 60;
const CLIENT_EXPIRE = 36;

const isValidCity = (city: unknown): city is City => typeof city === "string" && cities.includes(city as City);

export const get: RequestHandler = async ({ params }) => {
	const now = Math.round(new Date().getTime() / 1_000);
	const { city } = params;

	if (!isValidCity(city)) {
		return { status: 404, body: { message: `I never lived in ${city}` } };
	}

	if (cache[city]?.expire ?? 0 < now) {
		const url = new URL("https://api.openweathermap.org/data/2.5/weather");
		url.searchParams.set("q", city);
		url.searchParams.set("appid", String(process.env.WEATHER_API));

		const data: WeatherAPIRespone = await fetch(url.toString()).then((r) => r.json());

		cache[city] = {
			expire: now + SERVER_EXPIRE,
			data,
		};
	}
	const { data } = cache[city] ?? { status: 500, body: { message: `An error occured` } };

	return {
		headers: { "Cache-Control": `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}` },
		body: data,
	};
};

export type { City, WeatherAPIRespone };
