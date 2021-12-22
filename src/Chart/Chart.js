import './Footer.css';
import React, { useEffect, useState, useRef } from "react";
import AWDB from '../Services/awdb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function Chart(title, values) {
  const [values, setValues]
  const [snowPack, setSnowPack] = useState(generateChartData([], []));
  

  useEffect(()=>{
    AWDB.getData().then((response) => {
      // const depths = getData(response.data[0].values);
      // const labels = getLabels(response.data[0].values);
      const depths = response[0].values.map(value => value.value);
      const labels = response[0].values.reduce((prev, value) => {
        if(value.flag !== 'E') {
          prev.push(`${months[value.date.getMonth()]} ${value.date.getDate()}`);
        }
        
        return prev;
      }, []);

      setSnowPack(generateChartData(depths, labels));
      // setSnowPack(generateChartData(depths, depths.map((element) => { return element + '"' })));
    });
  }, []);

  return (
    <footer className="Footer">
      <Bar data={snowPack} options={options}/>
    </footer>
  );
}

export default Footer;

function generateChartData(data, labels) {
  return {
    labels: labels,
    datasets: [
      {
        labels: labels,
        barPercentage: 1.2,
        data: data,
        backgroundColor: '#CCC'
      }
    ]
  };
}

function getLabels(data) {
  const labels = [];

  for(const depth of data) {
    labels.push(depth.dateTime);
  }

  return labels;
}

function getData(data) {
  const snowDepthArray = [];

  for(const depth of data) {
    snowDepthArray.push(depth.value);
  }
  
  return snowDepthArray;
}

function generateLabels(beginDate, endDate) {
  const dates = [];
  const beginDate2 = new Date(beginDate);
  const endDate2 = new Date(endDate);

  // To calculate the time difference of two dates
  var msDifference = endDate2.getTime() - beginDate2.getTime();
  
  // To calculate the no. of days between two dates
  var dayDifference = msDifference / (1000 * 3600 * 24);

  for(let i = 0; i < dayDifference; i++) {
    const tempDate = new Date(endDate2.getDate() - i); 

    const formattedDate = `${months[tempDate.getMonth()]} ${tempDate.getDate()}`;

    dates.push(formattedDate);
  }

  return dates;
}
