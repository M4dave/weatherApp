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
  // HOURLY — next 8 slots (24 hrs) after current time, pop defaults to 0
  const hourly = data
    .filter((f) => f.dt > secs)
    .slice(0, 8)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
      description: f.weather[0].description,
      pop: f.pop ?? 0,
    }));

  // DAILY — group all slots by LOCAL date (using timezone offset), then
  // pick the representative slot closest to noon local time per day.
  // This fixes the midnight-UTC filter which skips days in offset timezones.
  const byDay = {};
  data.forEach((f) => {
    const localDate = DateTime.fromSeconds(f.dt + offset, { zone: "utc" })
      .toFormat("yyyy-MM-dd");
    if (!byDay[localDate]) byDay[localDate] = [];
    byDay[localDate].push(f);
  });

  const daily = Object.entries(byDay)
    // Skip today — it's already shown in current weather
    .filter(([date]) => {
      const todayLocal = DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat("yyyy-MM-dd");
      return date > todayLocal;
    })
    .slice(0, 5)
    .map(([date, slots]) => {
      // Pick slot nearest to 12:00 local time
      const noon = DateTime.fromISO(`${date}T12:00:00`, { zone: "utc" }).toSeconds() - offset;
      const rep = slots.reduce((best, f) =>
        Math.abs(f.dt - noon) < Math.abs(best.dt - noon) ? f : best
      );
      // Aggregate hi/lo across all slots for the day
      const hiTemp = Math.max(...slots.map((f) => f.main.temp_max));
      const loTemp = Math.min(...slots.map((f) => f.main.temp_min));
      const maxPop = Math.max(...slots.map((f) => f.pop ?? 0));

      return {
        temp: rep.main.temp,
        temp_min: loTemp,
        temp_max: hiTemp,
        title: formatToLocalTime(rep.dt, offset, "ccc, dd LLL"),
        icon: iconUrlFromCode(rep.weather[0].icon),
        date,
        description: rep.weather[0].description,
        pop: maxPop,
      };
    });

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
