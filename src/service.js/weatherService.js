import { DateTime } from "luxon";

// API key and base URL for OpenWeatherMap API
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY; // Use Vite environment variable
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Function to fetch weather data from OpenWeatherMap API
const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error ${res.status}: ${errorData.message}`);
    }
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error after logging it
  }
};

// Function to generate icon URL from icon code
const iconUrlFromCode = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

// Function to format epoch time to local time
const formatToLocalTime = (secs, offset, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") =>
  DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

// Function to format current weather data
const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    details,
    speed,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    lat,
    lon,
    dt,
    timezone,
  };
};

// Function to format forecast weather data
const formatForecastWeather = (secs, offset, data) => {
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }))
    .slice(0, 5);
  
  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

// Function to get formatted weather data (current and forecast)
const getFormattedWeatherData = async (searchParams) => {
  if (!API_KEY) {
    throw new Error("API key is missing. Please set the VITE_OPENWEATHERMAP_API_KEY environment variable.");
  }

  try {
    const formattedCurrentWeather = await getWeatherData("weather", searchParams).then(formatCurrent);
    const { dt, lat, lon, timezone } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData("forecast", {
      lat,
      lon,
      units: searchParams.units,
    }).then((d) => formatForecastWeather(dt, timezone, d.list));

    return { ...formattedCurrentWeather, ...formattedForecastWeather };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Re-throw the error after logging
  }
};

export default getFormattedWeatherData;
