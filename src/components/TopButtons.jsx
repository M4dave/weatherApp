import PropTypes from "prop-types";

const CITIES = [
  { id: 1, name: "Manila",   flag: "🇵🇭" },
  { id: 2, name: "Tokyo",    flag: "🇯🇵" },
  { id: 3, name: "New York", flag: "🇺🇸" },
  { id: 4, name: "London",   flag: "🇬🇧" },
  { id: 5, name: "Dubai",    flag: "🇦🇪" },
];

const TopButtons = ({ setQuery, onSelect }) => (
  <div className="flex flex-wrap gap-1.5">
    {CITIES.map((city) => (
      <button
        key={city.id}
        onClick={() => { setQuery({ q: city.name }); onSelect?.(); }}
        aria-label={`Show weather for ${city.name}`}
        className="group relative flex items-center gap-1.5 px-3 py-1.5 font-barlow text-xs tracking-wide uppercase
          bg-[#0a0806] border border-[#f0c030]/20 text-[#f0c030]/55
          hover:border-[#f0c030]/65 hover:text-[#f0c030] hover:bg-[#f0c030]/5
          transition-all duration-150 active:scale-95 focus:outline-none"
      >
        <span className="text-sm leading-none">{city.flag}</span>
        <span className="font-barlow font-semibold">{city.name}</span>
        <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#f0c030]/30 group-hover:border-[#f0c030]" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#f0c030]/30 group-hover:border-[#f0c030]" />
      </button>
    ))}
  </div>
);

TopButtons.propTypes = {
  setQuery: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};
export default TopButtons;
