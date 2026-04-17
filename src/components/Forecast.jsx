import PropTypes from "prop-types";

const Forecast = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <p className="font-barlow text-sm uppercase tracking-wider text-center py-3" style={{ color: "rgba(240,192,48,0.3)" }}>No data available</p>;
  }

  const isDaily = data[0]?.temp_max !== undefined;

  return (
    <div className="mt-3">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1" style={{ background: "rgba(240,192,48,0.15)" }} />
        <span className="font-bebas text-lg tracking-widest uppercase" style={{ color: "rgba(240,192,48,0.7)" }}>
          ★ {title}
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(240,192,48,0.15)" }} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {data.map((d, i) => (
          <div
            key={d.date}
            className={`group relative flex flex-col items-center flex-shrink-0 p-3 transition-all duration-150 cursor-default
              ${isDaily ? "min-w-[100px]" : "min-w-[82px]"}`}
            style={{ background: "#0a0806", border: "1px solid rgba(240,192,48,0.18)", animationDelay: `${i * 50}ms` }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(240,192,48,0.55)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(240,192,48,0.18)"}
          >
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: "rgba(240,192,48,0.3)" }} />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: "rgba(240,192,48,0.3)" }} />

            {/* Time / date */}
            <p className={`font-barlow text-xs font-semibold uppercase tracking-wide mb-1.5 text-center leading-tight ${isDaily ? "whitespace-normal" : "whitespace-nowrap"}`}
              style={{ color: "rgba(240,192,48,0.65)" }}>
              {d.title}
            </p>

            {/* Icon */}
            <img src={d.icon} alt={d.description || "weather"} className="w-11 h-11"
              style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 5px rgba(240,192,48,0.4))" }} />

            {/* Temp */}
            <p className="font-bebas text-xl tracking-wide mt-1.5" style={{ color: "#f0c030" }}>
              {d.temp.toFixed()}°
            </p>

            {/* Hi / Lo */}
            {d.temp_max !== undefined && (
              <p className="font-barlow text-xs font-semibold mt-0.5 whitespace-nowrap">
                <span style={{ color: "#e8192c" }}>{d.temp_max.toFixed()}°</span>
                <span style={{ color: "rgba(240,192,48,0.25)" }}> / </span>
                <span style={{ color: "rgba(120,170,255,0.8)" }}>{d.temp_min.toFixed()}°</span>
              </p>
            )}

            {/* Precipitation */}
            {(d.pop ?? 0) > 0 && (
              <p className="font-barlow text-xs font-semibold mt-0.5" style={{ color: "rgba(120,170,255,0.85)" }}>
                💧 {Math.round(d.pop * 100)}%
              </p>
            )}

            {/* Description */}
            {d.description && (
              <p className="font-barlow text-xs mt-1 text-center capitalize leading-tight w-full"
                style={{ color: "rgba(240,192,48,0.45)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired, title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired, temp: PropTypes.number.isRequired,
    description: PropTypes.string, temp_min: PropTypes.number, temp_max: PropTypes.number, pop: PropTypes.number,
  })),
};
export default Forecast;
