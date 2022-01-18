import './SnowDepth.css';
import React, { useEffect, useState } from "react";
import AWDB from '../Services/awdb';
import DarkSky from '../Services/darksky';
import Constants from '../constants';
import _ from "lodash";
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

function SnowDepth(props) {
  const [data, setData] = useState(generateChartData([]));

  const options = generateOptions('Snow Depth', '"')

  let { depth, forecast } = props;

  useEffect(async () => {
    let chartData = [];

    // Transform AWDB Data to Values, Labels, & Colors
    const values = depth.map(value => value.value);
    const labels = depth.reduce((prev, value) => {
      prev.push(getFormattedDate(value.date));
      return prev;
    }, []);
    const colors = depth.map(() => { return Constants.colors.grey });

    let forecastSum = depth[depth.length - 1].value;

    // Remove the values for today from our arrays
    values.pop();
    labels.pop();
    colors.pop();

    // We are currently not showing todays snow level
    // Only what the forecast for the end of the day is + currentSnowLevel

    // Sum up all the forecasts and add them to the array
    // console.log('ENTER DANGER ZONE')

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = forecast.daily.data[i];

      let precipAccumulation = tempDay.precipAccumulation ? tempDay.precipAccumulation : 0;

      forecastSum += precipAccumulation;
      values.push(Math.floor(forecastSum));

      const tempDate = new Date();
      tempDate.setTime(tempDay.time * 1000);
      labels.push(getFormattedDate(tempDate));

      // Make today orange
      if (i !== 0) {
        colors.push(Constants.colors.blue3);
      } else {
        
        colors.push(Constants.colors.orange)
      }

    }

    chartData.push({
      values,
      labels,
      colors,
    });

    setData(generateChartData(chartData));
  }, []);

  return (
    <section className="SnowDepth">
      <Bar data={data} options={options}/>
    </section>
  );
}

export default SnowDepth;

function generateChartData(chartData) {
  if(!chartData.length) {
    return {
      labels: [],
      datasets: [],    
    };
  }

  const chart = {
    labels: _.uniq(chartData.reduce((acc, val) => acc.concat(val.labels), [])),
    datasets: chartData.map((value, index) => {
      return {
        stack: index,
        labels: value.labels,
        barPercentage: 1.2,
        data: value.values,
        backgroundColor: value.colors,
      };
    }),
  };

  return chart;
}

function getFormattedDate(date) {
  return `${Constants.days[date.getDay()]} ${date.getDate()}`;
}

function generateOptions(title, yUnits) {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    aspectRatio: 1.25,
    animation: {
      duration: 200,
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            if(!yUnits) {
              yUnits = '';
            }

            return  `${value}${yUnits}`;
          },
        },
      },
    },
  };

}