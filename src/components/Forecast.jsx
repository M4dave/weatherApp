import PropTypes from "prop-types";

const Forecast = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <p className="font-barlow text-xs uppercase tracking-widest text-center py-3" style={{ color: "rgba(240,192,48,0.2)" }}>No data</p>;
  }

  const isDaily = data[0]?.temp_max !== undefined;

  return (
    <div className="mt-3">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1" style={{ background: "rgba(240,192,48,0.12)" }} />
        <span className="font-bebas text-sm tracking-[0.3em] uppercase" style={{ color: "rgba(240,192,48,0.5)" }}>
          ★ {title}
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(240,192,48,0.12)" }} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {data.map((d, i) => (
          <div
            key={d.date}
            className={`group relative flex flex-col items-center flex-shrink-0
              border hover:bg-[#f0c030]/5 p-2.5 transition-all duration-150
              ${isDaily ? "min-w-[92px]" : "min-w-[76px]"}`}
            style={{
              background: "#0a0806",
              borderColor: "rgba(240,192,48,0.15)",
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(240,192,48,0.5)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(240,192,48,0.15)"}
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: "rgba(240,192,48,0.25)" }} />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: "rgba(240,192,48,0.25)" }} />

            <p className={`font-barlow text-[10px] uppercase tracking-wide mb-1 text-center leading-tight ${isDaily ? "whitespace-normal" : "whitespace-nowrap"}`}
              style={{ color: "rgba(240,192,48,0.45)" }}>
              {d.title}
            </p>

            <img src={d.icon} alt={d.description || "weather"} className="w-10 h-10"
              style={{ filter: "sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1) drop-shadow(0 0 5px rgba(240,192,48,0.4))" }} />

            <p className="font-bebas tracking-wider mt-1" style={{ fontSize: "1rem", color: "#f0c030" }}>
              {d.temp.toFixed()}°
            </p>

            {d.temp_max !== undefined && (
              <p className="font-barlow text-[9px] whitespace-nowrap mt-0.5">
                <span style={{ color: "#e8192c" }}>{d.temp_max.toFixed()}°</span>
                <span style={{ color: "rgba(240,192,48,0.2)" }}> / </span>
                <span style={{ color: "rgba(100,160,255,0.7)" }}>{d.temp_min.toFixed()}°</span>
              </p>
            )}

            {(d.pop ?? 0) > 0 && (
              <p className="font-barlow text-[9px] mt-0.5" style={{ color: "rgba(100,160,255,0.7)" }}>
                💧 {Math.round(d.pop * 100)}%
              </p>
            )}

            {d.description && (
              <p className="font-barlow text-[8px] mt-0.5 text-center capitalize leading-tight w-full"
                style={{ color: "rgba(240,192,48,0.2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
