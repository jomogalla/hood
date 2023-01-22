import './Temperature.css';
import React, { useEffect, useState } from "react";
import Constants from '../../constants';
import { getFormattedDate, generateStripes } from '../../utils';
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

    const values = [];
    const additionalValues = [];
    const freezing = 32;
    for(let i = 0; i < Math.min(tempMax.length, tempMin.length); i++) {

      if(tempMax[i].value > freezing) {
        const difference = tempMax[i].value - freezing;

        values.push([tempMin[i].value, freezing])
        additionalValues.push([0, difference]);
      } else {
        values.push([tempMin[i].value, tempMax[i].value])
        additionalValues.push(undefined);
      }
    }

    const labels = tempMax.reduce((prev, value) => {
      prev.push(getFormattedDate(value.date));
      return prev;
    }, []);
    const additionalLabels = [...labels];
    const additionalColors = [];

    const colors = tempMax.map((dataPoint) => { 
      additionalColors.push(generateStripes(Constants.colors.red2))
 
      return Constants.colors.orange2;
    });

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = forecast.daily.data[i];

      const tempLow = tempDay.temperatureLow;
      const tempHigh = tempDay.temperatureHigh;

      if(tempHigh > freezing ) {
        if(tempLow > freezing) {
          const difference = tempHigh - freezing;

          values.push([0, 0])
          additionalValues.push([tempLow, tempHigh]); // This makes the chart values bad....
        } else {
          const difference = tempHigh - freezing;

          values.push([tempLow, freezing])
          additionalValues.push([0, difference]); // This makes the chart values bad....
        }

      }
      else {
        values.push([tempLow, tempHigh])
        additionalValues.push(undefined);
      }

      const tempDate = new Date(centerDate);
      tempDate.setTime(tempDay.time * 1000);
      labels.push(getFormattedDate(tempDate));
      additionalLabels.push(getFormattedDate(tempDate));

      // Make today orange
      if (i === 0) {
        colors.push(Constants.colors.orange);
      } else {
        colors.push(Constants.colors.blue3)
      }

      additionalColors.push(Constants.colors.red2);
    }

    chartData.push({
      values,
      labels,
      colors,
    });

    chartData.push({
      values: additionalValues,
      labels: additionalLabels,
      colors: additionalColors,
    });

    const chartz = generateChartData(chartData);

    setData(chartz);
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
        borderSkipped: false,
        stack: 'Stack 0',
        borderRadius: value.values.map((value) => {
          if(!value) {
            return 0;
          }
          const [tempLow, tempHigh] = value;

          if(tempHigh === Constants.freezing) {
            return { topLeft: 0, topRight: 0, bottomLeft: 50, bottomRight: 50 };
          }

          if(tempLow === 0) {
            return { topLeft: 50, topRight: 50, bottomLeft: 0, bottomRight: 0 };
          }

          return 50;
        }),
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
        stack: true,
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