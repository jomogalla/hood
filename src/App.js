import './App.css';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';

import AWDB from './Services/awdb'

function App() {
  AWDB.getHourlyData()

  return (
    <div className="App">
      <Header/>
      <Main />
      <Footer /> 
    </div>
  );
}

export default App;