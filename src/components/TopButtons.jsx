import PropTypes from "prop-types";

// TopButtons component that renders a set of buttons for city queries
const TopButtons = ({ setQuery }) => {
  // List of cities to display as buttons
  const cities = [
    { id: 1, name: "Boston" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Tokyo" },
    { id: 4, name: "Paris" },
    { id: 5, name: "Winnipeg" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      {cities.map((city) => (
        <button
          key={city.id} // Unique key for React's reconciliation
          className="text-lg font-medium bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-6 py-3 rounded-lg transition transform hover:scale-105 ease-in-out duration-300 shadow-md hover:shadow-lg"
          style={{
            minWidth: "120px", // Ensure minimum width for uniform buttons
          }}
          onClick={() => setQuery({ q: city.name })} // Set query on button click
          aria-label={`Search weather in ${city.name}`} // Accessibility enhancement
        >
          {city.name} {/* Button label displaying the city name */}
        </button>
      ))}
    </div>
  );
};

// PropTypes to validate the component's props
TopButtons.propTypes = {
  setQuery: PropTypes.func.isRequired, // setQuery must be a function
};

export default TopButtons;
