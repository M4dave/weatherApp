// import PropTypes from "prop-types";
import React from "react";

const Forecast = ({ title, data }) => {
  // Check if data is undefined or null, render a message if true
  if (!data || data.length === 0) {
    return <p>No forecast data available</p>;
  }
  return (
    <>
      {/* Title section */}
      <div className="flex items-center justify-start mt-6">
        <p className="font-medium uppercase">{title}</p>
      </div>

      {/* Horizontal line */}
      <hr className="my-1" />

      {/* Data section */}
      <div className="flex items-center justify-between">
        {/* Mapping over the data array */}
        {data.map((d, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            {/* Displaying weather data */}
            <p className="font-light text-start">{d.title}</p>
            <img src={d.icon} alt="weather icon" className="w-12 my-1" />
            <p className="font-medium">{`${d.temp.toFixed()}\u00B0`}</p>
          </div>
        ))}
      </div>
    </>
  );

  // Forecast.propTypes = {
  //   title: PropTypes.string.isRequired,
  //   data: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       title: PropTypes.string.isRequired,
  //       icon: PropTypes.string.isRequired,
  //       temp: PropTypes.number.isRequired,
  //     })
  //   ),
};

export default Forecast;

