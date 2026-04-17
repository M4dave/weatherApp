import PropTypes from "prop-types";

const TimeAndLocation = ({ weather: { formattedLocalTime, name, country, lat, lon } }) => {
  const parts = formattedLocalTime.split("| Local time:");
  const datePart = parts[0]?.trim() ?? formattedLocalTime;
  const timePart = parts[1]?.trim() ?? "";

  return (
    <div className="relative py-5 text-center border-b mb-2" style={{ borderColor: "rgba(240,192,48,0.15)" }}>
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(240,192,48,0.4))" }} />
        <span className="font-barlow text-sm uppercase tracking-wider" style={{ color: "rgba(240,192,48,0.55)" }}>
          Location Acquired
        </span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, rgba(240,192,48,0.4), transparent)" }} />
      </div>

      {/* City name */}
      <h1 className="font-bebas uppercase leading-none gold-text mb-2"
        style={{ fontSize: "clamp(3rem, 10vw, 6rem)", letterSpacing: "0.06em" }}>
        {name}
      </h1>

      {/* Country + coords */}
      <p className="font-barlow text-base uppercase tracking-wider mb-3" style={{ color: "rgba(240,192,48,0.6)" }}>
        {country} &nbsp;·&nbsp; {lat?.toFixed(4)}°N &nbsp;{lon?.toFixed(4)}°E
      </p>

      {/* Date / time */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span className="font-barlow text-base" style={{ color: "rgba(240,192,48,0.55)" }}>{datePart}</span>
        <span className="font-bebas text-2xl tracking-wider gold-text">{timePart}</span>
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
