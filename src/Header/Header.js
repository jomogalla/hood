import './Header.css';
import React from "react";

function Header() {
  const currentDate = new Date();
  const headerDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;


  return (
    <header className="Header">
      <h1>Hood</h1>
      <h4>
        {headerDate}
      </h4>
    </header>
  );
}

export default Header;
