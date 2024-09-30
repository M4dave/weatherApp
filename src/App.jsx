import Input from "./components/Input"; // Importing the Input component
import TimeAndLocation from "./components/TimeAndLocation"; // Importing the TimeAndLocation component
import TopButtons from "./components/TopButtons"; // Importing the TopButtons component
import TemperatureAndDetails from "./components/TemperatureAndDetails"; // Importing the TemperatureAndDetails component
import Forecast from "./components/Forecast"; // Importing the Forecast component
import getFormattedWeatherData from "./service.js/weatherService"; // Importing the function to fetch and format weather data
import { useEffect, useState } from "react"; // Importing hooks from React
import { ToastContainer, toast } from "react-toastify"; // Importing ToastContainer and toast from react-toastify library
import "react-toastify/dist/ReactToastify.css"; // Importing CSS for react-toastify

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Main App component
const App = () => {
  const [query, setQuery] = useState({ q: "manila" }); // State to manage query parameters for weather data
  const [units, setUnits] = useState("metric"); // State to manage units for temperature
  const [weather, setWeather] = useState(null); // State to store weather data
  const [error, setError] = useState(null); // State to store error messages

  // Function to fetch weather data
  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location"; // Get the city name for which weather data is fetched
    toast.info(
      `Fetching weather data for ${capitalizeFirstLetter(cityName)}`
    ); // Show toast indicating weather data is being fetched
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`); // Show toast indicating weather data has been fetched successfully
      setWeather(data); // Update weather state with fetched data
      setError(null); // Clear any previous errors
    } catch (error) {
      toast.error("Failed to fetch weather data"); // Show toast indicating error in fetching weather data
      setError(error.message); // Set error message in state
    }
  };

  // Fetch weather data on component mount and whenever query or units change
  useEffect(() => {
    getWeather();
  }, [query, units]);

  // Function to format background gradient based on temperature
  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700"; // Default background gradient
    const threshold = units === "metric" ? 20 : 60; // Threshold temperature for color change
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700"; // Blue gradient for lower temperatures
    return "from-yellow-600 to-orange-700"; // Orange gradient for higher temperatures
  };

  // Render the UI
  return (
    <div
      className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 to-oran ${formatBackground()} `}
    >
      <TopButtons setQuery={setQuery} /> {/* Render TopButtons component */}
      <Input setQuery={setQuery} setUnits={setUnits} /> {/* Render Input component */}

      {/* Render weather components if weather data is available */}
      {weather && !error && (
        <>
          <TimeAndLocation weather={weather} /> {/* Render TimeAndLocation component */}
          <TemperatureAndDetails weather={weather} units={units} /> {/* Render TemperatureAndDetails component */}
          <Forecast title="3 hour step forecast" data={weather.hourly} /> {/* Render Forecast component for hourly forecast */}
          <Forecast title="daily forecast" data={weather.daily} /> {/* Render Forecast component for daily forecast */}
        </>
      )}
      {error && <p>Error: {error}</p>} {/* Render error message if there's an error */}
      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" /> {/* Render ToastContainer for displaying notifications */}
    </div>
  );
};

export default App;
