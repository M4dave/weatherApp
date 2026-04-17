import PropTypes from "prop-types";

const UV_LEVELS = [
  { max: 2,  label: "LOW",       color: "#00cc44", glow: "rgba(0,204,68,0.4)" },
  { max: 5,  label: "MODERATE",  color: "#f0c030", glow: "rgba(240,192,48,0.4)" },
  { max: 7,  label: "HIGH",      color: "#ff8800", glow: "rgba(255,136,0,0.4)" },
  { max: 10, label: "VERY HIGH", color: "#e8192c", glow: "rgba(232,25,44,0.4)" },
  { max: 99, label: "EXTREME",   color: "#cc00ff", glow: "rgba(204,0,255,0.4)" },
];

const getUVInfo = (v) => UV_LEVELS.find((l) => v <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];

const RSBar = ({ label, value, max = 100, color, unit = "%" }) => {
  const pct = Math.min((value / max) * 100, 100);
  const segments = 20;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-barlow text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(240,192,48,0.4)" }}>{label}</span>
        <span className="font-bebas text-sm tracking-wider" style={{ color }}>{value}{unit}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="h-2 flex-1 transition-all duration-500"
            style={{
              background: i < Math.round((pct / 100) * segments) ? color : "rgba(240,192,48,0.06)",
              boxShadow:  i < Math.round((pct / 100) * segments) ? `0 0 4px ${color}` : "none",
            }} />
        ))}
      </div>
    </div>
  );
};

RSBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  color: PropTypes.string.isRequired,
  unit: PropTypes.string,
};

const UVAndAirQuality = ({ weather: { humidity, weatherId } }) => {
  const estimateUVI = (id) => {
    if (id >= 200 && id < 700) return 1;
    if (id === 800) return 7;
    if (id === 801) return 5;
    if (id === 802) return 4;
    return 2;
  };
  const uvi = estimateUVI(weatherId);
  const uvInfo = getUVInfo(uvi);
  const humidColor = humidity < 30 ? "#f0c030" : humidity < 60 ? "#00cc44" : humidity < 80 ? "#4da6ff" : "#cc44ff";

  return (
    <div className="rs-panel rs-bracket relative p-4">
      <div className="absolute top-2 left-3 font-barlow text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(240,192,48,0.25)" }}>
        ENV Analysis
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
        <div className="space-y-1.5">
          <RSBar label="UV Index" value={uvi} max={11} color={uvInfo.color} unit="" />
          <div className="flex justify-end mt-1">
            <span className="font-bebas text-xs px-2 py-0.5 tracking-widest"
              style={{ color: uvInfo.color, border: `1px solid ${uvInfo.color}`, boxShadow: `0 0 8px ${uvInfo.glow}` }}>
              {uvInfo.label}
            </span>
          </div>
        </div>
        <RSBar label="Humidity" value={humidity} max={100} color={humidColor} unit="%" />
      </div>
    </div>
  );
};

UVAndAirQuality.propTypes = {
  weather: PropTypes.shape({
    humidity: PropTypes.number.isRequired,
    weatherId: PropTypes.number.isRequired,
  }).isRequired,
};
export default UVAndAirQuality;
