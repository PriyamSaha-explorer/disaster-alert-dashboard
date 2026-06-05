# Disaster Alert Dashboard

**AI-Powered Real-Time Disaster Monitoring System**

A modern, responsive web application that automatically gathers disaster-related information from real-time weather APIs and provides intelligent risk assessment with actionable recommendations.

## 🎯 Project Objective

Create a professional Microsoft-style disaster monitoring dashboard that demonstrates:
- **Autonomous Information Gathering**: Real-time data collection from Open-Meteo API
- **Multi-Step Reasoning**: AI-powered disaster assessment process
- **Risk Assessment**: Intelligent severity determination
- **Decision Support**: Actionable recommendations based on risk level
- **Real-Time Updates**: Continuous monitoring with automatic refresh

## ✨ Key Features

### Live Weather Data Integration
- 🌍 **Automatic Geolocation**: Detects user location using browser geolocation API
- 🌡️ **Temperature Monitoring**: Real-time temperature from Open-Meteo API
- 💨 **Wind Speed Tracking**: Live wind speed data
- 💧 **Rainfall Monitoring**: Precipitation rates and data
- 📍 **Location Display**: Shows current monitoring location

### Disaster Detection Engine

**Flood Risk Algorithm:**
- Rainfall > 50 mm/day = Medium Risk
- Rainfall > 100 mm/day = High Risk
- Rainfall > 150 mm/day = Critical Risk

**Heatwave Risk Algorithm:**
- Temperature > 38°C = Medium Risk
- Temperature > 42°C = High Risk
- Temperature > 45°C = Critical Risk

**Storm Risk Algorithm:**
- Wind speed > 50 km/h = Medium Risk
- Wind speed > 80 km/h = High Risk
- Wind speed > 120 km/h = Critical Risk

### Dashboard Layout
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Microsoft-Style Interface**: Professional, clean, and intuitive UI
- 🌓 **Dark/Light Mode**: Toggle between themes for better visibility
- ⚡ **Real-Time Status**: Live indicator showing active monitoring

### Alert Management
- 📋 **Alert Cards**: Display disaster type, location, severity, and timestamp
- 🔍 **Search Functionality**: Find alerts by location
- 🎯 **Filter System**: Filter by disaster type
- 📊 **Summary Counts**: Quick overview of alert distribution by severity

### AI Reasoning Agent

The application implements a sophisticated 4-step reasoning process:

**Step 1: Alert Collection**
- Gathers incoming disaster alerts from real-time weather data

**Step 2: Disaster Identification**
- Identifies specific disaster type based on weather conditions
- Flood detection from rainfall data
- Heatwave detection from temperature data
- Storm detection from wind speed data

**Step 3: Risk Assessment**
- Determines severity level (Low, Medium, High, Critical)
- Analyzes contributing risk factors
- Calculates confidence score based on data certainty

**Step 4: Action Generation**
- Generates context-specific recommended actions
- Tailored by disaster type and risk level

### Risk Level Visualization
- 🟢 **Green (Low)**: Minimal threat, standard precautions
- 🟡 **Yellow (Medium)**: Moderate threat, enhanced monitoring
- 🟠 **Orange (High)**: Significant threat, immediate preparation
- 🔴 **Red (Critical)**: Severe threat, emergency measures

### Additional Components
- 🤖 **AI Reasoning Panel**: Displays analysis explanation and risk assessment
- ✅ **Recommended Actions**: Contextual action items based on risk level
- 🚨 **Emergency Resources**: Preparedness checklist, safety instructions, contact info
- 📈 **Risk Meter**: Visual representation of risk level

## 📋 Technical Specifications

### Architecture
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS variables for theming
- **Vanilla JavaScript**: No external dependencies
- **Open-Meteo API**: Free, no-key-required weather data
- **Geolocation API**: Browser-based location detection

### Features
- ✅ Real-time weather data from Open-Meteo
- ✅ Browser geolocation for automatic location detection
- ✅ Disaster detection engine with multiple thresholds
- ✅ Modular, clean code with comprehensive comments
- ✅ Responsive design using CSS Grid and Flexbox
- ✅ Dark/Light theme toggle with localStorage persistence
- ✅ Auto-refresh every 5 minutes
- ✅ Smooth animations and transitions
- ✅ Error handling for API and geolocation failures
- ✅ Loading states and feedback
- ✅ Accessibility features (ARIA labels, semantic HTML)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PriyamSaha-explorer/disaster-alert-dashboard.git
cd disaster-alert-dashboard
```

2. Open in browser:
```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using Python's built-in server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Using Node.js http-server
npx http-server
# Then visit: http://localhost:8080
```

3. **Allow geolocation** when browser prompts

4. **No build process or dependencies required!** Everything runs in the browser.

## 📂 Project Structure

```
disaster-alert-dashboard/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with dark/light themes
├── app.js              # Application logic and AI reasoning
└── README.md           # This file
```

## 🔄 Auto-Refresh System

- **Initial Load**: Weather data and alerts load when page opens
- **Auto-Refresh**: Every 5 minutes (300,000 ms)
- **Manual Refresh**: Click "🔄 Refresh Now" button anytime
- **Last Update**: Timestamp shown in controls section
- **Geolocation**: Cached for 5 minutes, then re-fetched if changed

## 🤖 AI Reasoning Agent Architecture

### Analysis Process

```
Weather Data Input
    ↓
[Step 1] Collect Weather Data
    ↓
[Step 2] Identify Disaster Types
    - Check rainfall thresholds (Flood)
    - Check temperature thresholds (Heatwave)
    - Check wind speed thresholds (Storm)
    ↓
[Step 3] Determine Risk Level
    - Analyze severity indicators
    - Evaluate risk factors
    - Calculate confidence score
    - Generate detailed reasoning
    ↓
[Step 4] Generate Recommended Actions
    - Type-specific actions
    - Risk-level tailored
    ↓
Output: Complete Analysis with Reasoning
```

### Risk Scoring Algorithm

The AI determines risk levels using:
- **Base Severity**: Weather threshold breach level
- **Confidence Score**: Data accuracy percentage
- **Risk Factors**: Number of concerning weather parameters
- **Disaster Type**: Type-specific multipliers

**Risk Score Range:**
- **0-5**: Low Risk (🟢)
- **5-9**: Medium Risk (🟡)
- **9-13**: High Risk (🟠)
- **13+**: Critical Risk (🔴)

## 📡 API Integration

### Open-Meteo API

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Parameters:**
- `latitude`: User's latitude
- `longitude`: User's longitude
- `current`: Comma-separated list of current weather variables
- `hourly`: Comma-separated list of hourly weather variables

**Data Retrieved:**
- Current temperature (°C)
- Current weather code (WMO)
- Rain/Rainfall (mm)
- Wind speed (km/h)
- Wind direction

### Geolocation API

**Browser Feature**: Geolocation.getCurrentPosition()

**Returns:**
- Latitude
- Longitude
- Accuracy
- Altitude (if available)

## 🎨 User Interface

### Dark Mode
- Toggle with moon (🌙) / sun (☀️) button
- Automatically saved to browser storage
- Persists across sessions

### Responsive Breakpoints
- **Desktop**: Full responsive grid layout
- **Tablet (1024px)**: Optimized 2-column layout
- **Mobile (640px)**: Single column layout with touch-friendly controls
- **Small Mobile (480px)**: Compact layout optimized for small screens

## 📊 Example AI Analysis Output

### High Rainfall Alert
```
Risk Level: CRITICAL
Confidence: 92%
Location: Current Location

Weather Data:
Temperature: 28°C
Rainfall: 175 mm/day
Wind Speed: 45 km/h

AI Reasoning:
"CRITICAL FLOOD RISK ALERT: The area is experiencing extremely heavy rainfall 
at 175 mm/day, well above critical thresholds. River levels are expected to rise 
rapidly. Flood conditions are imminent within the next 6-12 hours."

Risk Factors:
- Rainfall 175 mm/day (Critical threshold: >150 mm/day)
- Continuous precipitation pattern
- Urban drainage systems may be overwhelmed
- Ground saturation at dangerous levels

Recommended Actions:
🚨 Evacuate immediately to higher ground
📞 Contact emergency services at 911/999
👨‍👩‍👧‍👦 Move family and pets to safe location
📦 Take important documents and valuables
📱 Keep phone charged and monitor official updates
```

## 🔧 Customization

### Modifying Weather Thresholds

Edit the thresholds in `generateDisasterAlertsFromWeather()` function:

```javascript
// Flood detection
if (data.rainfall > 150) {
    // Change 150 to your desired threshold (mm/day)
}

// Heatwave detection
if (data.temperature > 45) {
    // Change 45 to your desired threshold (°C)
}

// Storm detection
if (data.windSpeed > 120) {
    // Change 120 to your desired threshold (km/h)
}
```

### Modifying Refresh Interval

Edit the auto-refresh interval in `setupAutoRefresh()`:

```javascript
// Change 300000 (5 minutes) to desired milliseconds
AppState.autoRefreshInterval = setInterval(() => {
    refreshAlerts();
}, 300000); // Adjust this value
```

### Adding Custom Locations

Manually set a location in `initializeApp()`:

```javascript
// Skip geolocation and use custom coordinates
const customLocation = { latitude: 28.6139, longitude: 77.2090 }; // Delhi
AppState.userLocation = customLocation;
fetchLiveWeatherData();
```

## 🌍 Browser Compatibility

- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Geolocation requires HTTPS in production environments or HTTP on localhost.

## 🎓 Learning Outcomes

This project demonstrates:
- Real-time API integration and data processing
- Browser Geolocation API usage
- Clean, modular JavaScript architecture
- Responsive CSS3 design patterns
- Semantic HTML5 structure
- AI/ML reasoning simulation with real data
- Error handling and fallback strategies
- State management in vanilla JS
- Theme persistence with localStorage
- Accessibility best practices

## 🌟 Hackathon Highlights

### For Reasoning Agents Challenge

✅ Multi-step decision-making process with real weather data
✅ Complex reasoning engine with confidence scores
✅ Risk assessment and prioritization based on live data
✅ Context-aware recommendations
✅ Explainable AI output with detailed reasoning
✅ Real-time data processing and disaster detection
✅ Disaster Detection Engine with multiple thresholds
✅ Integration with public APIs (no authentication required)

### Polish & Professional Quality

✅ Microsoft-style design aesthetic
✅ Smooth animations and transitions
✅ Dark/Light theme support
✅ Mobile-first responsive design
✅ Comprehensive error handling
✅ Loading states and feedback
✅ Professional code comments
✅ Real-time data integration

## 🐛 Error Handling

The application includes robust error handling for:

- **Geolocation Denied**: Falls back to default location (New York, USA)
- **API Failure**: Displays error message and retry option
- **Network Error**: Shows error state with manual refresh button
- **Timeout**: 10-second timeout with user feedback

## 📝 License

MIT License - Feel free to use and modify

## 👨‍💻 Author

Created by [PriyamSaha-explorer](https://github.com/PriyamSaha-explorer)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest enhancements
- Submit pull requests
- Improve documentation

## 📞 Support

For questions or issues, please open a GitHub issue in the repository.

---

**Status**: ✅ Complete and Production-Ready

**Last Updated**: June 2026

**Real-Time Disaster Monitoring for a Safer Tomorrow** 🌍🚨