document.addEventListener("DOMContentLoaded", () => {

    const weatherCard = document.getElementById("weatherCard");
    const alertsContainer = document.getElementById("alertsContainer");
    const reasoningContent = document.getElementById("reasoningContent");
    const actionsContent = document.getElementById("actionsContent");

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

                // ALERT GENERATION

                const alerts = [];

                if (temp >= 40) {
                    alerts.push({
                        type: "🔥 Heatwave",
                        severity: "high",
                        reason: "Temperature exceeded 40°C"
                    });
                }

                if (wind >= 50) {
                    alerts.push({
                        type: "⛈️ Storm",
                        severity: "high",
                        reason: "Wind speed exceeded 50 km/h"
                    });
                }

                if (alerts.length === 0) {
                    alerts.push({
                        type: "✅ Normal Conditions",
                        severity: "low",
                        reason: "No major disaster indicators detected"
                    });
                }

                // SUMMARY CARDS

                document.getElementById("criticalCount").textContent =
                    alerts.filter(a => a.severity === "critical").length;

                document.getElementById("highCount").textContent =
                    alerts.filter(a => a.severity === "high").length;

                document.getElementById("mediumCount").textContent =
                    alerts.filter(a => a.severity === "medium").length;

                document.getElementById("lowCount").textContent =
                    alerts.filter(a => a.severity === "low").length;

                document.getElementById("alertCountBadge").textContent =
                    alerts.length;

                // RECENT ALERTS PANEL

                alertsContainer.innerHTML = "";

                alerts.forEach((alert, index) => {

                    const alertDiv = document.createElement("div");

                    alertDiv.className = "alert-item";

                    alertDiv.innerHTML = `
                        <div class="alert-header">
                            <div class="alert-type">${alert.type}</div>
                        </div>

                        <div class="alert-location">
                            Current Location
                        </div>

                        <div class="alert-time">
                            Just now
                        </div>
                    `;

                    alertDiv.addEventListener("click", () => {

                        reasoningContent.innerHTML = `
                            <div class="reasoning-section">
                                <div class="reasoning-label">
                                    AI Risk Analysis
                                </div>

                                <div class="reasoning-value">
                                    ${alert.reason}
                                </div>
                            </div>

                            <div class="reasoning-section">
                                <div class="reasoning-label">
                                    Risk Level
                                </div>

                                <div class="risk-level ${alert.severity}">
                                    ${alert.severity.toUpperCase()}
                                </div>
                            </div>
                        `;

                        actionsContent.innerHTML = `
                            <ul class="actions-list">
                                <li class="action-item">
                                    Monitor local weather updates
                                </li>

                                <li class="action-item">
                                    Keep emergency supplies ready
                                </li>

                                <li class="action-item">
                                    Follow local authority advisories
                                </li>

                                <li class="action-item">
                                    Stay connected to emergency alerts
                                </li>
                            </ul>
                        `;
                    });

                    alertsContainer.appendChild(alertDiv);

                    if (index === 0) {
                        alertDiv.click();
                    }
                });

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
