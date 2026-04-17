import PropTypes from "prop-types";

const UV_LEVELS = [
  { max: 2,  label: "LOW",       color: "#00ff88", glow: "rgba(0,255,136,0.4)" },
  { max: 5,  label: "MODERATE",  color: "#ffe600", glow: "rgba(255,230,0,0.4)" },
  { max: 7,  label: "HIGH",      color: "#ff8c00", glow: "rgba(255,140,0,0.4)" },
  { max: 10, label: "VERY HIGH", color: "#ff2d2d", glow: "rgba(255,45,45,0.4)" },
  { max: 99, label: "EXTREME",   color: "#c020ff", glow: "rgba(192,32,255,0.4)" },
];

const getUVInfo = (v) => UV_LEVELS.find((l) => v <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];

const HUDBar = ({ label, value, max = 100, color, unit = "%" }) => {
  const pct = Math.min((value / max) * 100, 100);
  const segments = 20;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono-hud text-[9px] text-[#00f5ff]/40 tracking-[0.2em]">{label}</span>
        <span className="font-orbitron text-xs" style={{ color }}>{value}{unit}</span>
      </div>
      {/* Segmented bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 transition-all duration-500"
            style={{
              background: i < Math.round((pct / 100) * segments)
                ? color
                : "rgba(0,245,255,0.08)",
              boxShadow: i < Math.round((pct / 100) * segments)
                ? `0 0 4px ${color}`
                : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

HUDBar.propTypes = {
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

  const humidColor = humidity < 30 ? "#ffe600" : humidity < 60 ? "#00ff88" : humidity < 80 ? "#00f5ff" : "#7b2fff";

  return (
    <div className="hud-panel rounded-none p-4 relative bracket">
      <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">ENV_ANALYSIS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        <div className="space-y-1">
          <HUDBar label="UV INDEX" value={uvi} max={11} color={uvInfo.color} unit="" />
          <div className="flex justify-end">
            <span
              className="font-orbitron text-[9px] px-2 py-0.5 tracking-widest"
              style={{ color: uvInfo.color, border: `1px solid ${uvInfo.color}`, boxShadow: `0 0 8px ${uvInfo.glow}` }}
            >
              {uvInfo.label}
            </span>
          </div>
        </div>
        <HUDBar label="HUMIDITY" value={humidity} max={100} color={humidColor} unit="%" />
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
