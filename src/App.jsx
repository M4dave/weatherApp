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

const NOTIF_TYPES = { info: "#00f5ff", success: "#00ff88", error: "#ff2d78" };

const HUDNotification = ({ notif }) => {
  if (!notif) return null;
  const color = NOTIF_TYPES[notif.type] || "#00f5ff";
  return (
    <div
      className="fixed bottom-4 right-4 z-50 font-mono-hud text-xs px-4 py-2.5 max-w-xs"
      style={{
        background: "#000c1c",
        border: `1px solid ${color}`,
        color,
        boxShadow: `0 0 16px ${color}33`,
        animation: "flicker 0.3s ease forwards",
      }}
    >
      <span className="opacity-50 mr-2">{">"}</span>
      {notif.msg}
    </div>
  );
};

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
    notifTimer.current = setTimeout(() => setNotif(null), 2500);
  }, []);

  // Clock tick for HUD timestamp
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const getWeather = useCallback(async () => {
    const cityName = query.q ? query.q : "current location";
    showNotif("info", `// SCANNING: ${capitalizeFirstLetter(cityName).toUpperCase()}`);
    setIsLoading(true);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      showNotif("success", `// LOCK ACQUIRED: ${data.name}, ${data.country}`);
      setWeather(data);
    } catch (err) {
      showNotif("error", `// ERROR: ${err.message || "TARGET NOT FOUND"}`);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, units, showNotif]);

  useEffect(() => { getWeather(); }, [getWeather]);

  const now = new Date();
  const hudTime = now.toLocaleTimeString("en-US", { hour12: false });
  const hudDate = now.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <div className="min-h-screen bg-[#000c1c] px-2 py-4 md:px-6">
      {/* Top HUD bar */}
      <div className="flex items-center justify-between mb-4 px-2 font-mono-hud text-xs text-[#00f5ff]/50">
        <span>SYS::WEATHER_OS v3.7.1</span>
        <span className="blink">■</span>
        <span>{hudDate} — {hudTime}</span>
      </div>

      <div className="mx-auto max-w-screen-lg">
        {/* Main panel */}
        <div className="hud-panel rounded-none md:rounded-sm relative overflow-hidden scan-anim">
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-60" />

          <div className="p-4 md:p-6">
            <TopButtons setQuery={setQuery} />
            <Input setQuery={setQuery} units={units} setUnits={setUnits} />

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                {/* Radar loader */}
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border border-[#00f5ff]/20" />
                  <div className="absolute inset-2 rounded-full border border-[#00f5ff]/15" />
                  <div className="absolute inset-4 rounded-full border border-[#00f5ff]/10" />
                  <div className="absolute inset-0 radar-spin origin-center">
                    <div className="w-1/2 h-px bg-gradient-to-r from-[#00f5ff] to-transparent absolute top-1/2 left-1/2 origin-left" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#00f5ff] ring-pulse" />
                  </div>
                </div>
                <p className="font-orbitron text-[#00f5ff] text-xs tracking-[0.3em] animate-pulse">
                  ACQUIRING TARGET...
                </p>
              </div>
            )}

            {!isLoading && weather && (
              <div className="flicker space-y-4">
                <TimeAndLocation weather={weather} tick={tick} />
                <TemperatureAndDetails weather={weather} units={units} />
                <UVAndAirQuality weather={weather} />
                <RadarGrid weather={weather} units={units} />
                <Forecast title="// HOURLY SCAN" data={weather.hourly} />
                <Forecast title="// DAILY PROJECTION" data={weather.daily} />
              </div>
            )}

            {!isLoading && !weather && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border border-[#00f5ff]/20 ring-pulse" />
                  <div className="absolute inset-3 rounded-full border border-[#00f5ff]/10" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#00f5ff]/30 text-3xl">?</div>
                </div>
                <p className="font-orbitron text-[#00f5ff]/40 text-xs tracking-[0.3em]">AWAITING COORDINATES</p>
              </div>
            )}
          </div>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-60" />
        </div>

        {/* Bottom HUD bar */}
        <div className="flex items-center justify-between mt-2 px-2 font-mono-hud text-xs text-[#00f5ff]/30">
          <span>LAT/LON: {weather ? `${weather.lat?.toFixed(2)}° / ${weather.lon?.toFixed(2)}°` : "-- / --"}</span>
          <span>STATUS: {isLoading ? "SCANNING" : weather ? "NOMINAL" : "STANDBY"}</span>
          <span>PWR: ████████░░ 82%</span>
        </div>
      </div>

      <HUDNotification notif={notif} />
    </div>
  );
};

export default App;
