import React from "react"; // Importing React library

// Functional component to display time and location information
const TimeAndLocation = ({
  weather: { formattedLocalTime, name, country }, // Destructuring weather props
}) => {
  return (
    <div className="px-4 md:px-0"> {/* Main container with padding */}
      <div className="flex items-center justify-center my-6"> {/* Container for local time */}
        <p className="text-xl md:text-2xl font-extralight">{formattedLocalTime}</p> {/* Displaying formatted local time */}
      </div>
      <div className="flex items-center justify-center my-3"> {/* Container for location name */}
        <p className="text-3xl md:text-4xl font-medium">{`${name}, ${country}`}</p> {/* Displaying location name and country */}
      </div>
    </div>
  );
};

export default TimeAndLocation; // Exporting the component for use in other parts of the application
