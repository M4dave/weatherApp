import { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

// Input component for searching weather by city or current location
const Input = ({ setQuery, setUnits }) => {
  // State to hold the current city name
  const [city, setCity] = useState("");

  // Function to handle search button click
  const handleSearchClick = () => {
    // If the city input is not empty, set the query with the city name
    if (city !== "") {
      setQuery({ q: city });
    }
    // Clear the city input field
    setCity("");
  };

  // Function to handle the current location button click
  const handleLocationClick = () => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // Get the current position of the user
      navigator.geolocation.getCurrentPosition((position) => {
        // Destructure latitude and longitude from the position
        const { latitude, longitude } = position.coords;
        // Set the query with the user's current latitude and longitude
        setQuery({ lat: latitude, lon: longitude });
        // Clear the city input field
        setCity("");
      });
    }
  };

  // Function to handle key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        {/* Input field for city name */}
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)} // Update city state on input change
          onKeyPress={handleKeyPress} // Handle key press event
          type="text"
          id="searchInput" // Unique ID for the input field
          placeholder="Search by City..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder-lowercase"
        />
        {/* Search button using an icon */}
        <BiSearch
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick} // Trigger search when clicked
        />
        {/* Current location button using an icon */}
        <BiCurrentLocation
          size={30}
          className="cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick} // Trigger location fetch when clicked
        />
        <div className="flex flex-row w-1/4 items-center justify-center">
          {/* Button to switch to Celsius */}
          <button
            id="celsius"
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("metric")} // Set units to metric
          >
            &deg;C
          </button>
          <p className="text-2xl font-medium mx-1">|</p>
          {/* Button to switch to Fahrenheit */}
          <button
            id="fahrenheit"
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("imperial")} // Set units to imperial
          >
            &deg;F
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
