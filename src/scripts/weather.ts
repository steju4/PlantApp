import { fetchWeatherApi } from "openmeteo";

const params = {
    latitude: 47.664833690601334,
    longitude: 9.447399647524247,
    hourly: ["temperature_2m", "rain", "relative_humidity_2m", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm", "soil_moisture_9_to_27cm"],
    forecast_days: 1,
};
const url = "https://api.open-meteo.com/v1/forecast";

(async () => {
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const latitude = response.latitude();
    // const longitude = response.longitude();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            rain: hourly.variables(1)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(2)!.valuesArray()!,
            soilMoisture1To3cm: hourly.variables(3)!.valuesArray()!,
            soilMoisture3To9cm: hourly.variables(4)!.valuesArray()!,
            soilMoisture9To27cm: hourly.variables(5)!.valuesArray()!,
        },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i],
            "MARKER",weatherData.hourly.rain[i],
            weatherData.hourly.relativeHumidity2m[i],
            weatherData.hourly.soilMoisture1To3cm[i],
            weatherData.hourly.soilMoisture3To9cm[i],
            weatherData.hourly.soilMoisture9To27cm[i]
        );
    }
    console.log("hello world");
})();
