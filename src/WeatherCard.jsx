import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { WbSunny, Cloud, AcUnit, Thunderstorm } from '@mui/icons-material';

const getBackgroundColor = (temp, condition) => {
  if (condition.includes('cloud')) return 'grey.300';
  if (temp >= 30) return 'red.200';
  if (temp <= 10) return 'blue.200';
  return 'green.100';
};

const getWeatherIcon = (condition) => {
  const c = condition.toLowerCase();
  if (c.includes('cloud')) return <Cloud fontSize="large" />;
  if (c.includes('clear')) return <WbSunny fontSize="large" />;
  if (c.includes('storm')) return <Thunderstorm fontSize="large" />;
  return <AcUnit fontSize="large" />;
};

const WeatherCard = ({ data, city, lastUpdated }) => {
  const temp = data.temperature;
  const condition = data.condition;

  return (
    <Card sx={{ bgcolor: getBackgroundColor(temp, condition) }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>{getWeatherIcon(condition)}</Grid>
          <Grid item xs>
            <Typography variant="h5">{city}</Typography>
            <Typography variant="h6">{temp}°C — {condition}</Typography>
            <Typography variant="body2">Last updated: {lastUpdated}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
