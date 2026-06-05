document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lastUpdate").textContent =
        "Last updated: " + new Date().toLocaleTimeString();

    console.log("Disaster Alert Dashboard Loaded");
});