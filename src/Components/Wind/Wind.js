import './Wind.css';
import React, { useEffect, useState } from "react";
import Constants from '../../constants';
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

function Wind({ forecast, past, centerDate}) {
  const [data, setData] = useState(generateChartData([]));

  const options = generateOptions('Wind', 'mph')

  useEffect(() => {
    let chartData = [];

    const values = [];
    const labels = [];
    const colors = [];

    for(let i = 0; i < past.length; i++) {
      const tempDay = past[i].daily.data[0];

      values.push([tempDay.windSpeed, tempDay.windGust]);

      const tempDate = new Date(centerDate);
      tempDate.setTime(tempDay.time * 1000);
      labels.push(getFormattedDate(tempDate));

      colors.push(Constants.colors.blue2);
    }

    for (let i = 0; i < Constants.daysToForecast; i++) {
      const tempDay = forecast.daily.data[i];

      values.push([tempDay.windSpeed, tempDay.windGust]);

      const tempDate = new Date(centerDate);
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
  }, [forecast, past, centerDate]);

  return (
    <section className="Wind">
      <Bar data={data} options={options}/>
    </section>
  );
}

export default Wind;

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
    aspectRatio: 1.25,
    borderRadius: 50,
    animation: {
      duration: 200,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
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