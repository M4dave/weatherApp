import PropTypes from "prop-types";

const TimeAndLocation = ({ weather: { formattedLocalTime, name, country, lat, lon } }) => {
  const parts = formattedLocalTime.split("| Local time:");
  const datePart = parts[0]?.trim() ?? formattedLocalTime;
  const timePart = parts[1]?.trim() ?? "";

  return (
    <div className="relative py-5 text-center border-b mb-2" style={{ borderColor: "rgba(240,192,48,0.12)" }}>
      {/* Section label */}
      <div className="flex items-center gap-3 justify-content mb-4 justify-center">
        <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(240,192,48,0.4))" }} />
        <span className="font-barlow text-xs tracking-[0.35em] uppercase" style={{ color: "rgba(240,192,48,0.4)" }}>
          Location Acquired
        </span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, rgba(240,192,48,0.4), transparent)" }} />
      </div>

      {/* City name — massive Bebas Neue */}
      <h1 className="font-bebas uppercase tracking-wider mb-1 leading-none gold-text"
        style={{ fontSize: "clamp(3rem, 10vw, 6rem)", letterSpacing: "0.08em" }}>
        {name}
      </h1>

      {/* Country + coords */}
      <p className="font-barlow text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(240,192,48,0.45)" }}>
        {country} &nbsp;·&nbsp; {lat?.toFixed(4)}°N &nbsp;{lon?.toFixed(4)}°E
      </p>

      {/* Date / time */}
      <div className="flex items-center justify-center gap-4">
        <span className="font-barlow text-sm uppercase tracking-widest" style={{ color: "rgba(240,192,48,0.35)" }}>
          {datePart}
        </span>
        <span className="font-bebas text-xl tracking-[0.15em] gold-text">{timePart}</span>
      </div>
    </div>
  );
};

TimeAndLocation.propTypes = {
  weather: PropTypes.shape({
    formattedLocalTime: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    lat: PropTypes.number,
    lon: PropTypes.number,
  }).isRequired,
};
export default TimeAndLocation;
