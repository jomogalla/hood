import './SnowDepth.css';
import React, { useEffect, useState } from "react";
import AWDB from '../Services/awdb';
import DarkSky from '../Services/darksky';
import Constants from '../constants';
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

function SnowDepth() {
  const [snowPack, setSnowPack] = useState(generateChartData([], [], [], [], [], []));
  
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
    aspectRatio: 1.25,
    interaction: {
      intersect: false,
    },
    animation: {
      duration: 500,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        display: true,
        ticks: {
          beginAtZero: false,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
              return  `${value}"`;
          },
        },
      },
    },
  };

  useEffect(()=>{
    AWDB.getData().then((response) => {
      const values = response[0].values;

      const depths = values.map(value => value.value);
      const labels = values.reduce((prev, value) => {
          prev.push(`${Constants.months[value.date.getMonth()]} ${value.date.getDate()}`);
        
        return prev;
      }, []);
      const colors = values.map(() => { return Constants.colors.grey});

      DarkSky.getForecast().then((response) => {
        const daysToForecast = 8;
        let newForecast = values[values.length - 1].value;

        // Get Today to overlap
        const depths2 = [...depths];
        depths2.pop();
        const labels2 = [...labels];
        labels2.pop();
        const colors2 = [...colors];
        colors2.pop();

        for(var i = 0; i < daysToForecast; i++) {
          const tempDay = response.data.daily.data[i];

          newForecast += tempDay.precipAccumulation;
          depths2.push(Math.floor(newForecast));

          const tempDate = new Date();
          tempDate.setTime(tempDay.time * 1000);
          labels2.push(`${Constants.months[tempDate.getMonth()]} ${tempDate.getDate()}`);

          colors2.push(Constants.colors.blue3);
        }

  
        setSnowPack(generateChartData(depths, labels, colors, depths2, labels2, colors2));
      });
    });
  }, []);

  return (
    <section className="SnowDepth">
      <Bar data={snowPack} options={options}/>
    </section>
  );
}

export default SnowDepth;

function generateChartData(data, labels, colors, data2, labels2, colors2) {
  return {
    labels: labels2,
    datasets: [
      {
        labels: labels,
        barPercentage: 1.2,
        data: data,
        backgroundColor: colors,
      },
      {
        labels: labels2,
        barPercentage: 1.2,
        data: data2,
        backgroundColor: colors2,
      }
    ]
  };
}