// App.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Select, MenuItem, CircularProgress,
  Grid, TextField, Box, Button
} from '@mui/material';
import WeatherCard from './WeatherCard';
import { fetchWeather } from './api';

const defaultCities = [
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
];

const App = () => {
  const [cities, setCities] = useState(defaultCities);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [customCity, setCustomCity] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');

  // Get user's live location
  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const liveCity = {
            name: 'Your Location',
            lat: latitude,
            lon: longitude
          };
          setCities([liveCity, ...defaultCities]);
          setSelectedCity(liveCity);
        },
        (error) => {
          console.error('Location error:', error.message);
          setSelectedCity(defaultCities[0]); // fallback
        }
      );
    };

    getLocation();

    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather whenever city changes
  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    fetchWeather(selectedCity.lat, selectedCity.lon)
      .then((data) => {
        setWeatherData(data);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  // Add custom city
  const handleAddCustomCity = () => {
    if (customCity && customLat && customLon) {
      const newCity = {
        name: customCity,
        lat: parseFloat(customLat),
        lon: parseFloat(customLon)
      };
      setCities([...cities, newCity]);
      setSelectedCity(newCity);
      setCustomCity('');
      setCustomLat('');
      setCustomLon('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Live Weather Dashboard</Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Live Time: {liveTime}
      </Typography>

      {selectedCity && (
        <Select
          fullWidth
          value={selectedCity.name}
          onChange={(e) => {
            const city = cities.find(c => c.name === e.target.value);
            if (city) setSelectedCity(city);
          }}
          sx={{ mb: 2 }}
        >
          {cities.map((city) => (
            <MenuItem key={city.name} value={city.name}>{city.name}</MenuItem>
          ))}
        </Select>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <TextField
          label="Custom City"
          variant="outlined"
          size="small"
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
        />
        <TextField
          label="Latitude"
          variant="outlined"
          size="small"
          value={customLat}
          onChange={(e) => setCustomLat(e.target.value)}
        />
        <TextField
          label="Longitude"
          variant="outlined"
          size="small"
          value={customLon}
          onChange={(e) => setCustomLon(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddCustomCity}>
          Add
        </Button>
      </Box>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <WeatherCard
          data={weatherData}
          city={selectedCity.name}
          lastUpdated={lastUpdated}
        />
      )}
    </Container>
  );
};

export default App;
