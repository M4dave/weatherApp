import PropTypes from "prop-types";

const UV_LEVELS = [
  { max: 2,  label: "Low",       color: "#00cc44", glow: "rgba(0,204,68,0.4)" },
  { max: 5,  label: "Moderate",  color: "#f0c030", glow: "rgba(240,192,48,0.4)" },
  { max: 7,  label: "High",      color: "#ff8800", glow: "rgba(255,136,0,0.4)" },
  { max: 10, label: "Very High", color: "#e8192c", glow: "rgba(232,25,44,0.4)" },
  { max: 99, label: "Extreme",   color: "#cc00ff", glow: "rgba(204,0,255,0.4)" },
];

const getUVInfo = (v) => UV_LEVELS.find((l) => v <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];

const RSBar = ({ label, value, max = 100, color, unit = "%" }) => {
  const pct = Math.min((value / max) * 100, 100);
  const segments = 20;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-barlow text-sm uppercase tracking-wider font-semibold" style={{ color: "rgba(240,192,48,0.7)" }}>{label}</span>
        <span className="font-bebas text-xl tracking-wide" style={{ color }}>{value}{unit}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="h-2.5 flex-1 transition-all duration-500"
            style={{
              background: i < Math.round((pct / 100) * segments) ? color : "rgba(240,192,48,0.07)",
              boxShadow:  i < Math.round((pct / 100) * segments) ? `0 0 4px ${color}` : "none",
            }} />
        ))}
      </div>
    </div>
  );
};

RSBar.propTypes = {
  label: PropTypes.string.isRequired, value: PropTypes.number.isRequired,
  max: PropTypes.number, color: PropTypes.string.isRequired, unit: PropTypes.string,
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
    <div className="rs-panel rs-bracket relative p-5">
      <p className="font-barlow text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: "rgba(240,192,48,0.55)" }}>
        Environmental Analysis
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <RSBar label="UV Index" value={uvi} max={11} color={uvInfo.color} unit="" />
          <div className="flex justify-end mt-1">
            <span className="font-bebas text-sm px-3 py-0.5 tracking-wider"
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
