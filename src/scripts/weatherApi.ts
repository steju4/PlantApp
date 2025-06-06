// scripts/weatherApi.ts

// API-Schlüssel für den Zugriff auf OpenWeatherMap-Daten
const OPENWEATHER_API_KEY = "7124aa5c248a83f67f5d34bf50443ba5";

// Interface definiert die erwarteten Wetterdaten-Struktur
export interface WeatherData {
    cityName: string;           // Name der Stadt
    temp: number;               // Temperatur in Grad Celsius
    humidity: number;           // Luftfeuchtigkeit in Prozent
    rainProb: number;           // Regenwahrscheinlichkeit in mm für die letzte Stunde
    weatherDescription: string; // Beschreibung des Wetters (z.B. "clear sky")
}

// Asynchrone Funktion zum Abrufen der Wetterdaten für eine gegebene Stadt
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
    // API-Request an OpenWeatherMap mit URL-enkodiertem Stadtnamen, API-Key, metrischen Einheiten und englischer Sprache
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=en`
    );

    // Fehlerbehandlung: Wenn die Antwort nicht ok ist, wird ein Fehler geworfen
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Antwort im JSON-Format parsen
    const data = await response.json();

    // Prüfen, ob Regeninformationen vorhanden sind, sonst 0 als Standardwert
    const rainProb = data.rain ? (data.rain["1h"] || 0) : 0;

    // Rückgabe eines Objekts mit den benötigten Wetterdaten
    return {
        cityName: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        rainProb,
        weatherDescription: data.weather[0]?.description || "unbekannt",
    };
};
