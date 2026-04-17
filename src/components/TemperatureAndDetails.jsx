import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";

const TemperatureAndDetails = ({
  weather: { details, description, icon, temp, temp_min, temp_max, sunrise, sunset, speed, windDir, humidity, feels_like, visibility, pressure, cloudCover },
  units,
}) => {
  const windUnit  = units === "metric" ? "m/s" : "mph";
  const windLabel = windDir ? `${speed.toFixed(1)} ${windUnit} ${windDir}` : `${speed.toFixed(1)} ${windUnit}`;

  return (
    <div>
      <p className="font-barlow text-base sm:text-xl uppercase tracking-wider mb-3 sm:mb-4 text-center"
        style={{ color: "rgba(240,192,48,0.75)" }}>
        {description || details}
      </p>

      {/* 3-panel grid: single col on mobile, 3 col on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">

        {/* Condition icon */}
        <div className="rs-panel rs-bracket relative p-4 sm:p-5 flex flex-row sm:flex-col items-center gap-4 sm:gap-0 sm:justify-center">
          <p className="font-barlow text-xs uppercase tracking-wider hidden sm:block absolute top-3 left-4"
            style={{ color: "rgba(240,192,48,0.5)" }}>Condition</p>
          <div className="relative sm:mt-4 shrink-0">
            <div className="rs-pulse absolute inset-0 rounded-full border border-[#f0c030]/15 scale-125" />
            <img src={icon} alt={details} className="w-16 h-16 sm:w-24 sm:h-24 relative z-10"
              style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 12px rgba(240,192,48,0.4))" }} />
          </div>
          <p className="font-bebas text-base sm:text-lg tracking-wide uppercase sm:mt-3 text-left sm:text-center"
            style={{ color: "#f0c030" }}>
            {description || details}
          </p>
        </div>

        {/* Big temperature */}
        <div className="rs-panel rs-bracket relative p-4 sm:p-5 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-0">
          <p className="font-barlow text-xs uppercase tracking-wider hidden sm:block absolute top-3 left-4"
            style={{ color: "rgba(240,192,48,0.5)" }}>Temperature</p>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8192c] to-transparent opacity-50" />
          <div className="flex items-start leading-none sm:my-2 sm:mt-4">
            <span className="font-bebas gold-text" style={{ fontSize: "clamp(3rem,8vw,5.5rem)" }}>{temp.toFixed()}</span>
            <span className="font-bebas text-2xl sm:text-4xl mt-1 sm:mt-2" style={{ color: "rgba(240,192,48,0.6)" }}>°</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-5 font-barlow text-sm sm:text-base font-semibold">
            <span className="flex items-center gap-1" style={{ color: "#e8192c" }}>
              <MdKeyboardArrowUp size={14} /> {temp_max.toFixed()}° High
            </span>
            <span className="flex items-center gap-1" style={{ color: "rgba(120,180,255,0.9)" }}>
              <MdKeyboardArrowDown size={14} /> {temp_min.toFixed()}° Low
            </span>
          </div>
          <p className="font-barlow text-xs sm:text-sm hidden sm:block sm:mt-2" style={{ color: "rgba(240,192,48,0.6)" }}>
            Feels like {feels_like.toFixed()}°
          </p>
        </div>

        {/* Sunrise / Sunset */}
        <div className="rs-panel rs-bracket relative p-4 sm:p-5 flex flex-row sm:flex-col justify-around sm:justify-center gap-3 sm:gap-5">
          <p className="font-barlow text-xs uppercase tracking-wider hidden sm:block absolute top-3 left-4"
            style={{ color: "rgba(240,192,48,0.5)" }}>Sun Times</p>
          <div className="flex items-center gap-3 sm:mt-4">
            <GiSunrise size={22} className="shrink-0" style={{ color: "#f0c030" }} />
            <div>
              <p className="font-barlow text-xs uppercase tracking-wider" style={{ color: "rgba(240,192,48,0.55)" }}>Sunrise</p>
              <p className="font-bebas text-lg sm:text-2xl tracking-wide" style={{ color: "#f0c030" }}>{sunrise}</p>
            </div>
          </div>
          <div className="hidden sm:block h-px" style={{ background: "rgba(240,192,48,0.15)" }} />
          <div className="flex items-center gap-3">
            <GiSunset size={22} className="shrink-0" style={{ color: "#e8192c" }} />
            <div>
              <p className="font-barlow text-xs uppercase tracking-wider" style={{ color: "rgba(240,192,48,0.55)" }}>Sunset</p>
              <p className="font-bebas text-lg sm:text-2xl tracking-wide" style={{ color: "#e8192c" }}>{sunset}</p>
            </div>
          </div>
        </div>

        {/* Stats strip — full width */}
        <div className="sm:col-span-3 rs-panel relative p-3 sm:p-4 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-around gap-y-2 sm:gap-y-3">
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(240,192,48,0.35), transparent)" }} />
          {[
            { label: "Humidity",    value: `${humidity}%` },
            { label: "Wind",        value: windLabel },
            { label: "Pressure",    value: pressure ? `${pressure} hPa` : "N/A" },
            { label: "Visibility",  value: visibility ? `${visibility} km` : "N/A" },
            { label: "Cloud Cover", value: cloudCover !== null ? `${cloudCover}%` : "N/A" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col px-2 sm:px-3">
              <span className="font-barlow text-xs uppercase tracking-wider" style={{ color: "rgba(240,192,48,0.55)" }}>{label}</span>
              <span className="font-bebas text-lg sm:text-xl tracking-wide" style={{ color: "#f0c030" }}>{value}</span>
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
