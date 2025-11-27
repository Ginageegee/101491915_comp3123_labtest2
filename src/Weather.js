import React, { useState } from "react";
import axios from "axios";

function Weather() {
    const [city, setCity] = useState("Toronto"); // Default city for initial load
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const fetchWeather = async () => {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
            setError("Please enter a city name.");
            setWeather(null);
            return;
        }

        try {
            const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
            if (!apiKey) {
                throw new Error("Missing API key");
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            setWeather(response.data);
            setError("");
        } catch (err) {
            if (err.response?.status === 404) {
                setError("City not found.");
            } else {
                setError("API error.");
            }
            setWeather(null);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Weather App</h1>

            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                style={{ padding: "8px", marginRight: "8px", width: "200px" }}
            />
            <button onClick={fetchWeather} style={{ padding: "8px 12px" }}>
                Search
            </button>

            {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}

            {weather && (
                <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "16px", borderRadius: "8px" }}>
                    <h2>
                        {weather.name}, {weather.sys?.country}
                    </h2>
                    <p>Temperature: {weather.main?.temp} °C</p>
                    <p>Feels like: {weather.main?.feels_like} °C</p>
                    <p>Condition: {weather.weather?.[0]?.description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                        alt="weather icon"
                    />
                </div>
            )}
        </div>
    );
}

export default Weather;