import Input from "./components/Input"; // Importing Input component
import TimeAndLocation from "./components/TimeAndLocation"; // Importing TimeAndLocation component
import TopButtons from "./components/TopButtons"; // Importing TopButtons component
import TemperatureAndDetails from "./components/TemperatureAndDetails"; // Importing TemperatureAndDetails component
import Forecast from "./components/Forecast"; // Importing Forecast component
import getFormattedWeatherData from "./service.js/weatherService"; // Importing the weather data fetching function
import { useEffect, useState } from "react"; // Importing React hooks
import { ToastContainer, toast } from "react-toastify"; // Importing toast notification functionality
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification styles

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {
  // State variables for query, units, weather data, and error handling
  const [query, setQuery] = useState({ q: "manila" }); // Default query set to "manila"
  const [units, setUnits] = useState("metric"); // Default units set to metric
  const [weather, setWeather] = useState(null); // State to store weather data
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch weather data
  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location"; // Use the query or default to current location
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`); // Show loading toast
    try {
      // Fetch formatted weather data
      const data = await getFormattedWeatherData({ ...query, units });
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`); // Show success toast
      setWeather(data); // Update weather state
      setError(null); // Clear any previous errors
    } catch (error) {
      toast.error("Failed to fetch weather data"); // Show error toast
      setError(error.message); // Update error state
    }
  };

  // Effect to fetch weather data whenever query or units change
  useEffect(() => {
    getWeather();
  }, [query, units]);

  // Function to determine background gradient based on temperature
  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700"; // Default gradient if no weather data
    const threshold = units === "metric" ? 20 : 60; // Set threshold based on units
    return weather.temp <= threshold ? "from-cyan-600 to-blue-700" : "from-yellow-600 to-orange-700"; // Return gradient based on temperature
  };

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <TopButtons setQuery={setQuery} />  {/* Render TopButtons component */}
      <Input setQuery={setQuery} setUnits={setUnits} /> {/* Render Input component */}

      {weather && !error && ( // Render weather components if data is available and no error
        <div className="flex flex-col space-y-4">
          <TimeAndLocation weather={weather} /> {/* Render TimeAndLocation component */}
          <TemperatureAndDetails weather={weather} units={units} /> {/* Render TemperatureAndDetails component */}
          <Forecast title="3 Hour Step Forecast" data={weather.hourly} /> {/* Render hourly forecast */}
          <Forecast title="Daily Forecast" data={weather.daily} /> {/* Render daily forecast */}
        </div>
      )}
      {error && <p className="text-red-500 text-center">Error: {error}</p>} {/* Display error message if there's an error */}
      <ToastContainer autoClose={1000} hideProgressBar={true} theme="colored" /> {/* Configure toast notifications */}
    </div>
  );
};

export default App; // Export the App component
