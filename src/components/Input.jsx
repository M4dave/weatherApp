import { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

// Input component for searching weather by city or current location
const Input = ({ setQuery, setUnits }) => {
  // State to hold the current city name
  const [city, setCity] = useState("");

  // Function to handle search button click
  const handleSearchClick = () => {
    if (city !== "") {
      setQuery({ q: city });
    }
    setCity("");
  };

  // Function to handle the current location button click
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
        setCity("");
      });
    }
  };

  // Function to handle key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Function to handle touch events for better mobile support
  const handleTouchStart = (callback) => {
    callback();
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        {/* Input field for city name */}
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          type="text"
          id="searchInput"
          placeholder="Search by City..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder-lowercase"
        />
        {/* Search button using an icon */}
        <BiSearch
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
          onTouchStart={() => handleTouchStart(handleSearchClick)} // Handle touch event
        />
        {/* Current location button using an icon */}
        <BiCurrentLocation
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
          onTouchStart={() => handleTouchStart(handleLocationClick)} // Handle touch event
        />
        <div className="flex flex-row w-1/4 items-center justify-center">
          {/* Button to switch to Celsius */}
          <button
            id="celsius"
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("metric")}
            onTouchStart={() => handleTouchStart(() => setUnits("metric"))} // Handle touch event
          >
            &deg;C
          </button>
          <p className="text-2xl font-medium mx-1">|</p>
          {/* Button to switch to Fahrenheit */}
          <button
            id="fahrenheit"
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("imperial")}
            onTouchStart={() => handleTouchStart(() => setUnits("imperial"))} // Handle touch event
          >
            &deg;F
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
