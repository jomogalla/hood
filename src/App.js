import './App.css';
import { useEffect, useState } from 'react';
import Header from './Layout/Header/Header';
import Main from './Layout/Main/Main';
import Footer from './Layout/Footer/Footer';
import constants from './constants';

import { getDefaultStation, getStation } from './stations';

function App() {
  const [selectedStation, setSelectedStation] = useState();

  useEffect(() =>{
    // Setting Station from query params
    const queryParams = new URLSearchParams(window.location.search);
    const stationName = queryParams.get(constants.queryParamKeys.stationName);
    const stationTriplet = queryParams.get(constants.queryParamKeys.stationTriplet);
  
    const selectedStation = getStation({ stationName, stationTriplet })

    if(selectedStation) {
      setSelectedStation(selectedStation)
    } else {
      setSelectedStation(getDefaultStation());
    }
  }, [])

  return (
    <div className="App">
      { selectedStation && 
        <>
          <Header selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
          <Main selectedStation={selectedStation}/>
          <Footer /> 
        </>
      }
    </div>
  );
}

export default App;