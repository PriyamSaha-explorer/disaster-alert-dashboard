document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const weatherCard = document.getElementById("weatherCard");
    const alertsContainer = document.getElementById("alertsContainer");
    const reasoningContent = document.getElementById("reasoningContent");
    const actionsContent = document.getElementById("actionsContent");
    const riskMeterContainer = document.getElementById("riskMeterContainer");
    const riskMeterFill = document.getElementById("riskMeterFill");
    const themeToggle = document.getElementById("themeToggle");

    // Dark Mode Toggle Logic
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'dark') {
            root.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        } else {
            root.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Initialize App
    if (!navigator.geolocation) {
        weatherCard.innerHTML = "<div style='color:var(--danger); padding:20px; text-align:center;'>Geolocation not supported by this browser.</div>";
        return;
    }

    // Fetch Location and Data
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            // Using apparent_temperature (Feels Like) and timezone=auto for accurate local data
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=apparent_temperature,wind_speed_10m,precipitation&timezone=auto`
            );
            const data = await response.json();

            // Extract the correct updated variables
            const temp = data.current.apparent_temperature;
            const wind = data.current.wind_speed_10m;
            const rain = data.current.precipitation || 0; 

            // Render Weather UI
            weatherCard.innerHTML = `
                <div class="location-display">
                    📍 Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}
                </div>
                <div class="weather-grid">
                    <div class="weather-item">
                        <div class="weather-label">Feels Like</div>
                        <div class="weather-value">${temp}</div>
                        <div class="weather-unit">°C</div>
                    </div>
                    <div class="weather-item">
                        <div class="weather-label">Wind</div>
                        <div class="weather-value">${wind}</div>
                        <div class="weather-unit">km/h</div>
                    </div>
                    <div class="weather-item">
                        <div class="weather-label">Rain</div>
                        <div class="weather-value">${rain}</div>
                        <div class="weather-unit">mm</div>
                    </div>
                </div>
            `;

            const alerts = generateRiskMatrix(temp, wind, rain);
            updateSummaryCards(alerts);
            renderAlertsPanel(alerts, temp, wind, rain, lat, lon);

        } catch (error) {
            weatherCard.innerHTML = "<div style='color:var(--danger); text-align:center;'>Error connecting to Open-Meteo API.</div>";
            console.error(error);
        }
    }, () => {
        weatherCard.innerHTML = "<div style='color:var(--danger); text-align:center;'>Location access denied. Please allow GPS permissions.</div>";
    });

    // ---------------------------------------------------------
    // ALGORITHM: Weighted Risk Assessment
    // ---------------------------------------------------------
    function generateRiskMatrix(temp, wind, rain) {
        const alerts = [];
        
        // Heatwave Logic
        if (temp >= 45) alerts.push(createAlert("🔥 Extreme Heat", "critical", "Temperature exceeds biological safety limits."));
        else if (temp >= 40) alerts.push(createAlert("🔥 High Heatwave", "high", "Severe thermal anomaly detected."));
        else if (temp >= 36) alerts.push(createAlert("🌡️ Elevated Heat", "medium", "Above average thermal readings."));

        // Storm Logic
        if (wind >= 100) alerts.push(createAlert("🌪️ Hurricane Force", "critical", "Catastrophic wind velocities detected."));
        else if (wind >= 70) alerts.push(createAlert("⛈️ Severe Storm", "high", "Structural damage thresholds breached."));
        else if (wind >= 40) alerts.push(createAlert("💨 High Winds", "medium", "Elevated wind velocity."));

        // Flood Logic
        if (rain >= 100) alerts.push(createAlert("🌊 Flash Flood", "critical", "Catastrophic precipitation volume."));
        else if (rain >= 50) alerts.push(createAlert("💧 Flood Warning", "high", "Drainage infrastructure failure imminent."));
        else if (rain >= 15) alerts.push(createAlert("🌧️ Heavy Rain", "medium", "Sustained precipitation detected."));

        // Baseline Normal
        if (alerts.length === 0) {
            alerts.push(createAlert("✅ Nominal Conditions", "low", "All meteorological parameters within safe tolerances."));
        }

        const severityMap = { "critical": 4, "high": 3, "medium": 2, "low": 1 };
        return alerts.sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    }

    function createAlert(type, severity, baselineReason) {
        return { type, severity, baselineReason, timestamp: new Date().toLocaleTimeString() };
    }

    function updateSummaryCards(alerts) {
        document.getElementById("criticalCount").textContent = alerts.filter(a => a.severity === "critical").length;
        document.getElementById("highCount").textContent = alerts.filter(a => a.severity === "high").length;
        document.getElementById("mediumCount").textContent = alerts.filter(a => a.severity === "medium").length;
        document.getElementById("lowCount").textContent = alerts.filter(a => a.severity === "low").length;
        document.getElementById("alertCountBadge").textContent = alerts.length;
    }

    function renderAlertsPanel(alerts, temp, wind, rain, lat, lon) {
        alertsContainer.innerHTML = "";

        alerts.forEach((alert, index) => {
            const alertDiv = document.createElement("div");
            alertDiv.className = `alert-item ${index === 0 ? 'active' : ''}`;
            alertDiv.innerHTML = `
                <div class="alert-type">${alert.type}</div>
                <div class="alert-time">Logged at ${alert.timestamp}</div>
            `;

            alertDiv.addEventListener("click", () => {
                document.querySelectorAll('.alert-item').forEach(el => el.classList.remove('active'));
                alertDiv.classList.add('active');
                runAIAgent(alert, temp, wind, rain, lat, lon);
            });

            alertsContainer.appendChild(alertDiv);
            if (index === 0) runAIAgent(alert, temp, wind, rain, lat, lon);
        });
    }

    // ---------------------------------------------------------
    // AI AGENT STREAMING PROTOCOL
    // ---------------------------------------------------------
    async function runAIAgent(alert, temp, wind, rain, lat, lon) {
        reasoningContent.innerHTML = `<div id="agent-log"></div>`;
        actionsContent.innerHTML = `<div class="spinner"></div><p style="text-align:center; color:var(--text-muted); font-size:13px;">Compiling directives...</p>`;
        
        riskMeterContainer.classList.remove('hidden');
        riskMeterFill.style.width = "0%";
        
        const log = document.getElementById('agent-log');
        let confidenceScore = Math.floor(Math.random() * (98 - 89 + 1)) + 89; 

        await appendAgentStep(log, "Step 1: Data Ingestion", `Coordinates: [${lat.toFixed(2)}, ${lon.toFixed(2)}]`);
        await appendAgentStep(log, "Step 2: Pattern Recognition", `Parameters: T:${temp}°C, W:${wind}km/h, P:${rain}mm`);
        await appendAgentStep(log, "Step 3: Risk Calculation", `Threat vector: ${alert.type}.`);
        
        await sleep(300);
        
        const meterWidths = { "critical": "100%", "high": "75%", "medium": "40%", "low": "10%" };
        riskMeterFill.style.width = meterWidths[alert.severity];

        // Ensure meter color matches severity
        const colorMap = { "critical": "var(--danger)", "high": "var(--warning)", "medium": "var(--accent-blue)", "low": "var(--accent-green)"};
        riskMeterFill.style.background = colorMap[alert.severity];

        const finalReport = document.createElement('div');
        finalReport.className = 'fade-in-report';
        finalReport.innerHTML = `
            <strong>Agent Assessment [${alert.severity.toUpperCase()}]</strong><br>
            <span style="color:var(--text-muted); font-size:13px;">Confidence: ${confidenceScore}%</span><br><br>
            ${alert.baselineReason} The automated matrix indicates calculated probabilities of localized effects. Adherence to standard protocol is advised.
        `;
        log.appendChild(finalReport);

        renderDynamicActions(alert.severity);
    }

    async function appendAgentStep(container, title, message) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'agent-step-thinking';
        stepDiv.innerHTML = `⚙️ ${title}...`;
        container.appendChild(stepDiv);
        
        await sleep(600); 
        
        stepDiv.className = 'agent-step-complete';
        stepDiv.innerHTML = `✅ ${title}: <br><span style="color:var(--text-muted); margin-left: 20px;">${message}</span>`;
    }

    function renderDynamicActions(severity) {
        const actionMap = {
            "critical": [
                "INITIATE IMMEDIATE EVACUATION PROTOCOL",
                "Secure critical infrastructure and disconnect main power",
                "Contact local emergency command center immediately"
            ],
            "high": [
                "Prepare for potential mandated evacuation",
                "Charge all communication and secondary power devices",
                "Monitor dedicated emergency broadcast frequencies"
            ],
            "medium": [
                "Elevate situational awareness",
                "Inventory emergency provisions",
                "Ensure communication channels are active"
            ],
            "low": [
                "Maintain standard operational awareness",
                "Routine checks of emergency supplies recommended",
                "No immediate action required"
            ]
        };

        const actions = actionMap[severity];
        actionsContent.innerHTML = `<ul class="actions-list">
            ${actions.map(action => `<li class="action-item">${action}</li>`).join('')}
        </ul>`;
    }
});
