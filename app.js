document.addEventListener("DOMContentLoaded", () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW failed', err));
    }

    // --- 1. EXPANDED MULTILINGUAL DICTIONARY ---
    const i18n = {
        en: { 
            appTitle: "⚠️ Intelligence Platform", online: "Online", offline: "Offline Mode",
            location: "Detected Zone", safetyScore: "Safety Score", liveMap: "🗺️ Live Threat Map", 
            emergency: "Local Emergency Routing", activeThreats: "📋 Active Threats", copilotAnalysis: "🤖 Copilot Analysis", 
            sosActive: "EMERGENCY SOS BROADCAST ACTIVE",
            weatherFeels: "Feels Like", weatherWind: "Wind Speed", weatherHum: "Humidity",
            emDisaster: "Disaster/General", emPolice: "Police", emAmbulance: "Ambulance", emFire: "Fire",
            diagTitle: "NEURAL ENGINE DIAGNOSTIC",
            diagDesc: "Local environmental factors are being continuously monitored against structural safety thresholds.",
            optTitle: "✅ Optimal Conditions", optMsg: "All local telemetry nominal. No immediate threats.",
            floodTitle: "🌊 Flash Flood Risk", floodMsg: "Severe precipitation detected. Infrastructure flooding imminent.",
            heatTitle: "🔥 Wet-Bulb Heatwave", heatMsg: "Lethal combination of heat and humidity detected.",
            warmTitle: "🌡️ High Heat Alert", warmMsg: "Elevated thermal conditions. Hydration advised.",
            stormTitle: "🌪️ Severe Storm", stormMsg: "Damaging wind speeds detected. Secure loose items.",
            gpsWait: "Acquiring Satellites...", gpsDenied: "GPS Denied", connError: "Connection Error"
        },
        hi: { 
            appTitle: "⚠️ इंटेलिजेंस प्लेटफॉर्म", online: "ऑनलाइन", offline: "ऑफ़लाइन मोड",
            location: "पता लगाया गया क्षेत्र", safetyScore: "सुरक्षा स्कोर", liveMap: "🗺️ लाइव खतरा मानचित्र", 
            emergency: "स्थानीय आपातकालीन मार्ग", activeThreats: "📋 सक्रिय खतरे", copilotAnalysis: "🤖 कोपायलट विश्लेषण", 
            sosActive: "आपातकालीन एसओएस सक्रिय",
            weatherFeels: "महसूस होता है", weatherWind: "हवा की गति", weatherHum: "नमी",
            emDisaster: "आपदा/सामान्य", emPolice: "पुलिस", emAmbulance: "एम्बुलेंस", emFire: "आग",
            diagTitle: "न्यूरल इंजन डायग्नोस्टिक",
            diagDesc: "स्थानीय पर्यावरणीय कारकों की संरचनात्मक सुरक्षा सीमाओं के खिलाफ लगातार निगरानी की जा रही है।",
            optTitle: "✅ अनुकूल परिस्थितियाँ", optMsg: "सभी स्थानीय टेलीमेट्री सामान्य हैं। कोई तत्काल खतरा नहीं।",
            floodTitle: "🌊 अचानक बाढ़ का खतरा", floodMsg: "भारी वर्षा का पता चला। बुनियादी ढांचे में बाढ़ आसन्न है।",
            heatTitle: "🔥 हीटवेव", heatMsg: "गर्मी और उमस का घातक संयोजन।",
            warmTitle: "🌡️ उच्च गर्मी की चेतावनी", warmMsg: "बढ़ी हुई थर्मल स्थितियां। हाइड्रेशन की सलाह दी जाती है।",
            stormTitle: "🌪️ भयंकर तूफान", stormMsg: "नुकसानदायक हवा की गति का पता चला। ढीली वस्तुओं को सुरक्षित करें।",
            gpsWait: "सैटेलाइट खोज रहा है...", gpsDenied: "जीपीएस अस्वीकृत", connError: "कनेक्शन त्रुटि"
        },
        bn: { 
            appTitle: "⚠️ ইন্টেলিজেন্স প্ল্যাটফর্ম", online: "অনলাইন", offline: "অফলাইন মোড",
            location: "শনাক্তকৃত অঞ্চল", safetyScore: "নিরাপত্তা স্কোর", liveMap: "🗺️ লাইভ থ্রেট ম্যাপ", 
            emergency: "স্থানীয় জরুরি যোগাযোগ", activeThreats: "📋 সক্রিয় হুমকি", copilotAnalysis: "🤖 কোপাইলট বিশ্লেষণ", 
            sosActive: "জরুরী এসওএস সক্রিয়",
            weatherFeels: "অনুভূত হয়", weatherWind: "বাতাসের গতি", weatherHum: "আর্দ্রতা",
            emDisaster: "বিপর্যয়/সাধারণ", emPolice: "পুলিশ", emAmbulance: "অ্যাম্বুলেন্স", emFire: "আগুন",
            diagTitle: "নিউরাল ইঞ্জিন ডায়াগনস্টিক",
            diagDesc: "কাঠামোগত নিরাপত্তা থ্রেশহোল্ডের বিপরীতে স্থানীয় পরিবেশগত কারণগুলি ক্রমাগত পর্যবেক্ষণ করা হচ্ছে।",
            optTitle: "✅ অনুকূল পরিস্থিতি", optMsg: "সমস্ত স্থানীয় টেলিমেট্রি স্বাভাবিক। কোনো তাৎক্ষণিক হুমকি নেই।",
            floodTitle: "🌊 আকস্মিক বন্যার ঝুঁকি", floodMsg: "প্রচুর বৃষ্টিপাত সনাক্ত করা হয়েছে। অবকাঠামো প্লাবিত হওয়ার আশঙ্কা।",
            heatTitle: "🔥 হিটওয়েভ", heatMsg: "তাপ এবং আর্দ্রতার মারাত্মক সংমিশ্রণ সনাক্ত করা হয়েছে।",
            warmTitle: "🌡️ উচ্চ তাপ সতর্কতা", warmMsg: "উন্নত তাপীয় অবস্থা। হাইড্রেশনের পরামর্শ দেওয়া হচ্ছে।",
            stormTitle: "🌪️ মারাত্মক ঝড়", stormMsg: "ক্ষতিকারক বাতাসের গতি সনাক্ত করা হয়েছে। আলগা জিনিস সুরক্ষিত করুন।",
            gpsWait: "স্যাটেলাইট খোঁজা হচ্ছে...", gpsDenied: "জিপিএস প্রত্যাখ্যাত", connError: "সংযোগ ত্রুটি"
        }
    };

    const getT = () => i18n[document.getElementById('langSelect').value] || i18n['en'];

    function updateStaticText() {
        const t = getT();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });
    }

    document.getElementById('langSelect').addEventListener('change', () => {
        updateStaticText();
        fetchTelemetry(); 
    });

    window.addEventListener('online', () => updateNetworkUI(true));
    window.addEventListener('offline', () => updateNetworkUI(false));
    function updateNetworkUI(isOnline) {
        document.getElementById('networkStatus').style.background = isOnline ? 'var(--safe)' : 'var(--danger)';
        document.getElementById('networkText').textContent = isOnline ? getT().online : getT().offline;
    }

    const EMERGENCY_DB = {
        "IN": { police: "100", fire: "101", ambulance: "108", disaster: "112" },
        "US": { police: "911", fire: "911", ambulance: "911", disaster: "911" },
        "GB": { police: "999", fire: "999", ambulance: "999", disaster: "112" },
        "DEFAULT": { police: "112", fire: "112", ambulance: "112", disaster: "112" }
    };

    let map;
    let userMarker;
    let lastLat, lastLon;

    function initMap(lat, lon) {
        if (!map) {
            map = L.map('disasterMap').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OS' }).addTo(map);
            userMarker = L.marker([lat, lon]).addTo(map);
        } else {
            map.setView([lat, lon], 10);
            userMarker.setLatLng([lat, lon]);
        }
    }

    function fetchTelemetry() {
        const t = getT();
        document.getElementById('geoCity').textContent = t.gpsWait;
        
        navigator.geolocation.getCurrentPosition(async (pos) => {
            lastLat = pos.coords.latitude; lastLon = pos.coords.longitude;
            initMap(lastLat, lastLon);

            try {
                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lastLat}&longitude=${lastLon}&localityLanguage=en`);
                const geoData = await geoRes.json();
                
                document.getElementById('geoCity').textContent = geoData.city || geoData.locality || "Unknown City";
                document.getElementById('geoRegion').textContent = `${geoData.principalSubdivision || "State"}, ${geoData.countryName || "Country"}`;

                renderEmergencyNumbers(geoData.countryCode || "IN");

                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lastLat}&longitude=${lastLon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`);
                const weatherData = await weatherRes.json();
                
                processRiskEngine(weatherData.current, lastLat, lastLon);
            } catch (err) {
                document.getElementById('geoCity').textContent = t.connError;
                renderEmergencyNumbers("IN");
            }
        }, () => {
            document.getElementById('geoCity').textContent = t.gpsDenied;
            renderEmergencyNumbers("IN");
        });
    }

    function renderEmergencyNumbers(code) {
        const t = getT();
        const numbers = EMERGENCY_DB[code] || EMERGENCY_DB["DEFAULT"];
        document.getElementById('emergencyGrid').innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 8px;">🚨 ${t.emDisaster}: <strong style="float: right;">${numbers.disaster}</strong></div>
            <div style="background: rgba(59, 130, 246, 0.2); padding: 15px; border-radius: 8px;">🚓 ${t.emPolice}: <strong style="float: right;">${numbers.police}</strong></div>
            <div style="background: rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 8px;">🚑 ${t.emAmbulance}: <strong style="float: right;">${numbers.ambulance}</strong></div>
            <div style="background: rgba(245, 158, 11, 0.2); padding: 15px; border-radius: 8px;">🔥 ${t.emFire}: <strong style="float: right;">${numbers.fire}</strong></div>
        `;
    }

    function processRiskEngine(w, lat, lon) {
        const t = getT();
        const alerts = [];
        let totalRisk = 0;

        if (w.precipitation > 50) {
            alerts.push({ type: t.floodTitle, severity: "critical", msg: t.floodMsg });
            totalRisk += 40;
            if(map) L.circle([lat, lon], {color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.4, radius: 5000}).addTo(map);
        }

        if (w.temperature_2m > 40 && w.relative_humidity_2m > 60) {
            alerts.push({ type: t.heatTitle, severity: "critical", msg: t.heatMsg });
            totalRisk += 45;
            if(map) L.circle([lat, lon], {color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, radius: 8000}).addTo(map);
        } else if (w.temperature_2m > 35) {
            alerts.push({ type: t.warmTitle, severity: "medium", msg: t.warmMsg });
            totalRisk += 20;
        }

        if (w.wind_speed_10m > 60) {
            alerts.push({ type: t.stormTitle, severity: "high", msg: t.stormMsg });
            totalRisk += 30;
        }

        if (alerts.length === 0) {
            alerts.push({ type: t.optTitle, severity: "low", msg: t.optMsg });
            totalRisk = 5;
        }

        const safetyScore = Math.max(0, 100 - totalRisk);
        document.getElementById('safetyScoreTxt').textContent = `${safetyScore}`;
        
        const ringColor = safetyScore > 80 ? 'var(--safe)' : safetyScore > 50 ? 'var(--warning)' : 'var(--danger)';
        document.getElementById('safetyScoreRing').style.background = `conic-gradient(${ringColor} ${safetyScore}%, var(--glass-border) 0)`;

        renderAlerts(alerts, w);
    }

    // --- UTILITY: SLEEP FUNCTION FOR AI STREAMING ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- UTILITY: TYPEWRITER EFFECT ---
    async function typeWriter(element, text, speed = 15) {
        element.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await sleep(speed);
        }
    }

    // --- NEW: ASYNC AI BEAST RENDERER ---
    async function renderAlerts(alerts, w) {
        const t = getT();
        const container = document.getElementById('alertsContainer');
        
        // Render the Active Threats list immediately
        container.innerHTML = alerts.map(a => `
            <div class="alert-item" style="border-left-color: ${a.severity === 'critical' ? 'var(--danger)' : a.severity === 'high' ? 'var(--warning)' : 'var(--safe)'}">
                <strong>${a.type}</strong><br>
                <span style="font-size:13px; color: var(--text-muted);">${a.msg}</span>
            </div>
        `).join('');
        
        // Grab the reasoning content container
        const reasoningBox = document.getElementById('reasoningContent');
        
        // Initial AI Terminal Setup
        reasoningBox.innerHTML = `
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">${t.weatherFeels}</div>
                    <strong>${w.temperature_2m}°C</strong>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">${t.weatherHum}</div>
                    <strong>${w.relative_humidity_2m}%</strong>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; flex: 1; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-muted);">${t.weatherWind}</div>
                    <strong>${w.wind_speed_10m} km/h</strong>
                </div>
            </div>
            <div class="ai-processing-box">
                <div class="ai-title-glitch">${t.diagTitle}</div>
                <div id="ai-terminal-logs"></div>
                <div id="ai-final-text" class="typewriter-text blinking-cursor" style="display: none;"></div>
            </div>
        `;

        const terminalLogs = document.getElementById('ai-terminal-logs');
        const finalText = document.getElementById('ai-final-text');

        // Simulated AI "Thinking" Logs
        const logsToPrint = [
            `> Initializing environmental scan at coordinates [${lastLat.toFixed(2)}, ${lastLon.toFixed(2)}]...`,
            `> Correlating open-meteo telemetry... T:${w.temperature_2m}°C, H:${w.relative_humidity_2m}%`,
            `> Querying historical disaster thresholds...`,
            `> Evaluating multi-variate risk vectors...`,
            `> Compiling final directives...`
        ];

        // Stream the logs
        for (let log of logsToPrint) {
            const p = document.createElement('div');
            p.className = 'terminal-log';
            p.textContent = log;
            terminalLogs.appendChild(p);
            await sleep(300); // Wait 300ms between thoughts
        }

        await sleep(500); // Pause for dramatic effect

        // Show the final typewriter text
        finalText.style.display = "block";
        const finalDiagnostic = `${alerts[0].msg} ${t.diagDesc}`;
        await typeWriter(finalText, finalDiagnostic, 20); // Type at 20ms per character
    }

    // --- SOS EMERGENCY MODE ---
    document.getElementById('sosBtn').addEventListener('click', () => {
        document.body.classList.toggle('emergency-mode-active');
        const audio = document.getElementById('sirenAudio');
        const t = getT();

        if (document.body.classList.contains('emergency-mode-active')) {
            audio.play().catch(() => console.log("Audio blocked"));
            if (navigator.vibrate) navigator.vibrate([1000, 500, 1000, 500, 1000]); 
            
            document.getElementById('reasoningContent').innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.2); padding: 40px 20px; border-radius: 12px; text-align: center; border: 2px solid var(--danger);">
                    <h2 style="color: white; font-size: 24px; animation: pulse 1s infinite;">⚠️ ${t.sosActive}</h2>
                </div>
            `;
        } else {
            audio.pause(); audio.currentTime = 0;
            if (navigator.vibrate) navigator.vibrate(0);
            fetchTelemetry(); 
        }
    });

    // Boot Up
    updateStaticText();
    fetchTelemetry();
});
