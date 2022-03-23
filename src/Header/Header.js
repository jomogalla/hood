import './Header.css';
import constants from '../constants';
import React from "react";

function Header() {
  const today = new Date();
  const beginDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1));
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (constants.daysToForecast - 1));;

  const beginDateFormatted = formatDate(beginDate);
  const endDateFormatted = formatDate(endDate);

  return (
    <header className="Header">
      <h1>Hood</h1>
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
