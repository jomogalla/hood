import './Header.css';
import constants from '../constants';
import { stations } from '../stations';
import React from "react";

function Header({
  selectedStation,
  setSelectedStation,
}) {
  const today = new Date();
  const beginDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1));
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (constants.daysToForecast - 1));;

  const beginDateFormatted = formatDate(beginDate);
  const endDateFormatted = formatDate(endDate);

  const updateStation = (e) => {
    const station = stations.find((station) => station.triplet === e.target.value);
    setSelectedStation(station);
  }

  return (
    <header className="Header">
      <h1>
        <select onChange={updateStation} value={selectedStation.triplet}>
          <option value="">Select a station</option>
          {stations.map((station) => (
            <option value={station.triplet} key={station.triplet}>{station.name}</option>
          ))}
        </select>
      </h1>
      <h4>
        {beginDateFormatted} - {endDateFormatted}
      </h4>
    </header>
  );
}

export default Header;

function formatDate(datey) {
  return `${datey.getMonth() + 1}/${datey.getDate()}/${datey.getFullYear()}`;
}
