import Input from "./components/Input";
import TopButtons from "./components/TopButtons";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import UVAndAirQuality from "./components/UVAndAirQuality";
import RadarGrid from "./components/RadarGrid";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState, useCallback, useRef } from "react";

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

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

const Star = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
  </svg>
);

const Divider = ({ red = false }) => (
  <div style={{ height: "1px", background: red ? "linear-gradient(90deg,transparent,rgba(232,25,44,0.5),transparent)" : "linear-gradient(90deg,transparent,rgba(240,192,48,0.25),transparent)" }} />
);

const App = () => {
  const [query, setQuery]         = useState({ q: "manila" });
  const [units, setUnits]         = useState("metric");
  const [weather, setWeather]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick]           = useState(0);
  const [is24Hour, setIs24Hour]   = useState(false);
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
    showNotif("info", `Scanning: ${cap(query.q || "current location")}`);
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

  const now     = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: !is24Hour });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const windUnit  = units === "metric" ? "m/s" : "mph";

  return (
    <div className="min-h-screen bg-[#0a0806] flex flex-col" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>

      {/* ═══ NAV BAR ═══ */}
      <div style={{ background: "rgba(8,6,4,0.97)", borderBottom: "1px solid rgba(240,192,48,0.2)" }}>
        <div className="flex items-center gap-4 px-5 py-2.5 flex-wrap">

          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <Star size={15} style={{ color: "#f0c030", filter: "drop-shadow(0 0 5px rgba(240,192,48,0.6))" }} />
            <span className="font-bebas text-xl tracking-[0.25em] gold-text">WEATHER INTEL</span>
            <Star size={15} style={{ color: "#f0c030", filter: "drop-shadow(0 0 5px rgba(240,192,48,0.6))" }} />
          </div>

          <div className="h-5 w-px" style={{ background: "rgba(240,192,48,0.2)" }} />

          {/* Quick-city buttons — compact row */}
          <TopButtons setQuery={setQuery} />

          <div className="flex-1" />

          {/* Search */}
          <div className="shrink-0">
            <Input setQuery={setQuery} units={units} setUnits={setUnits} compact />
          </div>

          <div className="h-5 w-px hidden md:block" style={{ background: "rgba(240,192,48,0.2)" }} />

          {/* Clock + 12/24 toggle */}
          <div className="hidden md:flex flex-col items-end shrink-0 gap-1">
            <span className="font-bebas text-lg tracking-wider gold-text">{timeStr}</span>
            <div className="flex items-center gap-1">
              <span className="font-barlow text-xs" style={{ color: "rgba(240,192,48,0.4)" }}>{dateStr}</span>
              <button
                onClick={() => setIs24Hour((v) => !v)}
                className="font-bebas text-xs px-1.5 py-0.5 tracking-wider transition-all duration-150 ml-2"
                style={{
                  color: is24Hour ? "#0a0806" : "#f0c030",
                  background: is24Hour ? "#f0c030" : "transparent",
                  border: "1px solid rgba(240,192,48,0.4)",
                }}
                aria-label="Toggle 12/24 hour clock"
              >
                {is24Hour ? "24H" : "12H"}
              </button>
            </div>
          </div>

          <span className="blink font-bebas text-base ml-1" style={{ color: "#e8192c" }}>●</span>
        </div>
      </div>

      {/* ═══ LOADING / EMPTY ═══ */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <Star size={52} style={{ color: "#f0c030", animation: "star-spin 2s linear infinite", opacity: 0.8 }} />
          <p className="font-bebas text-2xl tracking-[0.4em]" style={{ color: "rgba(240,192,48,0.5)" }}>ACQUIRING DATA...</p>
        </div>
      )}

      {!isLoading && !weather && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Star size={44} style={{ color: "rgba(240,192,48,0.15)", animation: "rs-pulse 3s ease-in-out infinite" }} />
          <p className="font-bebas text-xl tracking-[0.35em]" style={{ color: "rgba(240,192,48,0.25)" }}>ENTER A CITY ABOVE</p>
        </div>
      )}

      {!isLoading && weather && (
        <div className="flex-1 flex flex-col flicker overflow-hidden">

          {/* ═══ HERO BAND — city identity + giant temp ═══ */}
          <div className="px-6 py-5 shrink-0" style={{ background: "rgba(8,6,4,0.6)" }}>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">

              {/* Left: city name + meta */}
              <div>
                <div className="flex items-baseline gap-3">
                  <h1 className="font-bebas gold-text leading-none"
                    style={{ fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "0.05em", textShadow: "0 0 40px rgba(240,192,48,0.25)" }}>
                    {weather.name}
                  </h1>
                  <span className="font-bebas text-3xl" style={{ color: "rgba(240,192,48,0.5)" }}>{weather.country}</span>
                </div>
                <p className="font-barlow text-sm mt-1" style={{ color: "rgba(240,192,48,0.45)" }}>
                  {weather.lat?.toFixed(4)}°N &nbsp;·&nbsp; {weather.lon?.toFixed(4)}°E
                </p>
                <p className="font-barlow text-sm" style={{ color: "rgba(240,192,48,0.4)" }}>
                  {weather.formattedLocalTime?.split("| Local time:")[0]?.trim()}
                  {weather.formattedLocalTime?.includes("Local time:") && (
                    <span className="font-bebas text-base ml-2" style={{ color: "#f0c030" }}>
                      {weather.formattedLocalTime.split("Local time:")[1]?.trim()}
                    </span>
                  )}
                </p>
              </div>

              {/* Center: giant temp + condition */}
              <div className="flex items-center gap-6">
                <img src={weather.icon} alt={weather.details} className="w-20 h-20 shrink-0"
                  style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.15) drop-shadow(0 0 16px rgba(240,192,48,0.5))" }} />
                <div>
                  <div className="flex items-start leading-none">
                    <span className="font-bebas gold-text"
                      style={{ fontSize: "clamp(4.5rem, 9vw, 7.5rem)", textShadow: "0 0 30px rgba(240,192,48,0.3)", lineHeight: 1 }}>
                      {weather.temp?.toFixed()}
                    </span>
                    <span className="font-bebas text-4xl mt-2 ml-1" style={{ color: "rgba(240,192,48,0.55)" }}>
                      °{units === "metric" ? "C" : "F"}
                    </span>
                  </div>
                  <p className="font-bebas text-2xl tracking-wide capitalize" style={{ color: "rgba(240,192,48,0.75)" }}>
                    {weather.description || weather.details}
                  </p>
                  <p className="font-barlow text-sm" style={{ color: "rgba(240,192,48,0.5)" }}>
                    Feels like {weather.feels_like?.toFixed()}°
                  </p>
                </div>
              </div>

              {/* Right: quick stat pills */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { label: "High",       value: `${weather.temp_max?.toFixed()}°`, color: "#e8192c" },
                  { label: "Low",        value: `${weather.temp_min?.toFixed()}°`, color: "rgba(120,180,255,0.9)" },
                  { label: "Humidity",   value: `${weather.humidity}%` },
                  { label: "Wind",       value: `${weather.speed?.toFixed(1)} ${windUnit} ${weather.windDir || ""}`.trim() },
                  { label: "Sunrise",    value: weather.sunrise },
                  { label: "Sunset",     value: weather.sunset, color: "#e8192c" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="font-barlow text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.45)" }}>{label}</p>
                    <p className="font-bebas text-xl tracking-wide" style={{ color: color || "#f0c030" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Divider />

          {/* ═══ TWO-COLUMN SECTION: conditions left, instruments right ═══ */}
          <div className="flex flex-col lg:flex-row shrink-0">

            {/* LEFT — current conditions detail */}
            <div className="flex-1 lg:flex-[3] px-6 py-5 border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: "rgba(240,192,48,0.12)" }}>
              <TemperatureAndDetails weather={weather} units={units} />
            </div>

            {/* RIGHT — instruments */}
            <div className="flex-1 lg:flex-[2] flex flex-col">

              {/* UV + Humidity bars */}
              <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(240,192,48,0.12)" }}>
                <UVAndAirQuality weather={weather} />
              </div>

              {/* Wind compass + gauges */}
              <div className="px-6 py-5">
                <RadarGrid weather={weather} units={units} />
              </div>
            </div>
          </div>

          <Divider red />

          {/* ═══ FULL-WIDTH FORECAST BAND ═══ */}
          <div className="px-6 py-5 shrink-0">
            <Forecast title="HOURLY SCAN" data={weather.hourly} />
          </div>

          <Divider />

          <div className="px-6 py-5 shrink-0">
            <Forecast title="DAILY PROJECTION" data={weather.daily} />
          </div>

          <Divider />
        </div>
      )}

      {/* ═══ STATUS BAR ═══ */}
      <div className="shrink-0 flex items-center justify-between px-5 py-2"
        style={{ background: "rgba(8,6,4,0.97)", borderTop: "1px solid rgba(240,192,48,0.15)" }}>
        <span className="font-barlow text-xs tracking-wider" style={{ color: "rgba(240,192,48,0.3)" }}>
          {weather ? `${weather.lat?.toFixed(4)}°N / ${weather.lon?.toFixed(4)}°E` : "-- / --"}
        </span>
        <span className="font-barlow text-xs tracking-wider"
          style={{ color: isLoading ? "#e8192c" : weather ? "rgba(240,192,48,0.5)" : "rgba(240,192,48,0.2)" }}>
          {isLoading ? "● Scanning" : weather ? "● Online" : "● Standby"}
        </span>
        <span className="font-barlow text-xs tracking-wider" style={{ color: "rgba(240,192,48,0.3)" }}>R★ Weather v3.7</span>
      </div>

      <RSNotification notif={notif} />
    </div>
  );
};

export default App;
