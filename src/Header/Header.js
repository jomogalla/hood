import './Header.css';
import React, { useState, useEffect } from "react";
import DarkSky from '../Services/darksky';

function Header() {
  const [current, setCurrent] = useState({});
  const [today, setToday] = useState({});
  const [tomorrow, setTomorrow] = useState({});
  const currentDate = new Date();
  const headerDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  useEffect(()=>{
    DarkSky.getForecast().then((response) => {
      const currentStatus = response.data.currently;
      setCurrent({
        temp: currentStatus.temperature.toFixed(0),
        winds: currentStatus.windSpeed,
        summary: currentStatus.summary,
      });

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
      <h1>Hood</h1>
      <h4>
        {headerDate}
      </h4>
      {/* <div className="table">
        <div className="currently">
          <div>Currently: </div>
          <div>{current.temp}&deg;F</div>
          <div>{current.winds}mph winds</div>
          <div>{current.summary}</div>
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
      </div> */}
    </header>
  );
}

export default Header;
