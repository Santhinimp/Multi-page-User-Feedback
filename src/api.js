export const fetchWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  const json = await res.json();
  return {
    temperature: json.current_weather.temperature,
    condition: mapCodeToCondition(json.current_weather.weathercode)
  };
};

const mapCodeToCondition = (code) => {
  const codes = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Cloudy',
    45: 'Fog',
    51: 'Light drizzle',
    61: 'Rain',
    71: 'Snow',
    95: 'Thunderstorm'
  };
  return codes[code] || 'Unknown';
};
