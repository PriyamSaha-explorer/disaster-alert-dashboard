document.addEventListener("DOMContentLoaded", () => {
    // --- 1. OFFLINE SERVICE WORKER REGISTRATION ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Offline Copilot Active'))
            .catch(err => console.log('SW Registration failed', err));
    }

    // Network Status Monitoring
    window.addEventListener('online', () => updateNetworkUI(true));
    window.addEventListener('offline', () => updateNetworkUI(false));
    function updateNetworkUI(isOnline) {
        document.getElementById('networkStatus').style.background = isOnline ? 'var(--safe)' : 'var(--danger)';
        document.getElementById('networkText').textContent = isOnline ? 'Online' : 'Offline Mode';
    }

    // --- 2. MULTILINGUAL DICTIONARY ---
    const i18n = {
        en: { location: "Detected Zone", safetyScore: "Safety Score", emergency: "Local Emergency Routing", sosActive: "EMERGENCY SOS BROADCAST ACTIVE" },
        hi: { location: "पता लगाया गया क्षेत्र", safetyScore: "सुरक्षा स्कोर", emergency: "स्थानीय आपातकालीन मार्ग", sosActive: "आपातकालीन एसओएस सक्रिय" },
        bn: { location: "শনাক্তকৃত অঞ্চল", safetyScore: "নিরাপত্তা স্কোর", emergency: "স্থানীয় জরুরি যোগাযোগ", sosActive: "জরুরী এসওএস সক্রিয়" }
    };

    document.getElementById('langSelect').addEventListener('change', (e) => {
        const lang = e.target.value;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
        });
    });

    // --- 3. DYNAMIC EMERGENCY ROUTING ---
    const EMERGENCY_DB = {
        "IN": { police: "100", fire: "101", ambulance: "108", disaster: "112" },
        "US": { police: "911", fire: "911", ambulance: "911", disaster: "911" },
        "GB": { police: "999", fire: "999", ambulance: "999", disaster: "112" },
        "DEFAULT": { police: "112", fire: "112", ambulance: "112", disaster: "112" }
    };

    // --- 4. LEAFLET MAP & LOCATION INIT ---
    let map;
    let userMarker;

    function initMap(lat, lon) {
        if (!map) {
            map = L.map('disasterMap').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            userMarker = L.marker([lat, lon]).addTo(map).bindPopup("Your Location").openPopup();
        } else {
            map.setView([lat, lon], 10);
            userMarker.setLatLng([lat, lon]);
        }
    }

    // Fetch Location & Weather
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        initMap(lat, lon); // Build Live Map

        try {
            // Reverse Geocode for City/Country
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            
            document.getElementById('geoCity').textContent = `${geoData.city || geoData.locality || "Unknown City"}`;
            document.getElementById('geoRegion').textContent = `${geoData.principalSubdivision || "Unknown State"}, ${geoData.countryName || "Unknown Country"}`;

            // Load Country Specific Numbers (Defaults to IN structure if unknown)
            const countryCode = geoData.countryCode || "IN";
            renderEmergencyNumbers(countryCode);

            // Fetch Advanced Weather Matrix
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`);
            const weatherData = await weatherRes.json();
            
            processRiskEngine(weatherData.current, lat, lon);

        } catch (err) {
            console.error(err);
            document.getElementById('geoCity').textContent = "Connection Error";
            renderEmergencyNumbers("IN"); // Safe Fallback
        }
    }, (err) => {
        console.error("GPS Denied", err);
        document.getElementById('geoCity').textContent = "GPS Denied";
        renderEmergencyNumbers("IN");
    });

    function renderEmergencyNumbers(code) {
        const numbers = EMERGENCY_DB[code] || EMERGENCY_DB["DEFAULT"];
        document.getElementById('emergencyGrid').innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3);">
                🚨 Disaster/General: <strong style="font-size: 18px; float: right;">${numbers.disaster}</strong>
            </div>
            <div style="background: rgba(59, 130, 246, 0.2); padding: 15px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                🚓 Police: <strong style="font-size: 18px; float: right;">${numbers.police}</strong>
            </div>
            <div style="background: rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                🚑 Ambulance: <strong style="font-size: 18px; float: right;">${numbers.ambulance}</strong>
            </div>
            <div style="background: rgba(245, 158, 11, 0.2); padding: 15px; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.3);">
                🔥 Fire: <strong style="font-size: 18px; float: right;">${numbers.fire}</strong>
            </div>
        `;
    }

    // --- 5. AI RISK ENGINE & WARNING SYSTEM ---
    function processRiskEngine(w, lat, lon) {
        const alerts = [];
        let totalRisk = 0;

        // Flood Prediction Matrix
        if (w.precipitation > 50) {
            alerts.push({ type: "🌊 Flash Flood Risk", severity: "critical", msg: "Severe precipitation detected. Infrastructure flooding imminent." });
            totalRisk += 40;
            if(map) L.circle([lat, lon], {color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.4, radius: 5000}).addTo(map);
        }

        // Heatwave + Humidity Matrix
        if (w.temperature_2m > 40 && w.relative_humidity_2m > 60) {
            alerts.push({ type: "🔥 Wet-Bulb Heatwave", severity: "critical", msg: "Lethal combination of heat and humidity detected." });
            totalRisk += 45;
            if(map) L.circle([lat, lon], {color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, radius: 8000}).addTo(map);
        } else if (w.temperature_2m > 35) {
            alerts.push({ type: "🌡️ High Heat Alert", severity: "medium", msg: "Elevated thermal conditions. Hydration advised." });
            totalRisk += 20;
        }

        if (w.wind_speed_10m > 60) {
            alerts.push({ type: "🌪️ Severe Storm", severity: "high", msg: "Damaging wind speeds detected. Secure loose items." });
            totalRisk += 30;
        }

        if (alerts.length === 0) {
            alerts.push({ type: "✅ Optimal Conditions", severity: "low", msg: "All local telemetry nominal. No immediate threats." });
            totalRisk = 5;
        }

        // Generate Disaster Readiness Score
        const safetyScore = Math.max(0, 100 - totalRisk);
        document.getElementById('safetyScoreTxt').textContent = `${safetyScore}`;
        
        // Update the circular gradient ring color based on score
        const ringColor = safetyScore > 80 ? 'var(--safe)' : safetyScore > 50 ? 'var(--warning)' : 'var(--danger)';
        document.getElementById('safetyScoreRing').style.background = `conic-gradient(${ringColor} ${safetyScore}%, var(--glass-border) 0)`;

        // Render Alerts & Audio/Vibration
        renderAlerts(alerts);
        triggerHardwareWarnings(alerts[0].severity);
    }

    function renderAlerts(alerts) {
        const container = document.getElementById('alertsContainer');
        container.innerHTML = alerts.map(a => `
            <div class="alert-item" style="border-left-color: ${a.severity === 'critical' ? 'var(--danger)' : a.severity === 'high' ? 'var(--warning)' : 'var(--safe)'}">
                <strong>${a.type}</strong><br>
                <span style="font-size:13px; color: var(--text-muted);">${a.msg}</span>
            </div>
        `).join('');
        
        // Copilot Output
        document.getElementById('reasoningContent').innerHTML = `
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; border-left: 4px solid var(--accent);">
                <p style="font-size: 12px; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; font-weight: 800;">Copilot Diagnostic:</p>
                <p style="font-size: 15px; line-height: 1.5;">${alerts[0].msg} Local environmental factors are being continuously monitored against structural safety thresholds.</p>
            </div>
        `;
    }

    // --- 6. HARDWARE WARNINGS (Audio & Vibration) ---
    function triggerHardwareWarnings(severity) {
        if (severity === 'critical') {
            // Vibrate pattern: SOS (... --- ...) - works on Android Chrome
            if (navigator.vibrate) navigator.vibrate([100,30,100,30,100,200,300,30,300,30,300,200,100,30,100,30,100]);
        }
    }

    // --- 7. SOS EMERGENCY MODE ---
    document.getElementById('sosBtn').addEventListener('click', () => {
        document.body.classList.toggle('emergency-mode-active');
        
        const audio = document.getElementById('sirenAudio');
        const lang = document.getElementById('langSelect').value;
        const activeText = i18n[lang].sosActive || i18n['en'].sosActive;

        if (document.body.classList.contains('emergency-mode-active')) {
            audio.play().catch(e => console.log("Audio play requires user interaction."));
            if (navigator.vibrate) navigator.vibrate([1000, 500, 1000, 500, 1000]); // Heavy pulse
            
            document.getElementById('reasoningContent').innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.2); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid var(--danger);">
                    <h2 style="color: white; margin-bottom: 10px;">⚠️ ${activeText}</h2>
                    <p>Broadcasting to local authorities...</p>
                </div>
            `;
        } else {
            audio.pause();
            audio.currentTime = 0;
            if (navigator.vibrate) navigator.vibrate(0); // Stop vibration
            // Let the next refresh cycle reset the reasoning UI
            document.getElementById('reasoningContent').innerHTML = "Canceling SOS Broadcast... resetting UI.";
        }
    });
});
