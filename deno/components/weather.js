import { z } from "npm:zod";

const cities = /** @type {const} */ ([
	"london",
	"montreal",
	"tokyo",
	"paris",
	"berlin",
]);

/** @typedef {(typeof cities)[number]} City */

/** @type {(city: unknown) => city is City} */
const isValidCity = (city) => typeof city === "string" && cities.map(String).includes(city);

const weatherAPIResponseSchema = z.object({
	coord: z.object({
		lat: z.number(),
		lon: z.number(),
	}),
	weather: z.array(
		z.object({
			id: z.number(),
			main: z.string(),
			description: z.string(),
			icon: z.string(),
		}),
	),
	main: z.object({
		temp: z.number(),
		feels_like: z.number(),
		temp_min: z.number(),
		temp_max: z.number(),
		pressure: z.number(),
		humidity: z.number(),
	}),
	visibility: z.number(),
	wind: z.object({
		speed: z.number(),
		deg: z.number(),
	}),
	clouds: z.object({
		all: z.number(),
	}),
	dt: z.number(),
	sys: z.object({
		type: z.number(),
		id: z.number(),
		country: z.string(),
		sunrise: z.number(),
		sunset: z.number(),
	}),
	timezone: z.number(),
	id: z.number(),
	name: z.string(),
	cod: z.number(),
	message: z.string().optional(),
});

/** Get weather from OpenWeatherMap
 * @see https://openweathermap.org/current
 * @param {City} city
 * @param {string | undefined} api_key
 * @returns {Promise<z.infer<typeof weatherAPIResponseSchema> | undefined>}
 */
const getWeather = async (city, api_key) => {
	if (!isValidCity(city)) return undefined;
	if (!api_key) return undefined;

	const url = new URL(
		`https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams({
			q: city,
			appid: api_key,
		})}`,
	);

	/** @type {unknown} */
	const data = await fetch(url.toString())
		.then((r) => r.json())
		.catch(() => undefined);

	const result = weatherAPIResponseSchema.safeParse(data);

	return result.success ? result.data : undefined;
};

/**
 * Get condition as adjective. Works in fr
 * @see https://openweathermap.org/weather-conditions
 * @param {number} id
 * @param {import("./lang.js").Lang} lang
 */
const getCondition = (id, lang) => {
	const fr = lang === "fr";
	switch (`${Math.floor(id / 100)}xx`) {
		case "2xx": // Thunderstorm
			return fr ? "orageuse" : "stormy";
		case "3xx": // Drizzle
			return fr ? "bruineuse" : "drizzly";
		case "5xx": // Rain
			return fr ? "pluvieuse" : "rainy";
		case "6xx": // Snow
			return fr ? "enneigée" : "snowy";
		case "7xx": // Atmosphere
			return fr ? "embrumée" : "foggy";
		case "8xx": // Clear / Clouds
			if (id <= 802) return fr ? "ensoleillée" : "sunny";
		// fall through
		default:
			return fr ? "nuageuse" : "cloudy";
	}
};

export { getCondition, getWeather };
