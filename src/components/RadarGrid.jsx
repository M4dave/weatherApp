import PropTypes from "prop-types";

const WindCompass = ({ deg, speed, unit }) => {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const label = dirs[Math.round((deg ?? 0) / 22.5) % 16];
  const size = 96;
  const cx = size / 2, cy = size / 2, r = 40;
  const rad = ((deg ?? 0) - 90) * (Math.PI / 180);
  const arrowX = cx + r * 0.6 * Math.cos(rad);
  const arrowY = cy + r * 0.6 * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Rings */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,245,255,0.12)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={r * 0.25} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="0.5" />
        {/* Cardinal ticks */}
        {[0, 90, 180, 270].map((a) => {
          const ra = (a - 90) * (Math.PI / 180);
          return <line key={a}
            x1={cx + (r - 5) * Math.cos(ra)} y1={cy + (r - 5) * Math.sin(ra)}
            x2={cx + (r + 1) * Math.cos(ra)} y2={cy + (r + 1) * Math.sin(ra)}
            stroke="rgba(0,245,255,0.4)" strokeWidth="1" />;
        })}
        {/* N/E/S/W labels */}
        {[["N",0],["E",90],["S",180],["W",270]].map(([l, a]) => {
          const ra = (a - 90) * (Math.PI / 180);
          return <text key={l} x={cx + (r + 8) * Math.cos(ra)} y={cy + (r + 8) * Math.sin(ra)}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(0,245,255,0.4)" fontSize="7" fontFamily="'Share Tech Mono', monospace">{l}</text>;
        })}
        {/* Arrow */}
        <line x1={cx} y1={cy} x2={arrowX} y2={arrowY}
          stroke="#00f5ff" strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 4px #00f5ff)" }} />
        <circle cx={arrowX} cy={arrowY} r="3" fill="#00f5ff" style={{ filter: "drop-shadow(0 0 4px #00f5ff)" }} />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="2" fill="rgba(0,245,255,0.5)" />
      </svg>
      <p className="font-orbitron text-[#00f5ff] text-sm font-bold">{label}</p>
      <p className="font-mono-hud text-[#00f5ff]/50 text-xs">{speed?.toFixed(1)} {unit}</p>
    </div>
  );
};

WindCompass.propTypes = {
  deg: PropTypes.number,
  speed: PropTypes.number,
  unit: PropTypes.string.isRequired,
};

const MiniGauge = ({ label, value, max, color, suffix }) => {
  const pct = Math.min(value / max, 1);
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const stroke = circ * pct;

  return (
    <div className="flex flex-col items-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="4" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
          strokeWidth="4" strokeDasharray={`${stroke} ${circ}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dasharray 0.8s ease" }} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="12" fontFamily="'Orbitron', sans-serif" fontWeight="bold">
          {value}
        </text>
      </svg>
      <p className="font-mono-hud text-[9px] text-[#00f5ff]/40 tracking-widest mt-1">{label}</p>
      <p className="font-mono-hud text-[10px] text-[#00f5ff]/30">{suffix}</p>
    </div>
  );
};

MiniGauge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired,
};

const RadarGrid = ({ weather: { humidity, pressure, cloudCover, speed, windDir: _windDir }, units }) => {
  const windUnit = units === "metric" ? "m/s" : "mph";

  // Estimate wind degree from direction label (reverse of what service does)
  const dirToDeg = { N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337 };
  const windDeg = _windDir ? (dirToDeg[_windDir] ?? 0) : 0;

  return (
    <div className="hud-panel rounded-none p-4 relative">
      <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">SENSOR_ARRAY</div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7b2fff]/40 to-transparent" />

      <div className="flex flex-wrap justify-around items-center gap-4 mt-3">
        <WindCompass deg={windDeg} speed={speed} unit={windUnit} />
        <MiniGauge label="HUMIDITY"  value={humidity}           max={100}  color="#00f5ff" suffix="%" />
        <MiniGauge label="CLOUD COV" value={cloudCover ?? 0}    max={100}  color="#7b2fff" suffix="%" />
        <MiniGauge label="PRESSURE"  value={pressure ? Math.round((pressure / 1050) * 100) : 0} max={100} color="#ff2d78" suffix={`${pressure ?? 0} hPa`} />
      </div>
    </div>
  );
};

RadarGrid.propTypes = {
  weather: PropTypes.shape({
    humidity: PropTypes.number.isRequired,
    pressure: PropTypes.number,
    cloudCover: PropTypes.number,
    speed: PropTypes.number.isRequired,
    windDir: PropTypes.string,
  }).isRequired,
  units: PropTypes.string.isRequired,
};

export default RadarGrid;
