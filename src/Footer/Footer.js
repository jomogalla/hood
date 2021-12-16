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

function Footer() {
  const [snowPack, setSnowPack] = useState(generateChartData([], []));
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Snow Depth',
      },
    },
  };

  useEffect(()=>{
    AWDB.getHourlyData().then((response) => {
      const depths = getData(response.data[0].values)
      const labels = getLabels(response.data[0].values);

      setSnowPack(generateChartData(depths, labels));
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
