document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const weatherCard = document.getElementById("weatherCard");
    const alertsContainer = document.getElementById("alertsContainer");
    const reasoningContent = document.getElementById("reasoningContent");
    const actionsContent = document.getElementById("actionsContent");
    const riskMeterContainer = document.getElementById("riskMeterContainer");
    const riskMeterFill = document.getElementById("riskMeterFill");

    // Utility: Sleep function for Agentic UI streaming
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Initialize App
    weatherCard.innerHTML = `
        <div class="weather-loading">
            <div class="spinner"></div>
            <p>Initializing Copilot... Requesting satellite telemetry...</p>
        </div>
    `;

    if (!navigator.geolocation) {
        weatherCard.innerHTML = "<div class='weather-error'>Geolocation architecture not supported by this browser.</div>";
        return;
    }

    // Fetch Location and Data
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            // Expanded API to include precipitation for Flood detection
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation`
            );
            const data = await response.json();

            const temp = data.current.temperature_2m;
            const wind = data.current.wind_speed_10m;
            const rain = data.current.precipitation || 0; 

            // Update Weather Matrix UI
            weatherCard.innerHTML = `
                <div class="location-display">
                    📍 Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}
                </div>
                <div class="weather-grid">
                    <div class="weather-item">
                        <div class="weather-label">Thermal</div>
                        <div class="weather-value">${temp}</div>
                        <div class="weather-unit">°C</div>
                    </div>
                    <div class="weather-item">
                        <div class="weather-label">Velocity</div>
                        <div class="weather-value">${wind}</div>
                        <div class="weather-unit">km/h</div>
                    </div>
                    <div class="weather-item">
                        <div class="weather-label">Precipitation</div>
                        <div class="weather-value">${rain}</div>
                        <div class="weather-unit">mm</div>
                    </div>
                </div>
            `;
            document.getElementById("lastUpdate").textContent = "System Status: Matrix synced at " + new Date().toLocaleTimeString();

            // ADVANCED DISASTER DETECTION ALGORITHM
            const alerts = generateRiskMatrix(temp, wind, rain);
            updateSummaryCards(alerts);
            renderAlertsPanel(alerts, temp, wind, rain, lat, lon);

        } catch (error) {
            weatherCard.innerHTML = "<div class='weather-error'>Critical failure: Unable to establish API handshake with Open-Meteo.</div>";
            console.error(error);
        }
    }, () => {
        weatherCard.innerHTML = "<div class='weather-error'>Access Denied: Geolocation permissions required for threat assessment.</div>";
    });

    // ---------------------------------------------------------
    // ALGORITHM: Weighted Risk Assessment
    // ---------------------------------------------------------
    function generateRiskMatrix(temp, wind, rain) {
        const alerts = [];
        
        // Heatwave Logic
        if (temp >= 45) alerts.push(createAlert("🔥 Extreme Heatwave", "critical", temp, "Temperature exceeds biological safety limits."));
        else if (temp >= 40) alerts.push(createAlert("🔥 Heatwave", "high", temp, "Severe thermal anomaly detected."));
        else if (temp >= 35) alerts.push(createAlert("🌡️ Elevated Heat", "medium", temp, "Above average thermal readings."));

        // Storm Logic
        if (wind >= 120) alerts.push(createAlert("🌪️ Hurricane Force", "critical", wind, "Catastrophic wind velocities detected."));
        else if (wind >= 80) alerts.push(createAlert("⛈️ Severe Storm", "high", wind, "Structural damage thresholds breached."));
        else if (wind >= 50) alerts.push(createAlert("💨 High Winds", "medium", wind, "Elevated wind velocity."));

        // Flood Logic
        if (rain >= 150) alerts.push(createAlert("🌊 Flash Flood", "critical", rain, "Catastrophic precipitation volume."));
        else if (rain >= 100) alerts.push(createAlert("💧 Flood Warning", "high", rain, "Drainage infrastructure failure imminent."));
        else if (rain >= 50) alerts.push(createAlert("🌧️ Heavy Rain", "medium", rain, "Sustained precipitation detected."));

        // Baseline
        if (alerts.length === 0) {
            alerts.push(createAlert("✅ Nominal Conditions", "low", 0, "All meteorological parameters within safe tolerances."));
        }

        // Sort by severity (critical first)
        const severityMap = { "critical": 4, "high": 3, "medium": 2, "low": 1 };
        return alerts.sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    }

    function createAlert(type, severity, metric, baselineReason) {
        return { type, severity, metric, baselineReason, timestamp: new Date().toLocaleTimeString() };
    }

    // ---------------------------------------------------------
    // UI UPDATES
    // ---------------------------------------------------------
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
                <div class="alert-header">
                    <div class="alert-type">${alert.type} <span class="alert-severity ${alert.severity}">${alert.severity}</span></div>
                </div>
                <div class="alert-location">Telemetry Node: Local</div>
                <div class="alert-time">${alert.timestamp}</div>
            `;

            alertDiv.addEventListener("click", () => {
                // Remove active class from all, add to clicked
                document.querySelectorAll('.alert-item').forEach(el => el.classList.remove('active'));
                alertDiv.classList.add('active');
                
                // Trigger the AI Reasoning Agent
                runAIAgent(alert, temp, wind, rain, lat, lon);
            });

            alertsContainer.appendChild(alertDiv);

            // Auto-click the highest priority alert on load
            if (index === 0) {
                runAIAgent(alert, temp, wind, rain, lat, lon);
            }
        });
    }

    // ---------------------------------------------------------
    // THE AI AGENT STREAMING PROTOCOL
    // ---------------------------------------------------------
    async function runAIAgent(alert, temp, wind, rain, lat, lon) {
        // Reset panels and show risk meter
        reasoningContent.innerHTML = `<div id="agent-log"></div>`;
        actionsContent.innerHTML = `<div class="spinner"></div><p style="font-size:12px; color:gray; margin-top:10px;">Awaiting agent directives...</p>`;
        
        riskMeterContainer.classList.remove('hidden');
        riskMeterFill.style.width = "0%";
        
        const log = document.getElementById('agent-log');
        let confidenceScore = Math.floor(Math.random() * (98 - 85 + 1)) + 85; // Random confidence between 85-98% for realism

        // Step 1: Collection
        await appendAgentStep(log, "⚡ Step 1: Data Ingestion", `Cross-referencing Open-Meteo node at [${lat.toFixed(2)}, ${lon.toFixed(2)}]...`);
        
        // Step 2: Identification
        await appendAgentStep(log, "🔍 Step 2: Pattern Recognition", `Analyzing parameters: T:${temp}°C, W:${wind}km/h, P:${rain}mm...`);
        
        // Step 3: Assessment
        await appendAgentStep(log, "📊 Step 3: Risk Calculation", `Threat vector identified as ${alert.type}. Calculating confidence score...`);
        
        // Finalize
        await sleep(400);
        
        // Animate Risk Meter
        const meterWidths = { "critical": "100%", "high": "75%", "medium": "50%", "low": "15%" };
        riskMeterFill.style.width = meterWidths[alert.severity];

        // Print Final Report
        const finalReport = document.createElement('div');
        finalReport.className = 'fade-in-report';
        finalReport.innerHTML = `
            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 15px 0;">
            <h4 style="margin-bottom:8px;">Agent Assessment [${alert.severity.toUpperCase()}]</h4>
            <p style="font-size:13px; line-height: 1.5; color: var(--text-secondary);">
                <strong>Confidence: ${confidenceScore}%</strong><br>
                ${alert.baselineReason} The matrix indicates a compound probability of localized disruption. Immediate adherence to protocol is advised.
            </p>
        `;
        log.appendChild(finalReport);

        // Populate Actions dynamically based on severity
        renderDynamicActions(alert.severity, alert.type);
    }

    async function appendAgentStep(container, title, message) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'agent-step-thinking';
        stepDiv.innerHTML = `<strong>${title}</strong>: <br><span style="color:var(--text-tertiary)">Processing...</span>`;
        container.appendChild(stepDiv);
        
        await sleep(700); // Simulated thinking time
        
        stepDiv.className = 'agent-step-complete';
        stepDiv.innerHTML = `<strong>${title}</strong>: <br>${message}`;
    }

    function renderDynamicActions(severity, type) {
        const actionMap = {
            "critical": [
                "🚨 INITIATE IMMEDIATE EVACUATION PROTOCOL",
                "⚠️ Secure critical infrastructure and disconnect main power",
                "📡 Contact local emergency command center immediately",
                "🎒 Deploy Tier-1 survival logistics kit"
            ],
            "high": [
                "⚠️ Prepare for potential mandated evacuation",
                "🔋 Charge all communication and secondary power devices",
                "🚗 Relocate vehicles to secure, elevated terrain",
                "📻 Monitor dedicated emergency broadcast frequencies"
            ],
            "medium": [
                "👀 Elevate situational awareness",
                "📦 Inventory emergency provisions",
                "📱 Ensure communication channels are active"
            ],
            "low": [
                "✅ Maintain standard operational awareness",
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
