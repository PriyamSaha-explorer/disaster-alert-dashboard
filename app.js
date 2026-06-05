document.addEventListener("DOMContentLoaded", () => {

    const weatherCard = document.getElementById("weatherCard");

    weatherCard.innerHTML = `
        <h2>🌍 Live Weather</h2>
        <p>Detecting location...</p>
    `;

    if (!navigator.geolocation) {
        weatherCard.innerHTML =
            "<div class='weather-error'>Geolocation not supported.</div>";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`
                );

                const data = await response.json();

                const temp = data.current.temperature_2m;
                const wind = data.current.wind_speed_10m;

                weatherCard.innerHTML = `
                    <div class="location-display">
                        📍 Latitude: ${lat.toFixed(2)},
                        Longitude: ${lon.toFixed(2)}
                    </div>

                    <div class="weather-grid">
                        <div class="weather-item">
                            <div class="weather-label">Temperature</div>
                            <div class="weather-value">${temp}</div>
                            <div class="weather-unit">°C</div>
                        </div>

                        <div class="weather-item">
                            <div class="weather-label">Wind Speed</div>
                            <div class="weather-value">${wind}</div>
                            <div class="weather-unit">km/h</div>
                        </div>
                    </div>
                `;

                document.getElementById("lastUpdate").textContent =
                    "Last updated: " + new Date().toLocaleTimeString();

            } catch (error) {
                weatherCard.innerHTML =
                    "<div class='weather-error'>Failed to load weather data.</div>";

                console.error(error);
            }
        },
        () => {
            weatherCard.innerHTML =
                "<div class='weather-error'>Location access denied.</div>";
        }
    );
});