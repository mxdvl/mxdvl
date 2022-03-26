const cities = ["london", "montreal", "tokyo", "paris", "berlin"] as const;
type City = typeof cities[number];

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

const isValidCity = (city: unknown): city is City => typeof city === "string" && cities.includes(city as City);

export const getWeather = async (city: City): Promise<WeatherAPIResponse | undefined> => {
	if (!isValidCity(city)) return undefined;

	const url = new URL("https://api.openweathermap.org/data/2.5/weather");
	url.searchParams.set("q", city);
	url.searchParams.set("appid", String(process.env.WEATHER_API));

	return fetch(url.toString()).then((r) => r.json());
};

export type { City, WeatherAPIResponse };
