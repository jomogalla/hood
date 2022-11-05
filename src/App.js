import './App.css';
import { useState } from 'react';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';

import { getDefaultStation } from './stations';

function App() {
  const [selectedStation, setSelectedStation] = useState(getDefaultStation());

  return (
    <div className="App">
      <Header selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
      <Main selectedStation={selectedStation}/>
      <Footer /> 
    </div>
  );
}

export default App;