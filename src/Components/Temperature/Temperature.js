import './Temperature.css';
import React, { useEffect, useState } from "react";
import Constants from '../../constants';
import { getFormattedDate } from '../../utils';
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

function Temperature({ tempMax, tempMin, forecast, centerDate }) {
  const [data, setData] = useState(generateChartData([]));

  const options = generateOptions('\xB0F')

  useEffect(() => {
    let chartData = [];

    // Transform AWDB Data to Values, Labels, & Colors
    const values = tempMax.map((value, index) => [tempMin[index].value, value.value]); // this is gross
    const labels = tempMax.reduce((prev, value) => {
      prev.push(getFormattedDate(value.date));
      return prev;
    }, []);
    const colors = tempMax.map((dataPoint) => { 
      if(dataPoint.value > 32) return Constants.colors.red;
 
      return Constants.colors.orange2;
    });

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = forecast.daily.data[i];

      const tempLow = tempDay.temperatureLow;
      const tempHigh = tempDay.temperatureHigh;

      values.push([tempLow, tempHigh]);

      const tempDate = new Date(centerDate);
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
  }, [tempMax, tempMin, forecast, centerDate]);

  return (
    <section className="Temperature">
      <h2>Temperature</h2>
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
        barPercentage: 0.66,
        data: value.values,
        backgroundColor: value.colors,
        borderRadius: 50,
        borderSkipped: false,

      };
    }),
  };

  return chart;
}

function generateOptions(yUnits) {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    borderRadius: 50,
    aspectRatio: 1.25,
    animation: {
      duration: 200,
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Courier',
          },
        },
      },
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
          font: {
            family: 'Courier',
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