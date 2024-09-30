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
    // Flex container for aligning buttons
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        // Render a button for each city
        <button
          key={city.id} // Unique key for React's reconciliation
          className="text-lg font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md transition ease-in"
          onClick={() => setQuery({ q: city.name })} // Set query on button click
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
  // buttonProps: PropTypes.object, // Optional: could be used for additional button properties
};

// Export the TopButtons component for use in other parts of the app
export default TopButtons;
