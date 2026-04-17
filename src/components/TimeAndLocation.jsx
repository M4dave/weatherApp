import PropTypes from "prop-types";

const TimeAndLocation = ({ weather: { formattedLocalTime, name, country, lat, lon } }) => {
  const parts = formattedLocalTime.split("| Local time:");
  const datePart = parts[0]?.trim() ?? formattedLocalTime;
  const timePart = parts[1]?.trim() ?? "";

  return (
    <div className="relative py-4 text-center border-b border-[#00f5ff]/10 mb-2">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3 justify-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00f5ff]/30 max-w-[80px]" />
        <span className="font-orbitron text-[#00f5ff]/40 text-xs tracking-[0.3em]">TARGET ACQUIRED</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00f5ff]/30 max-w-[80px]" />
      </div>

      {/* City name */}
      <h1 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight mb-1 neon-text uppercase">
        {name}
      </h1>
      <p className="font-mono-hud text-[#00f5ff]/50 text-sm tracking-widest mb-3">
        [{country}] &nbsp;·&nbsp; {lat?.toFixed(4)}°N &nbsp;{lon?.toFixed(4)}°E
      </p>

      {/* Time and date */}
      <div className="flex items-center justify-center gap-4 font-mono-hud text-sm">
        <span className="text-[#00f5ff]/40 text-xs">{datePart}</span>
        <span className="text-[#00f5ff] font-bold tracking-widest text-base">{timePart}</span>
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
