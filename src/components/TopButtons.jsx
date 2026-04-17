import PropTypes from "prop-types";

const CITIES = [
  { id: 1, name: "Manila",   flag: "🇵🇭", code: "MNL" },
  { id: 2, name: "Tokyo",    flag: "🇯🇵", code: "TYO" },
  { id: 3, name: "New York", flag: "🇺🇸", code: "NYC" },
  { id: 4, name: "London",   flag: "🇬🇧", code: "LDN" },
  { id: 5, name: "Dubai",    flag: "🇦🇪", code: "DXB" },
];

const TopButtons = ({ setQuery }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-5">
    {CITIES.map((city) => (
      <button
        key={city.id}
        onClick={() => setQuery({ q: city.name })}
        aria-label={`Show weather for ${city.name}`}
        className="group relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono-hud
          bg-[#000c1c] border border-[#00f5ff]/20 text-[#00f5ff]/60
          hover:border-[#00f5ff]/70 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5
          transition-all duration-200 active:scale-95
          focus:outline-none focus:border-[#00f5ff]/60"
      >
        <span className="text-base leading-none">{city.flag}</span>
        <span className="tracking-widest">{city.code}</span>
        {/* corner accent */}
        <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00f5ff]/40 group-hover:border-[#00f5ff]" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#00f5ff]/40 group-hover:border-[#00f5ff]" />
      </button>
    ))}
  </div>
);

TopButtons.propTypes = { setQuery: PropTypes.func.isRequired };
export default TopButtons;
