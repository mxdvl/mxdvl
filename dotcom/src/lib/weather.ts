import type { Lang } from "./lang";

const cities = ["london", "montreal", "tokyo", "paris", "berlin"] as const;
type City = typeof cities[number];
const isValidCity = (city: unknown): city is City =>
	typeof city === "string" &&
	// @ts-expect-error -- this is a type predicate
	cities.includes(city);

/**
 * From https://openweathermap.org/current#current_JSON
 */
type WeatherAPIResponse = {
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
	message?: string;
};

/** Get weather from OpenWeatherMap
 * @see https://openweathermap.org/current
 */
const getWeather = async (city: City): Promise<WeatherAPIResponse | undefined> => {
	if (!isValidCity(city)) return undefined;

	const url = new URL("https://api.openweathermap.org/data/2.5/weather");
	url.searchParams.set("q", city);
	url.searchParams.set("appid", String(process.env.WEATHER_API));

	return fetch(url.toString()).then((r) => r.json());
};

/**
 * Get condition as adjective. Works in fr
 *
 * @see https://openweathermap.org/weather-conditions
 */
const getCondition = (id: number, lang: Lang) => {
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

export { getWeather, getCondition };

export type { City, WeatherAPIResponse };
