import { FaThermometerEmpty } from "react-icons/fa"; // Importing temperature icon
import { BiSolidDropletHalf } from "react-icons/bi"; // Importing humidity icon
import { FiWind } from "react-icons/fi"; // Importing wind speed icon
import { GiSunrise, GiSunset } from "react-icons/gi"; // Importing sunrise and sunset icons
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"; // Importing arrow icons for high/low temperatures

// Functional component to display weather information
const TemperatureAndDetails = ({
  weather: {
    details, // Weather details description
    icon, // Weather icon URL
    temp, // Current temperature
    temp_min, // Minimum temperature
    temp_max, // Maximum temperature
    sunrise, // Sunrise time
    sunset, // Sunset time
    speed, // Wind speed
    humidity, // Humidity percentage
    feels_like, // Real feel temperature
    units, // Measurement units (metric/imperial)
  },
}) => {
  // Array for vertical weather details
  const verticalDetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty, // Icon for real feel
      title: "Real Feel", // Title for real feel
      value: `${feels_like.toFixed()}\u00B0`, // Formatted real feel value
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf, // Icon for humidity
      title: "Humidity", // Title for humidity
      value: `${humidity.toFixed()}%`, // Formatted humidity value
    },
    {
      id: 3,
      Icon: FiWind, // Icon for wind speed
      title: "Wind", // Title for wind
      value: `${speed.toFixed()} ${units === "metric" ? `km/h` : `m/s`} `, // Formatted wind speed
    },
  ];

  // Array for horizontal weather details
  const horizonDetails = [
    { id: 1, Icon: GiSunrise, title: "Sunrise", value: sunrise }, // Sunrise details
    { id: 2, Icon: GiSunset, title: "Sunset", value: sunset }, // Sunset details
    {
      id: 3,
      Icon: MdKeyboardArrowUp, // Icon for maximum temperature
      title: "High", // Title for high temperature
      value: `${temp_max.toFixed()}\u00B0`, // Formatted maximum temperature
    },
    {
      id: 4,
      Icon: MdKeyboardArrowDown, // Icon for minimum temperature
      title: "Low", // Title for low temperature
      value: `${temp_min.toFixed()}\u00B0`, // Formatted minimum temperature
    },
  ];

  return (
    <div className="px-4 md:px-0"> {/* Main container with padding */}
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{details}</p> {/* Displaying weather details */}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between py-3"> {/* Weather info layout */}
        <img src={icon} alt="weather icon" className="w-20 md:w-32" /> {/* Weather icon */}
        <p className="text-5xl">{`${temp.toFixed()}\u00B0`}</p> {/* Current temperature */}
        <div className="flex flex-col space-y-3 items-start mt-4 md:mt-0"> {/* Vertical details layout */}
          {verticalDetails.map(({ id, Icon, title, value }) => ( // Mapping vertical details
            <div
              key={id}
              className="flex font-light text-sm items-center justify-start"
            >
              <Icon size={18} className="mr-1" /> {/* Displaying icon */}
              {`${title}:`} {/* Title label */}
              <span className="font-medium ml-1">{value}</span> {/* Value display */}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center text-sm py-3 space-y-3 md:space-y-0 md:space-x-10"> {/* Horizontal details layout */}
        {horizonDetails.map(({ id, Icon, title, value }) => ( // Mapping horizontal details
          <div key={id} className="flex flex-row items-center">
            <Icon size={30} className="mr-1" /> {/* Displaying icon */}
            <p className="font-light">
              {`${title}:`} <span className="font-medium ml-1">{value}</span> {/* Title and value display */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureAndDetails; // Exporting the component for use in other parts of the application
