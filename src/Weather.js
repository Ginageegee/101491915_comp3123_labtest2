import React, { useState } from "react";
import axios from "axios";

function Weather() {
    const [city, setCity] = useState("Toronto");
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
        <div
            style={{
                padding: "20px",
                fontFamily: "Poppins, sans-serif",
                background: "linear-gradient(to right, #83a4d4, #b6fbff)",
                minHeight: "100vh",
                color: "#333",
            }}
        >
            <h1 style={{ textAlign: "center", color: "#fff" }}>Weather App</h1>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                    style={{
                        padding: "10px",
                        marginRight: "8px",
                        width: "220px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    onClick={fetchWeather}
                    style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#4a90e2",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {error && (
                <p style={{ color: "red", marginTop: "12px", textAlign: "center" }}>
                    {error}
                </p>
            )}

            {weather && (
                <div
                    style={{
                        marginTop: "30px",
                        background: "#ffffffcc",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        maxWidth: "400px",
                        margin: "30px auto",
                        textAlign: "center",
                        transition: "transform 0.3s ease",
                    }}
                    className="weather-card"
                >
                    <h2>
                        {weather.name}, {weather.sys?.country}
                    </h2>
                    <p style={{ fontSize: "18px", margin: "8px 0" }}>
                        🌡 Temperature: {weather.main?.temp} °C
                    </p>
                    <p style={{ fontSize: "16px", margin: "8px 0" }}>
                        🤔 Feels like: {weather.main?.feels_like} °C
                    </p>
                    <p style={{ fontSize: "16px", margin: "8px 0", textTransform: "capitalize" }}>
                        🌤 Condition: {weather.weather?.[0]?.description}
                    </p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                        alt="weather icon"
                        style={{ marginTop: "10px" }}
                    />
                </div>
            )}
        </div>
    );
}

export default Weather;