import { useState, useEffect, useRef, useCallback } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import PropTypes from "prop-types";

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const Input = ({ setQuery, units, setUnits, compact = false, mobileMinimal = false }) => {
  const [city, setCity]               = useState("");
  const [isFocused, setIsFocused]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef    = useRef(null);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`${GEO_URL}?q=${encodeURIComponent(q)}&limit=6&appid=${API_KEY}`);
      if (!res.ok) throw new Error("geo fetch failed");
      const data = await res.json();
      const seen = new Set();
      setSuggestions(data.filter((item) => {
        const key = `${item.name}|${item.country}|${item.state ?? ""}`;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }));
    } catch { setSuggestions([]); }
    finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(city), 300);
    return () => clearTimeout(debounceTimer.current);
  }, [city, fetchSuggestions]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]); setActiveSuggestion(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSuggestion = (item) => {
    setQuery({ q: `${item.name},${item.country}` });
    setCity(""); setSuggestions([]); setActiveSuggestion(-1);
  };

  const handleSearch = () => {
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      selectSuggestion(suggestions[activeSuggestion]);
    } else if (city.trim()) {
      setQuery({ q: city.trim() }); setCity(""); setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown")  { e.preventDefault(); setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")    { e.preventDefault(); setActiveSuggestion((p) => Math.max(p - 1, -1)); }
    else if (e.key === "Enter")      { e.preventDefault(); handleSearch(); }
    else if (e.key === "Escape")     { setSuggestions([]); setActiveSuggestion(-1); }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => { setQuery({ lat: latitude, lon: longitude }); setCity(""); setSuggestions([]); },
        () => alert("Location access denied.")
      );
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || isSearching) && city.length >= 2;

  // In compact (nav bar) mode: just the input + search button, no outer padding/margin
  if (compact) {
    return (
      <div ref={wrapperRef} className="relative w-full">
        {/* Input bar — no glow box shadow in nav, just a simple border change */}
        <div className={`flex items-center border transition-all duration-150 ${
          isFocused
            ? "border-[#f0c030]/50 bg-[#f0c030]/5"
            : "border-[#f0c030]/20 bg-[#0a0806]"}`}
          style={{ padding: "5px 10px" }}>
          <span className="font-bebas text-xs mr-1.5 shrink-0" style={{ color: "rgba(240,192,48,0.35)" }}>►</span>
          <input
            value={city}
            onChange={(e) => { setCity(e.target.value); setActiveSuggestion(-1); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type="text"
            placeholder="Search city..."
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent outline-none text-xs font-barlow tracking-wider uppercase"
            style={{ color: "#f0c030", caretColor: "#f0c030" }}
          />
          {city && !isSearching && (
            <button onMouseDown={(e) => { e.preventDefault(); setCity(""); setSuggestions([]); }}
              className="ml-1 text-sm leading-none shrink-0" style={{ color: "rgba(240,192,48,0.3)" }}
              aria-label="Clear">×</button>
          )}
          {isSearching && (
            <span className="text-xs font-barlow animate-pulse ml-1 shrink-0" style={{ color: "rgba(240,192,48,0.35)" }}>…</span>
          )}
          <button onClick={handleSearch}
            className="ml-1.5 shrink-0 transition-all duration-150 active:scale-95"
            style={{ color: "rgba(240,192,48,0.5)" }} aria-label="Search">
            <BiSearch size={14} />
          </button>
          {!mobileMinimal && (
            <button onClick={handleLocationClick}
              className="ml-1.5 shrink-0 transition-all duration-150 active:scale-95"
              style={{ color: "rgba(240,192,48,0.5)" }} aria-label="GPS">
              <BiCurrentLocation size={14} />
            </button>
          )}
        </div>

        {/* Dropdown — fixed min-width so it's readable, aligned to left of input */}
        {showDropdown && (
          <div className="absolute top-full left-0 z-[100] mt-px bg-[#0a0806] overflow-hidden"
            style={{
              minWidth: "280px",
              border: "1px solid rgba(240,192,48,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.9)",
            }}>
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(240,192,48,0.4),transparent)" }} />
            {isSearching && suggestions.length === 0 && (
              <div className="px-4 py-3 font-barlow text-xs uppercase tracking-widest animate-pulse" style={{ color: "rgba(240,192,48,0.3)" }}>
                Scanning grid...
              </div>
            )}
            {suggestions.map((item, i) => {
              const isActive = i === activeSuggestion;
              return (
                <button
                  key={`${item.name}-${item.country}-${item.lat}`}
                  onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                  className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-100 border-b last:border-0 border-[#f0c030]/5 ${
                    isActive ? "bg-[#f0c030]/10 border-l-2 border-l-[#f0c030]" : "hover:bg-[#f0c030]/5 border-l-2 border-l-transparent"}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs shrink-0 font-barlow" style={{ color: isActive ? "#f0c030" : "rgba(240,192,48,0.2)" }}>
                      {isActive ? "►" : "○"}
                    </span>
                    <div className="text-left min-w-0">
                      <span className="font-bebas text-sm tracking-wider" style={{ color: isActive ? "#f0c030" : "rgba(240,192,48,0.85)" }}>
                        {item.name}
                      </span>
                      {item.state && (
                        <span className="font-barlow text-xs ml-1.5 uppercase truncate" style={{ color: "rgba(240,192,48,0.4)" }}>
                          {item.state}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-barlow text-[9px]" style={{ color: "rgba(240,192,48,0.25)" }}>
                      {item.lat?.toFixed(1)}°, {item.lon?.toFixed(1)}°
                    </span>
                    <span className={`font-bebas text-xs px-1.5 py-0.5 border tracking-wider ${
                      isActive ? "border-[#f0c030]/50 text-[#f0c030]" : "border-[#f0c030]/15 text-[#f0c030]/40"}`}>
                      {item.country}
                    </span>
                  </div>
                </button>
              );
            })}
            {suggestions.length > 0 && (
              <div className="px-3 py-1 flex gap-3 border-t" style={{ borderColor: "rgba(240,192,48,0.08)" }}>
                {["↑↓ Nav", "↵ Select", "Esc"].map((h) => (
                  <span key={h} className="font-barlow text-[9px] uppercase tracking-widest" style={{ color: "rgba(240,192,48,0.2)" }}>{h}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full (non-compact) mode — used in standalone search page
  return (
    <div className="flex justify-center mb-5 px-1 min-w-0 w-full">
      <div className="flex items-center gap-2 w-full max-w-2xl">
        <div ref={wrapperRef} className="relative flex-1">
          <div className={`flex items-center border px-3 py-2.5 transition-all duration-150 ${
            isFocused ? "border-[#f0c030]/70 bg-[#f0c030]/5" : "border-[#f0c030]/20 bg-[#0a0806]"}`}>
            <span className="font-bebas text-sm mr-2" style={{ color: "rgba(240,192,48,0.4)" }}>►</span>
            <input
              value={city}
              onChange={(e) => { setCity(e.target.value); setActiveSuggestion(-1); }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="text"
              placeholder="Search city..."
              autoComplete="off"
              className="flex-1 bg-transparent outline-none text-sm font-barlow tracking-widest uppercase"
              style={{ color: "#f0c030", caretColor: "#f0c030" }}
            />
            {isSearching && (
              <span className="text-xs font-barlow uppercase tracking-widest animate-pulse ml-2" style={{ color: "rgba(240,192,48,0.4)" }}>scanning...</span>
            )}
            {city && !isSearching && (
              <button onMouseDown={(e) => { e.preventDefault(); setCity(""); setSuggestions([]); }}
                className="ml-2 text-base leading-none" style={{ color: "rgba(240,192,48,0.3)" }} aria-label="Clear">×</button>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-px border border-[#f0c030]/25 bg-[#0a0806] overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.8)" }}>
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(240,192,48,0.4),transparent)" }} />
              {isSearching && suggestions.length === 0 && (
                <div className="px-4 py-3 font-barlow text-xs uppercase tracking-widest animate-pulse" style={{ color: "rgba(240,192,48,0.3)" }}>
                  Scanning grid...
                </div>
              )}
              {suggestions.map((item, i) => {
                const isActive = i === activeSuggestion;
                return (
                  <button key={`${item.name}-${item.country}-${item.lat}`}
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 transition-all duration-100 border-b last:border-0 border-[#f0c030]/5 ${
                      isActive ? "bg-[#f0c030]/10 border-l-2 border-l-[#f0c030]" : "hover:bg-[#f0c030]/5 border-l-2 border-l-transparent"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-barlow" style={{ color: isActive ? "#f0c030" : "rgba(240,192,48,0.2)" }}>{isActive ? "►" : "○"}</span>
                      <div className="text-left">
                        <span className="font-bebas text-base tracking-wider" style={{ color: isActive ? "#f0c030" : "rgba(240,192,48,0.8)" }}>{item.name}</span>
                        {item.state && <span className="font-barlow text-xs ml-2 uppercase" style={{ color: "rgba(240,192,48,0.35)" }}>{item.state}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-barlow text-[10px]" style={{ color: "rgba(240,192,48,0.25)" }}>{item.lat?.toFixed(2)}°, {item.lon?.toFixed(2)}°</span>
                      <span className={`font-bebas text-xs px-2 py-0.5 border tracking-wider ${isActive ? "border-[#f0c030]/50 text-[#f0c030]" : "border-[#f0c030]/15 text-[#f0c030]/40"}`}>{item.country}</span>
                    </div>
                  </button>
                );
              })}
              {suggestions.length > 0 && (
                <div className="px-4 py-1.5 flex gap-4 border-t" style={{ borderColor: "rgba(240,192,48,0.08)" }}>
                  {["↑↓ Navigate", "↵ Select", "Esc Close"].map((h) => (
                    <span key={h} className="font-barlow text-[9px] uppercase tracking-widest" style={{ color: "rgba(240,192,48,0.2)" }}>{h}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={handleSearch}
          className="p-2 border border-[#f0c030]/20 hover:border-[#f0c030]/60 bg-[#0a0806] hover:bg-[#f0c030]/5 transition-all duration-150 active:scale-95 shrink-0"
          style={{ color: "rgba(240,192,48,0.5)" }} aria-label="Search">
          <BiSearch size={16} />
        </button>
        <button onClick={handleLocationClick}
          className="p-2 border border-[#f0c030]/20 hover:border-[#f0c030]/60 bg-[#0a0806] hover:bg-[#f0c030]/5 transition-all duration-150 active:scale-95 shrink-0"
          style={{ color: "rgba(240,192,48,0.5)" }} aria-label="GPS">
          <BiCurrentLocation size={16} />
        </button>
        <div className="flex border border-[#f0c030]/20 overflow-hidden shrink-0">
          {["metric","imperial"].map((u) => (
            <button key={u} onClick={() => setUnits(u)}
              className={`px-2.5 py-2 text-xs font-bebas tracking-[0.2em] transition-all duration-150 ${units === u ? "bg-[#f0c030] text-[#0a0806]" : "bg-[#0a0806] hover:bg-[#f0c030]/8"}`}
              style={{ color: units === u ? "#0a0806" : "rgba(240,192,48,0.4)" }}>
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
  compact: PropTypes.bool,
  mobileMinimal: PropTypes.bool,
};
export default Input;
