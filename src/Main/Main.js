
import './Main.css';

import React, { useRef, useEffect } from "react";
import SnowDepth from '../SnowDepth/SnowDepth';
import Temperature from '../Temperature/Temperature';

function Main() {
  return (
    <>
      <main className='Main'>
        <SnowDepth />
        <Temperature />
      </main>
    </>
  );
}

export default Main;
