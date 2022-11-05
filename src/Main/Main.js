
import './Main.css';

import React, { useEffect, useState } from "react";
import SnowDepth from '../SnowDepth/SnowDepth';
import Temperature from '../Temperature/Temperature';
import Wind from '../Wind/Wind';
import Cloud from '../Cloud/Cloud';
import Awdb from '../Services/awdb';
import DarkSky from '../Services/darksky';
import constants from '../constants';

function Main({
  selectedStation,
}) {
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState({})
  const [forecast, setForecast] = useState({});
  const [snowDepth, setSnowDepth] = useState([]);
  const [tempMax, setTempMax] = useState([]);
  const [tempMin, setTempMin] = useState([]);
  const [message, setMessage] = useState('');
  const [past, setPast] = useState([]);

  useEffect(async () => {
    if(selectedStation) {
      setLoading(true);
      await fetchAndSetData();
      setLoading(false);
    }
    
    async function fetchAndSetData() {
      const today = new Date();
      const daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1));

      setMessage('fetching station information');
      let awdbStation = await Awdb.getStationMetadata({
        stationTriplet: selectedStation.triplet,
      });
      setStation(awdbStation);

      setMessage('fetching snow depth');
      let awdbDataDepth = await Awdb.getData({
        stationTriplets: selectedStation.triplet,
        elementCd: 'SNWD',
        startDate: daysAgo,
        endDate: today,
      });
      setSnowDepth(awdbDataDepth[0].values);

      // Get Snotel Snow Depth Data
      setMessage('fetching temperature maximum');
      let awdbDataMax = await Awdb.getData({
        stationTriplets: selectedStation.triplet,
        elementCd: 'TMAX',
        startDate: daysAgo,
        endDate: today,
      });
      setTempMax(awdbDataMax[0].values); // this is gross

      setMessage('fetching temperature minimum');
      let awdbDataMin = await Awdb.getData({
        stationTriplets: selectedStation.triplet,
        elementCd: 'TMIN',
        startDate: daysAgo,
        endDate: today,
      });
  
      setTempMin(awdbDataMin[0].values); // this is gross

      setMessage('fetching forecast');
      let darkskyForecast = await DarkSky.getForecast({
        latitude: awdbStation.latitude,
        longitude: awdbStation.longitude,
      });
      setForecast(darkskyForecast);

      setMessage('fetching past');

      const tempPast = [];

      // Get Darksky Past data day by day
      for(let i = 0; i < constants.daysToForecast - 1; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1 - i));

        let darkskyForecast = await DarkSky.getPast({
          date: day,
          latitude: awdbStation.latitude,
          longitude: awdbStation.longitude,
        });

        tempPast.push(darkskyForecast);
      }
      setPast(tempPast);
    };
  }, [selectedStation]);

  return (
    <>
      <main className='Main'>
        {loading &&
          <div className="loader">
            <img src="/load.gif" alt="loading"/>
            <div className="message">
              {message}
            </div>
            
          </div>
        }
        {!loading &&
          <div className="charts">
            { snowDepth.length !== 0 && Object.keys(forecast).length !== 0 && 
              <SnowDepth forecast={forecast} depth={snowDepth}/>
            }
            { tempMax.length !== 0 && tempMin.length !== 0 && Object.keys(forecast).length !== 0 &&
              <Temperature forecast={forecast} tempMax={tempMax} tempMin={tempMin}/>
            }
            { Object.keys(forecast).length !== 0 && past.length !== 0 && 
              <Wind forecast={forecast} past={past}/>
            }
            { Object.keys(forecast).length !==0 && past.length !== 0 &&
              <Cloud forecast={forecast} past={past}/>
            }
          </div>
        }
      </main>
    </>
  );
}

export default Main;
