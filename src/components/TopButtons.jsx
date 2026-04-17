import PropTypes from "prop-types";

const CITIES = [
  { id: 1, name: "Manila",   flag: "🇵🇭", code: "Manila" },
  { id: 2, name: "Tokyo",    flag: "🇯🇵", code: "Tokyo" },
  { id: 3, name: "New York", flag: "🇺🇸", code: "New York" },
  { id: 4, name: "London",   flag: "🇬🇧", code: "London" },
  { id: 5, name: "Dubai",    flag: "🇦🇪", code: "Dubai" },
];

const TopButtons = ({ setQuery }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-5">
    {CITIES.map((city) => (
      <button
        key={city.id}
        onClick={() => setQuery({ q: city.name })}
        aria-label={`Show weather for ${city.name}`}
        className="group relative flex items-center gap-2 px-4 py-2 font-barlow text-sm tracking-wide uppercase
          bg-[#0a0806] border border-[#f0c030]/25 text-[#f0c030]/60
          hover:border-[#f0c030]/70 hover:text-[#f0c030] hover:bg-[#f0c030]/5
          transition-all duration-150 active:scale-95 focus:outline-none"
      >
        <span className="text-base leading-none">{city.flag}</span>
        <span className="font-barlow font-semibold">{city.code}</span>
        <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#f0c030]/35 group-hover:border-[#f0c030]" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#f0c030]/35 group-hover:border-[#f0c030]" />
      </button>
    ))}
  </div>
);

TopButtons.propTypes = { setQuery: PropTypes.func.isRequired };
export default TopButtons;
