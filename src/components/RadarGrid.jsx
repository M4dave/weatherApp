import PropTypes from "prop-types";

const WindCompass = ({ deg, speed, unit }) => {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const label = dirs[Math.round((deg ?? 0) / 22.5) % 16];
  const size = 110;
  const cx = size / 2, cy = size / 2, r = 44;
  const rad = ((deg ?? 0) - 90) * (Math.PI / 180);
  const arrowX = cx + r * 0.62 * Math.cos(rad);
  const arrowY = cy + r * 0.62 * Math.sin(rad);
  const tailX  = cx - r * 0.25 * Math.cos(rad);
  const tailY  = cy - r * 0.25 * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Rings */}
        <circle cx={cx} cy={cy} r={r}        fill="none" stroke="rgba(0,245,255,0.14)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="0.5" strokeDasharray="2 3" />
        <circle cx={cx} cy={cy} r={r * 0.3}  fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="0.5" />
        {/* All 8 direction ticks */}
        {[0,45,90,135,180,225,270,315].map((a) => {
          const ra = (a - 90) * (Math.PI / 180);
          const isCardinal = a % 90 === 0;
          return <line key={a}
            x1={cx + (r - (isCardinal ? 7 : 4)) * Math.cos(ra)}
            y1={cy + (r - (isCardinal ? 7 : 4)) * Math.sin(ra)}
            x2={cx + (r + 2) * Math.cos(ra)}
            y2={cy + (r + 2) * Math.sin(ra)}
            stroke={isCardinal ? "rgba(0,245,255,0.5)" : "rgba(0,245,255,0.2)"} strokeWidth={isCardinal ? "1" : "0.5"} />;
        })}
        {/* Cardinal labels */}
        {[["N",0],["E",90],["S",180],["W",270]].map(([l, a]) => {
          const ra = (a - 90) * (Math.PI / 180);
          return <text key={l}
            x={cx + (r + 10) * Math.cos(ra)} y={cy + (r + 10) * Math.sin(ra)}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(0,245,255,0.45)" fontSize="7" fontFamily="'Share Tech Mono', monospace">{l}</text>;
        })}
        {/* Arrow tail to head */}
        <line x1={tailX} y1={tailY} x2={arrowX} y2={arrowY}
          stroke="#00f5ff" strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 4px #00f5ff)" }} />
        {/* Arrowhead */}
        <circle cx={arrowX} cy={arrowY} r="3.5" fill="#00f5ff"
          style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
        {/* Tail dot */}
        <circle cx={tailX} cy={tailY} r="1.5" fill="rgba(0,245,255,0.3)" />
        {/* Center crosshair */}
        <circle cx={cx} cy={cy} r="2.5" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r="1"   fill="rgba(0,245,255,0.6)" />
      </svg>
      <p className="font-orbitron text-[#00f5ff] text-sm font-bold leading-none">{label}</p>
      <p className="font-mono-hud text-[#00f5ff]/50 text-xs mt-0.5">{speed?.toFixed(1)} {unit}</p>
    </div>
  );
};

WindCompass.propTypes = {
  deg: PropTypes.number,
  speed: PropTypes.number,
  unit: PropTypes.string.isRequired,
};

const MiniGauge = ({ label, value, displayValue, max, color, unit }) => {
  const pct = Math.min(value / max, 1);
  const r = 30, cx = 38, cy = 38;
  const circ = 2 * Math.PI * r;
  const strokeLen = circ * pct;
  // Show whole number in ring, unit below
  const shown = displayValue ?? Math.round(value);

  return (
    <div className="flex flex-col items-center">
      <svg width="76" height="76" viewBox="0 0 76 76">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,245,255,0.07)" strokeWidth="5" />
        {/* Progress */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
          strokeWidth="5" strokeDasharray={`${strokeLen} ${circ}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 5px ${color})`, transition: "stroke-dasharray 0.9s ease" }} />
        {/* Value */}
        <text x={cx} y={cx - 1} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="13" fontFamily="'Orbitron', sans-serif" fontWeight="bold">
          {shown}
        </text>
      </svg>
      <p className="font-mono-hud text-[9px] text-[#00f5ff]/40 tracking-widest mt-0.5 uppercase">{label}</p>
      {unit && <p className="font-orbitron text-[9px]" style={{ color }}>{unit}</p>}
    </div>
  );
};

MiniGauge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  displayValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  unit: PropTypes.string,
};

const RadarGrid = ({ weather: { humidity, pressure, cloudCover, speed, windDir: _windDir }, units }) => {
  const windUnit = units === "metric" ? "m/s" : "mph";
  const dirToDeg = { N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337 };
  const windDeg = _windDir ? (dirToDeg[_windDir] ?? 0) : 0;

  // Pressure: map 950–1050 hPa range to 0–100% for the ring
  const pressurePct = pressure ? Math.round(((pressure - 950) / 100) * 100) : 0;

  return (
    <div className="hud-panel rounded-none p-4 relative">
      <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">SENSOR_ARRAY</div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7b2fff]/40 to-transparent" />

      <div className="flex flex-wrap justify-around items-center gap-4 mt-4">
        <WindCompass deg={windDeg} speed={speed} unit={windUnit} />

        <MiniGauge
          label="HUMIDITY"
          value={humidity}
          max={100}
          color="#00f5ff"
          unit={`${humidity}%`}
        />
        <MiniGauge
          label="CLOUD COV"
          value={cloudCover ?? 0}
          max={100}
          color="#7b2fff"
          unit={`${cloudCover ?? 0}%`}
        />
        <MiniGauge
          label="PRESSURE"
          value={pressurePct}
          displayValue={pressure ?? 0}
          max={100}
          color="#ff2d78"
          unit={pressure ? `${pressure} hPa` : "N/A"}
        />
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
