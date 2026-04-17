import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";

const TemperatureAndDetails = ({
  weather: { details, description, icon, temp, temp_min, temp_max, sunrise, sunset, speed, windDir, humidity, feels_like, visibility, pressure, cloudCover },
  units,
}) => {
  const windUnit = units === "metric" ? "m/s" : "mph";
  const windLabel = windDir ? `${speed.toFixed(1)} ${windUnit} ${windDir}` : `${speed.toFixed(1)} ${windUnit}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

      {/* LEFT: Icon + condition */}
      <div className="hud-panel rounded-none p-4 flex flex-col items-center justify-center bracket relative">
        <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">COND</div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full border border-[#00f5ff]/20 ring-pulse scale-125" />
          <img src={icon} alt={details} className="w-24 h-24 relative z-10 drop-shadow-[0_0_12px_rgba(0,245,255,0.5)]" />
        </div>
        <p className="font-orbitron text-[#00f5ff]/80 text-xs tracking-widest uppercase mt-3 text-center">
          {description || details}
        </p>
      </div>

      {/* CENTER: Big temperature */}
      <div className="hud-panel rounded-none p-4 flex flex-col items-center justify-center relative bracket">
        <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">TEMP</div>
        <div className="flex items-start leading-none mb-2">
          <span className="font-orbitron font-black text-7xl md:text-8xl neon-text">
            {temp.toFixed()}
          </span>
          <span className="font-orbitron text-3xl text-[#00f5ff]/60 mt-2">°</span>
        </div>
        <div className="flex gap-4 text-xs font-mono-hud">
          <span className="flex items-center gap-1 text-red-400/80">
            <MdKeyboardArrowUp size={14} />{temp_max.toFixed()}°
          </span>
          <span className="text-[#00f5ff]/20">|</span>
          <span className="flex items-center gap-1 text-blue-400/80">
            <MdKeyboardArrowDown size={14} />{temp_min.toFixed()}°
          </span>
        </div>
        <p className="font-mono-hud text-[#00f5ff]/40 text-xs mt-2 tracking-wider">
          FEELS {feels_like.toFixed()}°
        </p>
      </div>

      {/* RIGHT: Sun times */}
      <div className="hud-panel rounded-none p-4 flex flex-col justify-center gap-3 relative bracket">
        <div className="absolute top-2 left-2 font-mono-hud text-[8px] text-[#00f5ff]/30 tracking-widest">SOL</div>
        <div className="flex items-center gap-3">
          <GiSunrise size={24} className="text-yellow-400/70 shrink-0" />
          <div>
            <p className="text-[#00f5ff]/30 text-[9px] tracking-widest font-mono-hud">SUNRISE</p>
            <p className="font-orbitron text-yellow-400/80 text-sm">{sunrise}</p>
          </div>
        </div>
        <div className="h-px bg-[#00f5ff]/10" />
        <div className="flex items-center gap-3">
          <GiSunset size={24} className="text-orange-400/70 shrink-0" />
          <div>
            <p className="text-[#00f5ff]/30 text-[9px] tracking-widest font-mono-hud">SUNSET</p>
            <p className="font-orbitron text-orange-400/80 text-sm">{sunset}</p>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: inline stat readouts */}
      <div className="md:col-span-3 hud-panel rounded-none p-3 flex flex-wrap justify-around gap-y-2 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff]/30 to-transparent" />
        {[
          { label: "HUMIDITY",   value: `${humidity}%` },
          { label: "WIND",       value: windLabel },
          { label: "PRESSURE",   value: pressure ? `${pressure} hPa` : "N/A" },
          { label: "VISIBILITY", value: visibility ? `${visibility} km` : "N/A" },
          { label: "CLOUD COV.", value: cloudCover !== null ? `${cloudCover}%` : "N/A" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center px-3">
            <span className="font-mono-hud text-[9px] text-[#00f5ff]/30 tracking-[0.2em]">{label}</span>
            <span className="font-orbitron text-[#00f5ff] text-sm font-bold mt-0.5">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

TemperatureAndDetails.propTypes = {
  weather: PropTypes.shape({
    details: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    temp_min: PropTypes.number.isRequired,
    temp_max: PropTypes.number.isRequired,
    sunrise: PropTypes.string.isRequired,
    sunset: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    windDir: PropTypes.string,
    humidity: PropTypes.number.isRequired,
    feels_like: PropTypes.number.isRequired,
    visibility: PropTypes.string,
    pressure: PropTypes.number,
    cloudCover: PropTypes.number,
  }).isRequired,
  units: PropTypes.string.isRequired,
};

export default TemperatureAndDetails;
