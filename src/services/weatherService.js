import { DateTime } from "luxon";

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error ${res.status}: ${errorData.message}`);
  }
  return res.json();
};

const iconUrlFromCode = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed, deg: windDeg },
    timezone,
    visibility,
    clouds,
  } = data;

  const { main: details, icon, description, id: weatherId } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  const windDirections = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const windDir = windDeg !== undefined
    ? windDirections[Math.round(windDeg / 22.5) % 16]
    : null;

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    pressure,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    details,
    description,
    weatherId,
    speed,
    windDir,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    lat,
    lon,
    dt,
    timezone,
    visibility: visibility ? (visibility / 1000).toFixed(1) : null,
    cloudCover: clouds?.all ?? null,
  };
};

const formatForecastWeather = (secs, offset, data) => {
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
      description: f.weather[0].description,
      pop: f.pop,
    }))
    .slice(0, 5);

  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      temp_min: f.main.temp_min,
      temp_max: f.main.temp_max,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
      description: f.weather[0].description,
      pop: f.pop,
    }));

  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  if (!API_KEY) {
    throw new Error(
      "API key is missing. Please set the VITE_OPENWEATHERMAP_API_KEY environment variable."
    );
  }

  const formattedCurrentWeather = await getWeatherData("weather", searchParams).then(formatCurrent);
  const { dt, lat, lon, timezone } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then((d) => formatForecastWeather(dt, timezone, d.list));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

export default getFormattedWeatherData;
