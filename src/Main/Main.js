
import './Main.css';

import React, { useRef, useEffect } from "react";
import SnowDepth from '../SnowDepth/SnowDepth';

function Main() {
  return (
    <>
      <main className='Main'>
        <SnowDepth />
      </main>
    </>
  );
}

export default Main;
