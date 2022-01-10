
import './Main.css';

import React, { useRef, useEffect, useState } from "react";
import SnowDepth from '../SnowDepth/SnowDepth';
import Temperature from '../Temperature/Temperature';
import Wind from '../Wind/Wind';
import Cloud from '../Cloud/Cloud';
import Awdb from '../Services/awdb';
import DarkSky from '../Services/darksky';

function Main() {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState({});
  const [snowDepth, setSnowDepth] = useState([]);
  const [tempMax, setTempMax] = useState([]);
  const [tempMin, setTempMin] = useState([]);

  useEffect(async () => {
    let awdbDataDepth = await Awdb.getData('SNWD');
    setSnowDepth(awdbDataDepth[0].values);

    // Get Snotel Snow Depth Data
    let awdbDataMax = await Awdb.getData('TMAX');
    setTempMax(awdbDataMax[0].values); // this is gross

    let awdbDataMin = await Awdb.getData('TMIN');
    setTempMin(awdbDataMin[0].values); // this is gross

    let darkskyForecast = await DarkSky.getForecast();
    setForecast(darkskyForecast);

    setLoading(false);
  }, []);

  return (
    <>
      <main className='Main'>
        {loading &&
          <div className="loader">
            <img src="/load.gif" />
          </div>
        }
        {!loading &&
          <div>
            <SnowDepth forecast={forecast} depth={snowDepth}/>
            <Temperature forecast={forecast} tempMax={tempMax} tempMin={tempMin}/>
            <Wind forecast={forecast}/>
            <Cloud forecast={forecast}/>
          </div>
        }
        {/* {loading 
          ? <div>LOADING</div>
          : <SnowDepth forecast={forecast} depth={snowDepth}/>
          <Temperature forecast={forecast} tempMax={tempMax} tempMin={tempMin}/>
        }
        {loading
          ? <div>LOADING</div>
          : <Temperature forecast={forecast} tempMax={tempMax} tempMin={tempMin}/>
        } */}
      </main>
    </>
  );
}

export default Main;
