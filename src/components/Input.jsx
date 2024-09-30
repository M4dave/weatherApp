import { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Input = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState("");

  const handleSearchClick = () => {
    if (city !== "") setQuery({ q: city });
    setCity("");
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords; // Fixed typo from 'longtitude' to 'longitude'
        setQuery({ lat: latitude, lon: longitude });
        setCity("");
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center my-6">
      <div className="flex flex-row w-full md:w-3/4 items-center justify-center space-x-4">
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          id="searchInput" // Unique ID for the input field
          placeholder="Search by City..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder-lowercase"
        />
        <BiSearch
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <BiCurrentLocation
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
      </div>
      <div className="flex flex-row w-full md:w-1/4 items-center justify-center mt-4 md:mt-0">
        <button
          id="celsius"
          className="text-2xl font-medium transition ease-out hover:scale-125"
          onClick={() => setUnits("metric")}
        >
          &deg;C
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button
          id="fahrenheit"
          className="text-2xl font-medium transition ease-out hover:scale-125"
          onClick={() => setUnits("imperial")}
        >
          &deg;F
        </button>
      </div>
    </div>
  );
};

export default Input;
