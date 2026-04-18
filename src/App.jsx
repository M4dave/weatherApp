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
    <div className="fixed bottom-4 right-4 z-50 font-barlow text-sm px-4 py-2.5 max-w-[90vw] uppercase tracking-wider"
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

// Flag icon using flag-icons CSS library (works on all browsers incl. Windows)
const FlagIcon = ({ code, size = 20 }) => {
  if (!code || code.length !== 2) return null;
  return (
    <span
      className={`fi fi-${code.toLowerCase()}`}
      style={{ width: size, height: size * 0.75, display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
};

const Divider = ({ red = false }) => (
  <div style={{ height: "1px", flexShrink: 0, background: red ? "linear-gradient(90deg,transparent,rgba(232,25,44,0.5),transparent)" : "linear-gradient(90deg,transparent,rgba(240,192,48,0.25),transparent)" }} />
);

const StatPill = ({ label, value, color }) => (
  <div className="flex flex-col min-w-0">
    <span className="font-barlow text-xs uppercase tracking-wider font-semibold truncate" style={{ color: "rgba(240,192,48,0.45)" }}>{label}</span>
    <span className="font-bebas text-lg sm:text-xl tracking-wide leading-tight" style={{ color: color || "#f0c030" }}>{value}</span>
  </div>
);

const App = () => {
  const [query, setQuery]         = useState({ q: "manila" });
  const [units, setUnits]         = useState("metric");
  const [weather, setWeather]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick]           = useState(0);
  const [is24Hour, setIs24Hour]   = useState(false);
  const [navOpen, setNavOpen]     = useState(false);
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
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const windUnit = units === "metric" ? "m/s" : "mph";

  return (
    <div className="min-h-screen bg-[#0a0806] flex flex-col overflow-x-hidden" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>

      {/* ═══ NAV BAR ═══ */}
      <div style={{ background: "rgba(8,6,4,0.97)", borderBottom: "1px solid rgba(240,192,48,0.2)" }}>

        {/* Main nav row */}
        <div className="flex items-center gap-2 px-3 py-2">

          {/* Brand — always visible */}
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} style={{ color: "#f0c030", filter: "drop-shadow(0 0 4px rgba(240,192,48,0.6))" }} />
            <span className="font-bebas text-base sm:text-xl tracking-wider sm:tracking-[0.2em] gold-text whitespace-nowrap">
              WEATHER INTEL
            </span>
            <Star size={12} style={{ color: "#f0c030", filter: "drop-shadow(0 0 4px rgba(240,192,48,0.6))" }} />
          </div>

          {/* City buttons — desktop only */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="h-4 w-px" style={{ background: "rgba(240,192,48,0.2)" }} />
            <TopButtons setQuery={setQuery} />
          </div>

          {/* Spacer — only on desktop where there's room */}
          <div className="hidden md:block flex-1 min-w-0" />

          {/* Current city indicator — md+ only */}
          {weather && (
            <div className="hidden md:flex items-center gap-1.5 shrink-0 px-2.5 py-1 mr-1"
              style={{ border: "1px solid rgba(240,192,48,0.2)", background: "rgba(240,192,48,0.04)" }}>
              <FlagIcon code={weather.country} size={18} />
              <span className="font-bebas text-sm tracking-wider" style={{ color: "#f0c030" }}>{weather.name}</span>
              <span className="font-barlow text-xs font-semibold" style={{ color: "rgba(240,192,48,0.4)" }}>{weather.country}</span>
            </div>
          )}

          {/* Search — flex-1 on mobile so it fills remaining space, fixed on desktop */}
          <div className="flex-1 md:flex-none md:w-56 min-w-0">
            <Input setQuery={setQuery} units={units} setUnits={setUnits} compact mobileMinimal />
          </div>

          {/* Clock + toggle — desktop only */}
          <div className="hidden lg:flex flex-col items-end shrink-0 gap-0.5 ml-2">
            <span className="font-bebas text-base tracking-wider gold-text leading-tight">{timeStr}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-barlow text-xs" style={{ color: "rgba(240,192,48,0.4)" }}>{dateStr}</span>
              <button
                onClick={() => setIs24Hour((v) => !v)}
                className="font-bebas text-xs px-1.5 py-0.5 tracking-wider transition-all duration-150"
                style={{ color: is24Hour ? "#0a0806" : "#f0c030", background: is24Hour ? "#f0c030" : "transparent", border: "1px solid rgba(240,192,48,0.4)" }}
                aria-label="Toggle 12/24 hour clock"
              >
                {is24Hour ? "24H" : "12H"}
              </button>
            </div>
          </div>

          {/* °C / °F toggle — visible on sm+ in nav bar */}
          <div className="hidden sm:flex border border-[#f0c030]/20 overflow-hidden shrink-0">
            {["metric", "imperial"].map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className="font-bebas text-xs px-2.5 py-1.5 tracking-widest transition-all duration-150"
                style={{
                  color: units === u ? "#0a0806" : "rgba(240,192,48,0.45)",
                  background: units === u ? "#f0c030" : "#0a0806",
                }}
                aria-label={`Switch to ${u === "metric" ? "Celsius" : "Fahrenheit"}`}
              >
                {u === "metric" ? "°C" : "°F"}
              </button>
            ))}
          </div>

          {/* Mobile: hamburger + blink — fixed size, always fits */}
          <div className="md:hidden flex items-center gap-1 shrink-0 ml-1">
            <button
              className="flex flex-col justify-center gap-1 p-2"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {[0,1,2].map((i) => (
                <div key={i} className="w-4 h-0.5" style={{ background: "#f0c030", opacity: 0.7 }} />
              ))}
            </button>
            <span className="blink font-bebas text-xs" style={{ color: "#e8192c" }}>●</span>
          </div>

          {/* Desktop blink */}
          <span className="hidden md:inline blink font-bebas text-sm ml-1" style={{ color: "#e8192c" }}>●</span>
        </div>

        {/* Mobile dropdown — city buttons, GPS, units, clock */}
        {navOpen && (
          <div className="md:hidden px-4 pb-4 border-t" style={{ borderColor: "rgba(240,192,48,0.12)" }}>

            {/* Current city pill */}
            {weather && (
              <div className="flex items-center gap-2 mt-3 mb-3 px-2.5 py-1.5 w-fit"
                style={{ border: "1px solid rgba(240,192,48,0.2)", background: "rgba(240,192,48,0.04)" }}>
                <FlagIcon code={weather.country} size={20} />
                <span className="font-bebas text-base tracking-wider" style={{ color: "#f0c030" }}>{weather.name}</span>
                <span className="font-barlow text-xs font-semibold" style={{ color: "rgba(240,192,48,0.4)" }}>{weather.country}</span>
              </div>
            )}

            {/* City quick buttons */}
            <div className="mb-3">
              <TopButtons setQuery={setQuery} onSelect={() => setNavOpen(false)} />
            </div>

            {/* Bottom row: GPS + units + clock */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t"
              style={{ borderColor: "rgba(240,192,48,0.08)" }}>

              {/* GPS button */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      ({ coords: { latitude, longitude } }) => { setQuery({ lat: latitude, lon: longitude }); setNavOpen(false); },
                      () => alert("Location access denied.")
                    );
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 font-barlow text-xs uppercase tracking-wide"
                style={{ border: "1px solid rgba(240,192,48,0.2)", color: "rgba(240,192,48,0.6)" }}
              >
                📍 My Location
              </button>

              {/* Unit toggle */}
              <div className="flex border overflow-hidden" style={{ borderColor: "rgba(240,192,48,0.2)" }}>
                {["metric","imperial"].map((u) => (
                  <button key={u} onClick={() => setUnits(u)}
                    className="font-bebas text-sm px-3 py-1.5 tracking-widest transition-all duration-150"
                    style={{ color: units === u ? "#0a0806" : "rgba(240,192,48,0.4)", background: units === u ? "#f0c030" : "#0a0806" }}>
                    {u === "metric" ? "°C" : "°F"}
                  </button>
                ))}
              </div>

              {/* Clock + 12/24 toggle */}
              <div className="flex items-center gap-2">
                <span className="font-bebas text-base gold-text tracking-wider">{timeStr}</span>
                <button
                  onClick={() => setIs24Hour((v) => !v)}
                  className="font-bebas text-xs px-2 py-0.5 tracking-wider"
                  style={{ color: is24Hour ? "#0a0806" : "#f0c030", background: is24Hour ? "#f0c030" : "transparent", border: "1px solid rgba(240,192,48,0.4)" }}
                >
                  {is24Hour ? "24H" : "12H"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ LOADING / EMPTY ═══ */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <Star size={48} style={{ color: "#f0c030", animation: "star-spin 2s linear infinite", opacity: 0.8 }} />
          <p className="font-bebas text-xl sm:text-2xl tracking-[0.4em] text-center" style={{ color: "rgba(240,192,48,0.5)" }}>ACQUIRING DATA...</p>
        </div>
      )}

      {!isLoading && !weather && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <Star size={40} style={{ color: "rgba(240,192,48,0.15)", animation: "rs-pulse 3s ease-in-out infinite" }} />
          <p className="font-bebas text-lg sm:text-xl tracking-[0.3em] text-center" style={{ color: "rgba(240,192,48,0.25)" }}>ENTER A CITY ABOVE</p>
        </div>
      )}

      {!isLoading && weather && (
        <div className="flex-1 flex flex-col flicker">

          {/* ═══ HERO BAND ═══ */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 shrink-0" style={{ background: "rgba(8,6,4,0.6)" }}>

            {/* Mobile/narrow hero: stacked — shows below md */}
            <div className="flex flex-col md:hidden gap-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="font-bebas gold-text leading-none" style={{ fontSize: "3rem", letterSpacing: "0.05em" }}>
                      {weather.name}
                    </h1>
                    <span className="font-bebas text-xl" style={{ color: "rgba(240,192,48,0.5)" }}>{weather.country}</span>
                  </div>
                  <p className="font-barlow text-xs" style={{ color: "rgba(240,192,48,0.4)" }}>
                    {weather.formattedLocalTime?.split("| Local time:")[0]?.trim()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img src={weather.icon} alt={weather.details} className="w-12 h-12"
                    style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.15) drop-shadow(0 0 10px rgba(240,192,48,0.5))" }} />
                  <div className="flex items-start leading-none">
                    <span className="font-bebas gold-text" style={{ fontSize: "3.5rem", lineHeight: 1 }}>{weather.temp?.toFixed()}</span>
                    <span className="font-bebas text-xl mt-1" style={{ color: "rgba(240,192,48,0.55)" }}>°{units === "metric" ? "C" : "F"}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                {[
                  { label: "Condition", value: weather.description || weather.details },
                  { label: "Feels like", value: `${weather.feels_like?.toFixed()}°` },
                  { label: "Humidity", value: `${weather.humidity}%` },
                  { label: "Wind", value: `${weather.speed?.toFixed(1)} ${windUnit}` },
                  { label: "High", value: `${weather.temp_max?.toFixed()}°`, color: "#e8192c" },
                  { label: "Low", value: `${weather.temp_min?.toFixed()}°`, color: "rgba(120,180,255,0.9)" },
                ].map(({ label, value, color }) => (
                  <StatPill key={label} label={label} value={value} color={color} />
                ))}
              </div>
            </div>

            {/* Desktop hero: horizontal — shows md+ */}
            <div className="hidden md:flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <h1 className="font-bebas gold-text leading-none"
                    style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", letterSpacing: "0.05em", textShadow: "0 0 40px rgba(240,192,48,0.25)" }}>
                    {weather.name}
                  </h1>
                  <span className="font-bebas text-2xl md:text-3xl" style={{ color: "rgba(240,192,48,0.5)" }}>{weather.country}</span>
                </div>
                <p className="font-barlow text-xs sm:text-sm mt-0.5" style={{ color: "rgba(240,192,48,0.45)" }}>
                  {weather.lat?.toFixed(4)}°N · {weather.lon?.toFixed(4)}°E
                </p>
                <p className="font-barlow text-xs sm:text-sm" style={{ color: "rgba(240,192,48,0.4)" }}>
                  {weather.formattedLocalTime?.split("| Local time:")[0]?.trim()}
                  {weather.formattedLocalTime?.includes("Local time:") && (
                    <span className="font-bebas text-sm sm:text-base ml-2" style={{ color: "#f0c030" }}>
                      {weather.formattedLocalTime.split("Local time:")[1]?.trim()}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <img src={weather.icon} alt={weather.details} className="w-16 h-16 md:w-20 md:h-20 shrink-0"
                  style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.15) drop-shadow(0 0 16px rgba(240,192,48,0.5))" }} />
                <div>
                  <div className="flex items-start leading-none">
                    <span className="font-bebas gold-text"
                      style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", textShadow: "0 0 30px rgba(240,192,48,0.3)", lineHeight: 1 }}>
                      {weather.temp?.toFixed()}
                    </span>
                    <span className="font-bebas text-3xl mt-2 ml-1" style={{ color: "rgba(240,192,48,0.55)" }}>
                      °{units === "metric" ? "C" : "F"}
                    </span>
                  </div>
                  <p className="font-bebas text-xl tracking-wide capitalize" style={{ color: "rgba(240,192,48,0.75)" }}>
                    {weather.description || weather.details}
                  </p>
                  <p className="font-barlow text-sm" style={{ color: "rgba(240,192,48,0.5)" }}>Feels like {weather.feels_like?.toFixed()}°</p>
                </div>
              </div>

              <div className="grid grid-cols-3 md:flex md:flex-wrap gap-x-5 gap-y-2 md:gap-x-6 md:gap-y-3">
                {[
                  { label: "High",     value: `${weather.temp_max?.toFixed()}°`, color: "#e8192c" },
                  { label: "Low",      value: `${weather.temp_min?.toFixed()}°`, color: "rgba(120,180,255,0.9)" },
                  { label: "Humidity", value: `${weather.humidity}%` },
                  { label: "Wind",     value: `${weather.speed?.toFixed(1)} ${windUnit} ${weather.windDir || ""}`.trim() },
                  { label: "Sunrise",  value: weather.sunrise },
                  { label: "Sunset",   value: weather.sunset, color: "#e8192c" },
                ].map(({ label, value, color }) => (
                  <StatPill key={label} label={label} value={value} color={color} />
                ))}
              </div>
            </div>
          </div>

          <Divider />

          {/* ═══ TWO-COLUMN MIDDLE ═══ */}
          <div className="flex flex-col lg:flex-row shrink-0">
            <div className="flex-1 lg:flex-[3] px-4 sm:px-6 py-4 sm:py-5 border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: "rgba(240,192,48,0.12)" }}>
              <TemperatureAndDetails weather={weather} units={units} />
            </div>
            <div className="flex-1 lg:flex-[2] flex flex-col">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b" style={{ borderColor: "rgba(240,192,48,0.12)" }}>
                <UVAndAirQuality weather={weather} />
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <RadarGrid weather={weather} units={units} />
              </div>
            </div>
          </div>

          <Divider red />

          {/* ═══ FORECASTS — full width ═══ */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 shrink-0">
            <Forecast title="HOURLY SCAN" data={weather.hourly} />
          </div>

          <Divider />

          <div className="px-4 sm:px-6 py-4 sm:py-5 shrink-0">
            <Forecast title="DAILY PROJECTION" data={weather.daily} />
          </div>

          <Divider />
        </div>
      )}

      {/* ═══ STATUS BAR ═══ */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5"
        style={{ background: "rgba(8,6,4,0.97)", borderTop: "1px solid rgba(240,192,48,0.15)" }}>
        <span className="font-barlow text-xs tracking-wider hidden sm:block" style={{ color: "rgba(240,192,48,0.3)" }}>
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
