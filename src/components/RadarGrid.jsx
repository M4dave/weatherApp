import PropTypes from "prop-types";

const WindCompass = ({ deg, speed, unit }) => {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const label = dirs[Math.round((deg ?? 0) / 22.5) % 16];
  const size = 110, cx = 55, cy = 55, r = 44;
  const rad = ((deg ?? 0) - 90) * (Math.PI / 180);
  const arrowX = cx + r * 0.62 * Math.cos(rad);
  const arrowY = cy + r * 0.62 * Math.sin(rad);
  const tailX  = cx - r * 0.25 * Math.cos(rad);
  const tailY  = cy - r * 0.25 * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r}        fill="none" stroke="rgba(240,192,48,0.12)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke="rgba(240,192,48,0.07)" strokeWidth="0.5" strokeDasharray="2 3" />
        <circle cx={cx} cy={cy} r={r * 0.3}  fill="none" stroke="rgba(240,192,48,0.07)" strokeWidth="0.5" />
        {[0,45,90,135,180,225,270,315].map((a) => {
          const ra = (a - 90) * (Math.PI / 180);
          const isCardinal = a % 90 === 0;
          return <line key={a}
            x1={cx + (r - (isCardinal ? 7 : 4)) * Math.cos(ra)} y1={cy + (r - (isCardinal ? 7 : 4)) * Math.sin(ra)}
            x2={cx + (r + 2) * Math.cos(ra)}                    y2={cy + (r + 2) * Math.sin(ra)}
            stroke={isCardinal ? "rgba(240,192,48,0.5)" : "rgba(240,192,48,0.2)"} strokeWidth={isCardinal ? "1" : "0.5"} />;
        })}
        {[["N",0],["E",90],["S",180],["W",270]].map(([l, a]) => {
          const ra = (a - 90) * (Math.PI / 180);
          return <text key={l} x={cx + (r + 10) * Math.cos(ra)} y={cy + (r + 10) * Math.sin(ra)}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(240,192,48,0.45)" fontSize="7" fontFamily="'Barlow Condensed', sans-serif">{l}</text>;
        })}
        <line x1={tailX} y1={tailY} x2={arrowX} y2={arrowY}
          stroke="#f0c030" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 4px rgba(240,192,48,0.7))" }} />
        <circle cx={arrowX} cy={arrowY} r="4" fill="#f0c030" style={{ filter: "drop-shadow(0 0 6px rgba(240,192,48,0.8))" }} />
        <circle cx={tailX} cy={tailY} r="2" fill="rgba(240,192,48,0.3)" />
        <circle cx={cx} cy={cy} r="2.5" fill="none" stroke="rgba(240,192,48,0.4)" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r="1" fill="rgba(240,192,48,0.6)" />
      </svg>
      <p className="font-bebas text-base tracking-wider" style={{ color: "#f0c030" }}>{label}</p>
      <p className="font-barlow text-xs uppercase" style={{ color: "rgba(240,192,48,0.5)" }}>{speed?.toFixed(1)} {unit}</p>
    </div>
  );
};

WindCompass.propTypes = { deg: PropTypes.number, speed: PropTypes.number, unit: PropTypes.string.isRequired };

const MiniGauge = ({ label, value, displayValue, max, color, unit }) => {
  const pct = Math.min(value / max, 1);
  const r = 32, cx = 42, cy = 42;
  const circ = 2 * Math.PI * r;
  const strokeLen = circ * pct;
  const shown = displayValue ?? Math.round(value);
  const digits = String(shown).length;
  const fontSize = digits >= 4 ? 10 : digits === 3 ? 12 : 14;

  return (
    <div className="flex flex-col items-center">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(240,192,48,0.07)" strokeWidth="5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
          strokeWidth="5" strokeDasharray={`${strokeLen} ${circ}`} strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 0.9s ease" }} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize={fontSize} fontFamily="'Bebas Neue', sans-serif" fontWeight="bold">
          {shown}
        </text>
      </svg>
      <p className="font-barlow text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(240,192,48,0.4)" }}>{label}</p>
      {unit && <p className="font-bebas text-[10px] tracking-wide" style={{ color }}>{unit}</p>}
    </div>
  );
};

MiniGauge.propTypes = {
  label: PropTypes.string.isRequired, value: PropTypes.number.isRequired,
  displayValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.number.isRequired, color: PropTypes.string.isRequired, unit: PropTypes.string,
};

const RadarGrid = ({ weather: { humidity, pressure, cloudCover, speed, windDir: _windDir }, units }) => {
  const windUnit = units === "metric" ? "m/s" : "mph";
  const dirToDeg = { N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337 };
  const windDeg = _windDir ? (dirToDeg[_windDir] ?? 0) : 0;
  const pressurePct = pressure ? Math.round(((pressure - 950) / 100) * 100) : 0;

  return (
    <div className="rs-panel relative p-4">
      <div className="absolute top-2 left-3 font-barlow text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(240,192,48,0.25)" }}>
        Sensor Array
      </div>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(232,25,44,0.4), transparent)" }} />
      <div className="flex flex-wrap justify-around items-center gap-4 mt-4">
        <WindCompass deg={windDeg} speed={speed} unit={windUnit} />
        <MiniGauge label="Humidity"  value={humidity}        max={100} color="#f0c030" unit={`${humidity}%`} />
        <MiniGauge label="Cloud Cov" value={cloudCover ?? 0} max={100} color="#e8192c" unit={`${cloudCover ?? 0}%`} />
        <MiniGauge label="Pressure"  value={pressurePct} displayValue={pressure ?? 0} max={100} color="#cc8800"
          unit={pressure ? `${pressure} hPa` : "N/A"} />
      </div>
    </div>
  );
};

RadarGrid.propTypes = {
  weather: PropTypes.shape({
    humidity: PropTypes.number.isRequired, pressure: PropTypes.number,
    cloudCover: PropTypes.number, speed: PropTypes.number.isRequired, windDir: PropTypes.string,
  }).isRequired,
  units: PropTypes.string.isRequired,
};
export default RadarGrid;
