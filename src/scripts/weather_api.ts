// scripts/weather_api.ts

const OPENWEATHER_API_KEY = "7124aa5c248a83f67f5d34bf50443ba5";

export interface WeatherData {
    cityName: string;
    temp: number;
    humidity: number;
    rainProb: number;
    weatherDescription: string;
}

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=de`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rainProb = data.rain ? (data.rain["1h"] || 0) : 0;

    return {
        cityName: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        rainProb,
        weatherDescription: data.weather[0]?.description || "unbekannt",
    };
};
