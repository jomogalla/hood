import './Temperature.css';
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

function Temperature() {
  const [data, setData] = useState(generateChartData([]));

  const options = generateOptions('Temperatures', '\xB0F')

  useEffect(async () => {
    let chartData = [];

    // Get Snotel Snow Depth Data
    let awdbDataMax = await AWDB.getData('TMAX');
    awdbDataMax = awdbDataMax[0].values; // this is gross

    let awdbDataMin = await AWDB.getData('TMIN');
    awdbDataMin = awdbDataMin[0].values; // this is gross

    // Transform AWDB Data to Values, Labels, & Colors
    // const values = awdbData.map(value => [value.value, value.value]);
    const values = awdbDataMax.map((value, index) => [awdbDataMin[index].value, value.value]); // this is gross
    const labels = awdbDataMax.reduce((prev, value) => {
      prev.push(getFormattedDate(value.date));
      return prev;
    }, []);
    const colors = awdbDataMax.map((dataPoint) => { 
      // console.log(dataPoint)
      if(dataPoint.value > 32) return Constants.colors.red;
 
      return Constants.colors.blue2;
    });

    // Remove the values for today from our arrays
    // values.pop();
    // labels.pop();
    // colors.pop();

    // Get Weather Forecast
    let darkSkyData = await DarkSky.getForecast();
    darkSkyData = darkSkyData.data; // this is gross



    // We are currently not showing todays snow level
    // Only what the forecast for the end of the day is + currentSnowLevel

    // Sum up all the forecasts and add them to the array
    let forecastSum = awdbDataMax[awdbDataMax.length - 1].value;

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = darkSkyData.daily.data[i];

      forecastSum += tempDay.precipAccumulation;
      const tempLow = tempDay.temperatureLow;
      const tempHigh = tempDay.temperatureHigh;

      // values.push
      
      values.push([tempLow, tempHigh]);

      const tempDate = new Date();
      tempDate.setTime(tempDay.time * 1000);
      labels.push(getFormattedDate(tempDate));

      // Make today orange
      if (i === 0) {
        colors.push(Constants.colors.orange);
      } else if (tempHigh > 32) {
        colors.push(Constants.colors.red);
      } else {
        colors.push(Constants.colors.blue3)
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
    <section className="Temperature">
      <Bar data={data} options={options}/>
    </section>
  );
}

export default Temperature;

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
        // borderWidth: 2,
        borderRadius: 50,
        borderSkipped: false,

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
    borderRadius: 50,
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
        grid: {
          drawBorder: true,
          color: function(context) {
            if (context.tick.value > 32) {
              return Constants.colors.orange;
            } 

            return Constants.colors.grey;
          },
        },
      },
    },
  };

}