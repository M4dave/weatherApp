import Input from "./components/Input";
import TopButtons from "./components/TopButtons";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import UVAndAirQuality from "./components/UVAndAirQuality";
import RadarGrid from "./components/RadarGrid";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState, useCallback, useRef } from "react";

function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const NOTIF_COLORS = { info: "#f0c030", success: "#00cc44", error: "#e8192c" };

const RSNotification = ({ notif }) => {
  if (!notif) return null;
  const color = NOTIF_COLORS[notif.type] || "#f0c030";
  return (
    <div className="fixed bottom-4 right-4 z-50 font-barlow text-sm px-5 py-3 max-w-sm uppercase tracking-wider"
      style={{ background: "#0a0806", border: `1px solid ${color}`, borderLeft: `3px solid ${color}`, color, boxShadow: `0 0 20px ${color}22`, animation: "flicker 0.4s ease forwards" }}>
      {notif.msg}
    </div>
  );
};

const RockstarStar = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
  </svg>
);

const App = () => {
  const [query, setQuery]         = useState({ q: "manila" });
  const [units, setUnits]         = useState("metric");
  const [weather, setWeather]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick]           = useState(0);
  const [notif, setNotif]         = useState(null);
  const notifTimer                = useRef(null);

  const showNotif = useCallback((type, msg) => {
    clearTimeout(notifTimer.current);
    setNotif({ type, msg });
    notifTimer.current = setTimeout(() => setNotif(null), 2800);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const getWeather = useCallback(async () => {
    showNotif("info", `Scanning: ${capitalizeFirstLetter(query.q || "current location")}`);
    setIsLoading(true);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      showNotif("success", `Data loaded — ${data.name}, ${data.country}`);
      setWeather(data);
    } catch (err) {
      showNotif("error", err.message || "Location not found");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, units, showNotif]);

  useEffect(() => { getWeather(); }, [getWeather]);

  const now    = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#0a0806] flex flex-col">

      {/* ── TOP SYSTEM BAR ── full width */}
      <div className="rs-panel flex items-center justify-between px-6 py-2 shrink-0"
        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="flex items-center gap-3">
          <RockstarStar size={14} style={{ color: "#f0c030", filter: "drop-shadow(0 0 4px rgba(240,192,48,0.6))" }} />
          <span className="font-bebas text-xl tracking-widest gold-text">WEATHER INTEL</span>
          <RockstarStar size={14} style={{ color: "#f0c030", filter: "drop-shadow(0 0 4px rgba(240,192,48,0.6))" }} />
        </div>
        <div className="flex items-center gap-6">
          <TopButtons setQuery={setQuery} />
        </div>
        <div className="flex items-center gap-4">
          <Input setQuery={setQuery} units={units} setUnits={setUnits} compact />
          <span className="font-barlow text-sm tracking-wider hidden lg:block" style={{ color: "rgba(240,192,48,0.45)" }}>
            {dateStr}
          </span>
          <span className="font-bebas text-lg tracking-wider gold-text hidden lg:block">{timeStr}</span>
          <span className="blink font-bebas text-lg" style={{ color: "#e8192c" }}>●</span>
        </div>
      </div>

      {/* ── HERO BAND ── city name + key stats across full width */}
      {weather && !isLoading && (
        <div className="rs-panel px-6 py-4 shrink-0 flicker" style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* City + time */}
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-bebas gold-text leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "0.06em" }}>
                  {weather.name}
                </h1>
                <span className="font-barlow text-lg font-semibold" style={{ color: "rgba(240,192,48,0.55)" }}>
                  {weather.country}
                </span>
              </div>
              <p className="font-barlow text-sm tracking-wider" style={{ color: "rgba(240,192,48,0.45)" }}>
                {weather.lat?.toFixed(4)}°N &nbsp;{weather.lon?.toFixed(4)}°E &nbsp;·&nbsp; {weather.formattedLocalTime?.split("| Local time:")[0]?.trim()}
              </p>
            </div>

            {/* Giant temp */}
            <div className="flex items-start leading-none">
              <span className="font-bebas gold-text" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", textShadow: "0 0 30px rgba(240,192,48,0.3)" }}>
                {weather.temp?.toFixed()}
              </span>
              <span className="font-bebas text-4xl mt-3" style={{ color: "rgba(240,192,48,0.5)" }}>°</span>
              <span className="font-barlow text-lg mt-5 ml-1 font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>
                {units === "metric" ? "C" : "F"}
              </span>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { label: "Condition",  value: weather.description || weather.details },
                { label: "Feels Like", value: `${weather.feels_like?.toFixed()}°` },
                { label: "Humidity",   value: `${weather.humidity}%` },
                { label: "Wind",       value: `${weather.speed?.toFixed(1)} ${units === "metric" ? "m/s" : "mph"} ${weather.windDir || ""}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>{label}</p>
                  <p className="font-bebas text-xl tracking-wide capitalize" style={{ color: "#f0c030" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Sunrise / Sunset */}
            <div className="flex gap-6">
              <div>
                <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>Sunrise</p>
                <p className="font-bebas text-xl tracking-wide" style={{ color: "#f0c030" }}>{weather.sunrise}</p>
              </div>
              <div>
                <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>Sunset</p>
                <p className="font-bebas text-xl tracking-wide" style={{ color: "#e8192c" }}>{weather.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN DASHBOARD GRID ── fills remaining height */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <RockstarStar size={56} style={{ color: "#f0c030", animation: "star-spin 2s linear infinite", opacity: 0.8 }} />
            <p className="font-bebas text-2xl tracking-[0.4em]" style={{ color: "rgba(240,192,48,0.5)" }}>ACQUIRING DATA...</p>
          </div>
        )}

        {!isLoading && !weather && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <RockstarStar size={48} style={{ color: "rgba(240,192,48,0.15)", animation: "rs-pulse 3s ease-in-out infinite" }} />
            <p className="font-bebas text-xl tracking-[0.4em]" style={{ color: "rgba(240,192,48,0.25)" }}>ENTER LOCATION ABOVE</p>
          </div>
        )}

        {!isLoading && weather && (
          <>
            {/* LEFT COLUMN — forecasts (~60%) */}
            <div className="flex-1 lg:flex-[3] flex flex-col gap-0 overflow-y-auto border-r"
              style={{ borderColor: "rgba(240,192,48,0.1)" }}>

              {/* Full-width stats strip */}
              <div className="rs-panel px-6 py-4 shrink-0"
                style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}>
                <div className="flex flex-wrap justify-between gap-x-6 gap-y-3">
                  {[
                    { label: "Pressure",    value: weather.pressure ? `${weather.pressure} hPa` : "N/A" },
                    { label: "Visibility",  value: weather.visibility ? `${weather.visibility} km` : "N/A" },
                    { label: "Cloud Cover", value: weather.cloudCover !== null ? `${weather.cloudCover}%` : "N/A" },
                    { label: "High",        value: `${weather.temp_max?.toFixed()}°`, color: "#e8192c" },
                    { label: "Low",         value: `${weather.temp_min?.toFixed()}°`, color: "rgba(120,180,255,0.9)" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>{label}</p>
                      <p className="font-bebas text-xl tracking-wide" style={{ color: color || "#f0c030" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather icon + condition - full width band */}
              <div className="px-6 py-5 flex items-center gap-6 border-b shrink-0"
                style={{ borderColor: "rgba(240,192,48,0.1)" }}>
                <img src={weather.icon} alt={weather.details}
                  className="w-20 h-20 shrink-0"
                  style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.15) drop-shadow(0 0 16px rgba(240,192,48,0.5))" }} />
                <div>
                  <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>Current Condition</p>
                  <p className="font-bebas text-3xl tracking-wide capitalize" style={{ color: "#f0c030" }}>
                    {weather.description || weather.details}
                  </p>
                  <p className="font-barlow text-sm" style={{ color: "rgba(240,192,48,0.5)" }}>
                    Feels like {weather.feels_like?.toFixed()}° &nbsp;·&nbsp; {weather.temp_max?.toFixed()}° high &nbsp;·&nbsp; {weather.temp_min?.toFixed()}° low
                  </p>
                </div>
              </div>

              {/* Hourly forecast */}
              <div className="px-6 py-5 border-b shrink-0" style={{ borderColor: "rgba(240,192,48,0.1)" }}>
                <Forecast title="HOURLY SCAN" data={weather.hourly} />
              </div>

              {/* Daily forecast */}
              <div className="px-6 py-5 shrink-0">
                <Forecast title="DAILY PROJECTION" data={weather.daily} />
              </div>
            </div>

            {/* RIGHT COLUMN — gauges + analysis (~40%) */}
            <div className="lg:flex-[2] flex flex-col overflow-y-auto">

              {/* UV + Humidity analysis */}
              <div className="p-5 border-b" style={{ borderColor: "rgba(240,192,48,0.1)" }}>
                <UVAndAirQuality weather={weather} />
              </div>

              {/* Sensor array */}
              <div className="p-5 border-b" style={{ borderColor: "rgba(240,192,48,0.1)" }}>
                <RadarGrid weather={weather} units={units} />
              </div>

              {/* Detailed stats table */}
              <div className="p-5 flex-1">
                <p className="font-barlow text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: "rgba(240,192,48,0.55)" }}>
                  Full Readout
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Temperature",  value: `${weather.temp?.toFixed()}°` },
                    { label: "Feels Like",   value: `${weather.feels_like?.toFixed()}°` },
                    { label: "Humidity",     value: `${weather.humidity}%` },
                    { label: "Wind",         value: `${weather.speed?.toFixed(1)} ${units === "metric" ? "m/s" : "mph"} ${weather.windDir || ""}` },
                    { label: "Pressure",     value: weather.pressure ? `${weather.pressure} hPa` : "N/A" },
                    { label: "Visibility",   value: weather.visibility ? `${weather.visibility} km` : "N/A" },
                    { label: "Cloud Cover",  value: weather.cloudCover !== null ? `${weather.cloudCover}%` : "N/A" },
                    { label: "Sunrise",      value: weather.sunrise },
                    { label: "Sunset",       value: weather.sunset },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b"
                      style={{ borderColor: "rgba(240,192,48,0.08)" }}>
                      <span className="font-barlow text-sm uppercase tracking-wider" style={{ color: "rgba(240,192,48,0.5)" }}>{label}</span>
                      <span className="font-bebas text-lg tracking-wide" style={{ color: "#f0c030" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── BOTTOM STATUS BAR ── full width */}
      <div className="rs-panel flex items-center justify-between px-6 py-2 shrink-0"
        style={{ borderBottom: "none", borderLeft: "none", borderRight: "none" }}>
        <span className="font-barlow text-sm tracking-wider" style={{ color: "rgba(240,192,48,0.3)" }}>
          Coords: {weather ? `${weather.lat?.toFixed(4)}°N / ${weather.lon?.toFixed(4)}°E` : "-- / --"}
        </span>
        <span className="font-barlow text-sm tracking-wider" style={{ color: isLoading ? "#e8192c" : weather ? "rgba(240,192,48,0.45)" : "rgba(240,192,48,0.2)" }}>
          {isLoading ? "● Scanning" : weather ? "● Online" : "● Standby"}
        </span>
        <span className="font-barlow text-sm tracking-wider" style={{ color: "rgba(240,192,48,0.3)" }}>R★ Weather v3.7</span>
      </div>

      <RSNotification notif={notif} />
    </div>
  );
};

export default App;
