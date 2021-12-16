import './Footer.css';
import React, { useEffect } from "react";
import Googs from '../Services/googs';

function Footer() {
  let footerNote = 'Fetching drive time...'

  useEffect(()=>{
    Googs.getDirections().then((res) => {
      footerNote = 'Got IT';
    })
  }, []);

  return (
    <footer className="Footer">
      {footerNote}
    </footer>
  );
}

export default Footer;
