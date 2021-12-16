import './Header.css';
import React, { useState, useEffect } from "react";
import DarkSky from '../Services/darksky';

function Header() {
  const [temp, setTemp] = useState('**.*');
  const [winds, setWinds] = useState('**.*');
  const [summary, setSummary] = useState('******');
  const [today, setToday] = useState({});
  const [tomorrow, setTomorrow] = useState({});

  useEffect(()=>{
    DarkSky.getForecast().then((response) => {
      const current = response.data.currently;

      setTemp(current.temperature.toFixed(0));
      setWinds(current.windSpeed);
      setSummary(current.summary);

      const todaysForecast = response.data.daily.data[0];
      setToday({
        minTemp: todaysForecast.temperatureMin.toFixed(0),
        maxTemp: todaysForecast.temperatureMax.toFixed(0),
        precipType: todaysForecast.precipType,
        precipAccumulation: todaysForecast.precipAccumulation,
        winds: todaysForecast.windSpeed
      })

      const tomorrowsForecast = response.data.daily.data[1];
      setTomorrow({
        minTemp: tomorrowsForecast.temperatureMin.toFixed(0),
        maxTemp: tomorrowsForecast.temperatureMax.toFixed(0),
        precipType: tomorrowsForecast.precipType,
        precipAccumulation: tomorrowsForecast.precipAccumulation,
        winds: tomorrowsForecast.windSpeed
      })


    });
  }, []);

  return (
    <header className="Header">
      <div className="table">
        <div className="currently">
          <div>Currently: </div>
          <div>{temp}&deg;F</div>
          <div>{winds}mph Winds</div>
          <div>{summary}</div>
        </div>
        <div className="today">
          <div>Today:</div>
          <div>{today.minTemp}&deg;F - {today.maxTemp}&deg;F</div>
          <div>{today.winds}mph winds</div>
          <div>{today.precipAccumulation}" {today.precipType}</div>
        </div>
        <div className="tomorrow">
          <div>Tomorrow:</div>
          <div>{tomorrow.minTemp}&deg;F - {tomorrow.maxTemp}&deg;F</div>
          <div>{tomorrow.winds}mph winds</div>
          <div>{tomorrow.precipAccumulation}" {tomorrow.precipType}</div>
        </div>
      </div>
      

    </header>
  );
}

export default Header;
