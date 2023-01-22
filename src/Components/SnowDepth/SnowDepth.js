import './SnowDepth.css';
import React, { useEffect, useState } from "react";
import Constants from '../../constants';
import _ from "lodash";
import { getFormattedDate, generateStripes } from '../../utils';

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

function SnowDepth({ depth, forecast, centerDate}) {
  const [data, setData] = useState(generateChartData([]));

  const options = generateOptions('"')

  useEffect(() => {
    let chartData = [];

    // Transform AWDB Data to Values, Labels, & Colors
    const values = depth.map(value => value.value);
    const labels = depth.reduce((prev, value) => {
      prev.push(getFormattedDate(value.date));
      return prev;
    }, []);
    const colors = depth.map(() => { return Constants.colors.orange2 });

    // Get the current amount of snow
    let forecastSum = depth[depth.length - 1].value;

    // Handling a case when the API fails to return today......
    if(values.length === Constants.daysToForecast) {
      values.pop();
      labels.pop();
      colors.pop();
    }

    // Duplicate the arrays for the stacked bar chart
    const additionalValues = values.map(() => 0);
    const additionalLabels = [...labels];
    const addiontalColors = [...colors];

    // We are currently not showing todays snow level
    // Only what the forecast for the end of the day is + currentSnowLevel

    // Sum up all the forecasts and add them to the array

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = forecast.daily.data[i];

      // Get the days forecasted precipition
      let precipAccumulation = tempDay.precipAccumulation ? tempDay.precipAccumulation : 0;

      // Push the current snow depth
      values.push(forecastSum);

      // Push the forecasted snow accumulation
      additionalValues.push(precipAccumulation);

      // Add forecasted to current snow depth
      forecastSum += precipAccumulation;
      
      // Get and push the time
      const tempDate = new Date(centerDate);
      tempDate.setTime(tempDay.time * 1000);
      labels.push(getFormattedDate(tempDate));
      additionalLabels.push(getFormattedDate(tempDate));

      // Make today orange
      if (i !== 0) {
        colors.push(Constants.colors.blue3);
        addiontalColors.push(generateStripes(Constants.colors.blue));
      } else {
        colors.push(Constants.colors.orange);
        addiontalColors.push(generateStripes(Constants.colors.orange));
      }
    }

    chartData.push({
      values,
      labels,
      colors,
    });
    chartData.push({
      values: additionalValues,
      labels: additionalLabels,
      colors: addiontalColors,
    });

    const generatedChartData = generateChartData(chartData);

    setData(generatedChartData);
  }, [depth, forecast, centerDate]);

  return (
    <section className="SnowDepth">
      <h2>Snow Depth</h2>
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
        barPercentage: 1,
        data: value.values,
        backgroundColor: value.colors,
        stack: 'Stack 0',
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
      duration: 100,
    },
    scales: {
      x: {
        grid: {
          drawBorder: true,
        },
        ticks: {
          font: {
            family: 'Courier',
          },
        },
      },
      y: {
        beginAtZero: false,
        stacked: true,
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
      },
    },
  };
}