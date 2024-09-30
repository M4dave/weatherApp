import React from "react";

const TimeAndLocation = ({
  weather: { formattedLocalTime, name, country },
}) => {
  return (
    <div className="px-4 md:px-0">
      <div className="flex items-center justify-center my-6">
        <p className="text-xl md:text-2xl font-extralight">{formattedLocalTime}</p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="text-3xl md:text-4xl font-medium">{`${name}, ${country}`}</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
