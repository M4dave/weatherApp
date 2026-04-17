import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";

const StatCard = ({ label, value }) => (
  <div className="rs-panel rs-bracket relative flex flex-col items-center px-4 py-3 flex-1 min-w-[80px]">
    <span className="font-barlow text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(240,192,48,0.35)" }}>{label}</span>
    <span className="font-bebas text-lg tracking-wide" style={{ color: "#f0c030" }}>{value}</span>
  </div>
);

StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.string.isRequired };

const TemperatureAndDetails = ({
  weather: { details, description, icon, temp, temp_min, temp_max, sunrise, sunset, speed, windDir, humidity, feels_like, visibility, pressure, cloudCover },
  units,
}) => {
  const windUnit = units === "metric" ? "m/s" : "mph";
  const windLabel = windDir ? `${speed.toFixed(1)} ${windUnit} ${windDir}` : `${speed.toFixed(1)} ${windUnit}`;

  return (
    <div>
      {/* Condition */}
      <p className="text-center font-barlow text-lg uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(240,192,48,0.6)" }}>
        {description || details}
      </p>

      {/* Main 3-panel row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">

        {/* Condition icon */}
        <div className="rs-panel rs-bracket relative p-4 flex flex-col items-center justify-center">
          <div className="text-[9px] font-barlow uppercase tracking-[0.2em] absolute top-2 left-3" style={{ color: "rgba(240,192,48,0.25)" }}>COND</div>
          <div className="relative mt-2">
            <div className="rs-pulse absolute inset-0 rounded-full border border-[#f0c030]/15 scale-125" />
            <img src={icon} alt={details} className="w-24 h-24 relative z-10"
              style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 12px rgba(240,192,48,0.4))" }} />
          </div>
          <p className="font-bebas text-sm tracking-widest uppercase mt-2 text-center" style={{ color: "rgba(240,192,48,0.7)" }}>
            {description || details}
          </p>
        </div>

        {/* Big temperature */}
        <div className="rs-panel rs-bracket relative p-4 flex flex-col items-center justify-center">
          <div className="text-[9px] font-barlow uppercase tracking-[0.2em] absolute top-2 left-3" style={{ color: "rgba(240,192,48,0.25)" }}>TEMP</div>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8192c] to-transparent opacity-50" />
          <div className="flex items-start leading-none my-2">
            <span className="font-bebas gold-text" style={{ fontSize: "5.5rem" }}>{temp.toFixed()}</span>
            <span className="font-bebas text-3xl mt-2" style={{ color: "rgba(240,192,48,0.5)" }}>°</span>
          </div>
          <div className="flex gap-4 font-barlow text-sm uppercase tracking-wide">
            <span className="flex items-center gap-1" style={{ color: "#e8192c" }}>
              <MdKeyboardArrowUp size={14} />{temp_max.toFixed()}°
            </span>
            <span style={{ color: "rgba(240,192,48,0.2)" }}>|</span>
            <span className="flex items-center gap-1" style={{ color: "rgba(100,180,255,0.8)" }}>
              <MdKeyboardArrowDown size={14} />{temp_min.toFixed()}°
            </span>
          </div>
          <p className="font-barlow text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(240,192,48,0.35)" }}>
            Feels {feels_like.toFixed()}°
          </p>
        </div>

        {/* Sunrise / Sunset */}
        <div className="rs-panel rs-bracket relative p-4 flex flex-col justify-center gap-4">
          <div className="text-[9px] font-barlow uppercase tracking-[0.2em] absolute top-2 left-3" style={{ color: "rgba(240,192,48,0.25)" }}>SOL</div>
          <div className="flex items-center gap-3 mt-2">
            <GiSunrise size={22} className="shrink-0" style={{ color: "rgba(240,192,48,0.7)" }} />
            <div>
              <p className="font-barlow text-[9px] uppercase tracking-widest" style={{ color: "rgba(240,192,48,0.3)" }}>Sunrise</p>
              <p className="font-bebas text-lg tracking-wider" style={{ color: "#f0c030" }}>{sunrise}</p>
            </div>
          </div>
          <div className="h-px" style={{ background: "rgba(240,192,48,0.1)" }} />
          <div className="flex items-center gap-3">
            <GiSunset size={22} className="shrink-0" style={{ color: "#e8192c" }} />
            <div>
              <p className="font-barlow text-[9px] uppercase tracking-widest" style={{ color: "rgba(240,192,48,0.3)" }}>Sunset</p>
              <p className="font-bebas text-lg tracking-wider" style={{ color: "#e8192c" }}>{sunset}</p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="md:col-span-3 rs-panel relative p-3 flex flex-wrap justify-around gap-y-2">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(240,192,48,0.3), transparent)" }} />
          {[
            { label: "Humidity",   value: `${humidity}%` },
            { label: "Wind",       value: windLabel },
            { label: "Pressure",   value: pressure ? `${pressure} hPa` : "N/A" },
            { label: "Visibility", value: visibility ? `${visibility} km` : "N/A" },
            { label: "Cloud Cov.", value: cloudCover !== null ? `${cloudCover}%` : "N/A" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center px-3">
              <span className="font-barlow text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(240,192,48,0.3)" }}>{label}</span>
              <span className="font-bebas text-base tracking-wide" style={{ color: "#f0c030" }}>{value}</span>
            </div>
          ))}
        </div>
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
