import { useState, useEffect, useRef, useCallback } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import PropTypes from "prop-types";

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const Input = ({ setQuery, units, setUnits }) => {
  const [city, setCity]           = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef    = useRef(null);

  // Fetch suggestions from OWM Geocoding API
  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `${GEO_URL}?q=${encodeURIComponent(q)}&limit=6&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("geo fetch failed");
      const data = await res.json();
      // Deduplicate by city+country
      const seen = new Set();
      const unique = data.filter((item) => {
        const key = `${item.name}|${item.country}|${item.state ?? ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setSuggestions(unique);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce input
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(city), 300);
    return () => clearTimeout(debounceTimer.current);
  }, [city, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSuggestion = (item) => {
    setQuery({ q: `${item.name},${item.country}` });
    setCity("");
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  const handleSearch = () => {
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      selectSuggestion(suggestions[activeSuggestion]);
    } else if (city.trim()) {
      setQuery({ q: city.trim() });
      setCity("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSuggestion(-1);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setQuery({ lat: latitude, lon: longitude });
          setCity("");
          setSuggestions([]);
        },
        () => alert("Location access denied.")
      );
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || isSearching) && city.length >= 2;

  return (
    <div className="flex justify-center mb-6 px-1">
      <div className="flex items-center w-full max-w-2xl gap-2">

        {/* Search bar + dropdown wrapper */}
        <div ref={wrapperRef} className="relative flex-1">
          <div className={`flex items-center border px-3 py-2 transition-all duration-200
            ${isFocused
              ? "border-[#00f5ff]/70 bg-[#00f5ff]/5 shadow-[0_0_16px_rgba(0,245,255,0.15)]"
              : "border-[#00f5ff]/20 bg-[#000c1c]"}`}>
            <span className="text-[#00f5ff]/40 mr-2 font-orbitron text-xs">{">"}</span>
            <input
              value={city}
              onChange={(e) => { setCity(e.target.value); setActiveSuggestion(-1); }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="text"
              placeholder="ENTER CITY COORDINATES..."
              autoComplete="off"
              className="flex-1 bg-transparent text-[#00f5ff] placeholder-[#00f5ff]/20 outline-none text-sm font-mono-hud tracking-wider caret-[#00f5ff]"
            />
            {isSearching && (
              <span className="text-[#00f5ff]/40 text-xs ml-2 animate-pulse font-mono-hud">SCAN..</span>
            )}
            {city && !isSearching && (
              <button
                onMouseDown={(e) => { e.preventDefault(); setCity(""); setSuggestions([]); }}
                className="text-[#00f5ff]/30 hover:text-[#00f5ff] ml-2 text-base leading-none"
                aria-label="Clear"
              >×</button>
            )}
            {isFocused && <span className="blink ml-1 text-[#00f5ff] text-xs">█</span>}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-px border border-[#00f5ff]/30 bg-[#000c1c] shadow-[0_8px_32px_rgba(0,245,255,0.12)] overflow-hidden">
              {/* Scan line accent */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00f5ff]/50 to-transparent" />

              {isSearching && suggestions.length === 0 && (
                <div className="px-4 py-3 font-mono-hud text-xs text-[#00f5ff]/30 tracking-widest animate-pulse">
                  // SCANNING GRID...
                </div>
              )}

              {suggestions.map((item, i) => {
                const isActive = i === activeSuggestion;
                return (
                  <button
                    key={`${item.name}-${item.country}-${item.lat}`}
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-all duration-100 border-b border-[#00f5ff]/5 last:border-0
                      ${isActive
                        ? "bg-[#00f5ff]/10 border-l-2 border-l-[#00f5ff]"
                        : "hover:bg-[#00f5ff]/5 border-l-2 border-l-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Active marker */}
                      <span className={`text-[10px] font-mono-hud ${isActive ? "text-[#00f5ff]" : "text-[#00f5ff]/20"}`}>
                        {isActive ? "►" : "○"}
                      </span>
                      <div>
                        <span className={`font-orbitron text-sm tracking-wide ${isActive ? "text-[#00f5ff]" : "text-[#00f5ff]/80"}`}>
                          {item.name}
                        </span>
                        {item.state && (
                          <span className="font-mono-hud text-xs text-[#00f5ff]/40 ml-2">{item.state}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-hud text-[10px] text-[#00f5ff]/30">
                        {item.lat?.toFixed(2)}°, {item.lon?.toFixed(2)}°
                      </span>
                      <span className={`font-orbitron text-xs px-1.5 py-0.5 border ${
                        isActive
                          ? "border-[#00f5ff]/50 text-[#00f5ff]"
                          : "border-[#00f5ff]/20 text-[#00f5ff]/40"}`}>
                        {item.country}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Footer hint */}
              {suggestions.length > 0 && (
                <div className="px-4 py-1.5 flex gap-4 border-t border-[#00f5ff]/10">
                  <span className="font-mono-hud text-[9px] text-[#00f5ff]/20 tracking-widest">↑↓ NAVIGATE</span>
                  <span className="font-mono-hud text-[9px] text-[#00f5ff]/20 tracking-widest">↵ SELECT</span>
                  <span className="font-mono-hud text-[9px] text-[#00f5ff]/20 tracking-widest">ESC CLOSE</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="p-2 border border-[#00f5ff]/20 hover:border-[#00f5ff]/60 bg-[#000c1c] hover:bg-[#00f5ff]/5 text-[#00f5ff]/60 hover:text-[#00f5ff] transition-all duration-200 active:scale-95"
          aria-label="Search"
        >
          <BiSearch size={18} />
        </button>

        {/* GPS button */}
        <button
          onClick={handleLocationClick}
          className="p-2 border border-[#00f5ff]/20 hover:border-[#00f5ff]/60 bg-[#000c1c] hover:bg-[#00f5ff]/5 text-[#00f5ff]/60 hover:text-[#00f5ff] transition-all duration-200 active:scale-95"
          aria-label="GPS location"
          title="Use GPS"
        >
          <BiCurrentLocation size={18} />
        </button>

        {/* Unit toggle */}
        <div className="flex border border-[#00f5ff]/20 overflow-hidden">
          {["metric", "imperial"].map((u) => (
            <button
              key={u}
              onClick={() => setUnits(u)}
              className={`px-3 py-2 text-xs font-orbitron tracking-widest transition-all duration-150
                ${units === u
                  ? "bg-[#00f5ff] text-[#000c1c] font-bold"
                  : "bg-[#000c1c] text-[#00f5ff]/40 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5"}`}
            >
              {u === "metric" ? "°C" : "°F"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Input.propTypes = {
  setQuery: PropTypes.func.isRequired,
  units: PropTypes.string.isRequired,
  setUnits: PropTypes.func.isRequired,
};

export default Input;
