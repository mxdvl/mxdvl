import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const cities = ["london", "montreal", "tokyo", "paris", "berlin"] as const;
type City = typeof cities[number];

type WeatherAPIRespone = {
	coord: {
		lat: number;
		lon: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	};
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

export default async (request: VercelRequest, response: VercelResponse) => {
	const now = Math.round(new Date().getTime() / 1_000);
	const { city } = request.query;

	if (!isValidCity(city)) {
		response.status(404).json({ error: `I never lived in ${city}` });
		return;
	}

	if (cache[city]?.expire ?? 0 < now) {
		const url = new URL("https://api.openweathermap.org/data/2.5/weather");
		url.searchParams.set("q", city);
		url.searchParams.set("appid", String(process.env.WEATHER_API));

		// @ts-expect-error -- let’s assume the API works ;)
		const data: WeatherAPIRespone = await fetch(url.toString()).then((r) => r.json());

		cache[city] = {
			expire: now + SERVER_EXPIRE,
			data,
		};
	}
	const { data } = cache[city] ?? { data: undefined };

	response.setHeader("Cache-Control", `public, maxage=${CLIENT_EXPIRE}, s-maxage=${SERVER_EXPIRE}`);

	const body = {
		name: city,
		date: new Date().toISOString(),
		data,
	};

	response.status(200).json(body);
};

export type { City, WeatherData };
