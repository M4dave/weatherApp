import PropTypes from "prop-types";

const Forecast = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <p className="font-mono-hud text-[#00f5ff]/20 text-xs text-center py-3">// NO DATA</p>;
  }

  return (
    <div className="mt-2">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-[#00f5ff]/10" />
        <span className="font-mono-hud text-[#00f5ff]/40 text-xs tracking-widest">{title}</span>
        <div className="h-px flex-1 bg-[#00f5ff]/10" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {data.map((d, i) => (
          <div
            key={d.date}
            className="group relative flex flex-col items-center min-w-[76px] flex-shrink-0
              border border-[#00f5ff]/15 hover:border-[#00f5ff]/50
              bg-[#000c1c] hover:bg-[#00f5ff]/5
              p-2.5 transition-all duration-200"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* top bracket */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f5ff]/20 group-hover:border-[#00f5ff]/60" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f5ff]/20 group-hover:border-[#00f5ff]/60" />

            <p className="font-mono-hud text-[#00f5ff]/40 text-[10px] tracking-widest whitespace-nowrap mb-1">{d.title}</p>
            <img
              src={d.icon}
              alt={d.description || "weather"}
              className="w-10 h-10"
              style={{ filter: "drop-shadow(0 0 6px rgba(0,245,255,0.4)) saturate(0) brightness(2)" }}
            />
            <p className="font-orbitron text-[#00f5ff] text-sm font-bold mt-1">{d.temp.toFixed()}°</p>
            {d.temp_max !== undefined && (
              <p className="font-mono-hud text-[#00f5ff]/25 text-[9px] whitespace-nowrap">
                {d.temp_max.toFixed()}° / {d.temp_min.toFixed()}°
              </p>
            )}
            {(d.pop ?? 0) > 0 && (
              <p className="font-mono-hud text-blue-400/70 text-[9px] mt-0.5">
                💧 {Math.round(d.pop * 100)}%
              </p>
            )}
            {d.description && (
              <p className="font-mono-hud text-[#00f5ff]/20 text-[8px] mt-0.5 text-center capitalize leading-tight whitespace-nowrap overflow-hidden max-w-[70px] text-ellipsis">
                {d.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Forecast.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
      description: PropTypes.string,
      temp_min: PropTypes.number,
      temp_max: PropTypes.number,
      pop: PropTypes.number,
    })
  ),
};

export default Forecast;
