import Input from "./components/Input";
import TimeAndLocation from "./components/TimeAndLocation";
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
    <div
      className="fixed bottom-4 right-4 z-50 font-barlow text-sm px-5 py-3 max-w-sm uppercase tracking-widest"
      style={{
        background: "#0a0806",
        border: `1px solid ${color}`,
        borderLeft: `3px solid ${color}`,
        color,
        boxShadow: `0 0 20px ${color}22`,
        animation: "flicker 0.4s ease forwards",
      }}
    >
      {notif.msg}
    </div>
  );
};

/* Rockstar star SVG */
const RockstarStar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <polygon
      points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
      fill="currentColor"
    />
  </svg>
);

const App = () => {
  const [query, setQuery]     = useState({ q: "manila" });
  const [units, setUnits]     = useState("metric");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick]       = useState(0);
  const [notif, setNotif]     = useState(null);
  const notifTimer            = useRef(null);

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
    const cityName = query.q ? query.q : "current location";
    showNotif("info", `Scanning: ${capitalizeFirstLetter(cityName)}`);
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

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <div className="min-h-screen bg-[#0a0806] px-2 py-4 md:px-6">

      {/* Top system bar */}
      <div className="flex items-center justify-between mb-4 px-1 font-barlow text-xs tracking-[0.2em] uppercase"
        style={{ color: "rgba(240,192,48,0.4)" }}>
        <div className="flex items-center gap-2">
          <RockstarStar size={12} className="text-[#f0c030] opacity-60" />
          <span>Rockstar Weather System</span>
        </div>
        <span className="blink" style={{ color: "#e8192c" }}>●</span>
        <span>{dateStr} — {timeStr}</span>
      </div>

      <div className="mx-auto max-w-screen-lg">

        {/* Header brand bar */}
        <div className="rs-panel mb-3 px-5 py-3 flex items-center justify-between">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#f0c030]/30" />
          <div className="flex items-center gap-3 px-6">
            <RockstarStar size={22} className="text-[#f0c030]" style={{ filter: "drop-shadow(0 0 6px rgba(240,192,48,0.6))" }} />
            <span className="font-bebas text-2xl tracking-[0.3em] gold-text">WEATHER INTEL</span>
            <RockstarStar size={22} className="text-[#f0c030]" style={{ filter: "drop-shadow(0 0 6px rgba(240,192,48,0.6))" }} />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f0c030]/30" />
        </div>

        {/* Main panel */}
        <div className="rs-panel relative overflow-hidden">
          <div className="rs-rule" />
          <div className="p-4 md:p-6">
            <TopButtons setQuery={setQuery} />
            <Input setQuery={setQuery} units={units} setUnits={setUnits} />

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <RockstarStar size={48} className="text-[#f0c030] star-spin opacity-80" />
                <p className="font-bebas text-[#f0c030]/60 text-xl tracking-[0.4em]">
                  ACQUIRING DATA...
                </p>
              </div>
            )}

            {!isLoading && weather && (
              <div className="flicker space-y-4">
                <TimeAndLocation weather={weather} tick={tick} />
                <TemperatureAndDetails weather={weather} units={units} />
                <UVAndAirQuality weather={weather} />
                <RadarGrid weather={weather} units={units} />
                <Forecast title="HOURLY SCAN" data={weather.hourly} />
                <Forecast title="DAILY PROJECTION" data={weather.daily} />
              </div>
            )}

            {!isLoading && !weather && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <RockstarStar size={40} className="text-[#f0c030]/20 rs-pulse" />
                <p className="font-bebas text-[#f0c030]/30 text-lg tracking-[0.4em]">ENTER LOCATION</p>
              </div>
            )}
          </div>
          <div className="rs-rule" />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between mt-2 px-1 font-barlow text-xs tracking-widest uppercase"
          style={{ color: "rgba(240,192,48,0.25)" }}>
          <span>Coords: {weather ? `${weather.lat?.toFixed(2)}° / ${weather.lon?.toFixed(2)}°` : "-- / --"}</span>
          <span style={{ color: isLoading ? "#e8192c" : weather ? "rgba(240,192,48,0.4)" : "rgba(240,192,48,0.2)" }}>
            {isLoading ? "● Scanning" : weather ? "● Online" : "● Standby"}
          </span>
          <span>R★ Weather v3.7</span>
        </div>
      </div>

      <RSNotification notif={notif} />
    </div>
  );
};

export default App;
