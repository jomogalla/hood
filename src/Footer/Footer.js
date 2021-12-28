import './Footer.css';
import React, { useEffect, useState, useRef } from "react";
import AWDB from '../Services/awdb';
import DarkSky from '../Services/darksky';
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Footer() {
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
      duration: 0,
      onComplete: function () {
          // render the value of the chart above the bar
          // console.log(ChartJS.helpers)
          var ctx = this.ctx;
          // ctx.font = ChartJS.helpers.fontString(ChartJS.defaults.font.size, 'normal', ChartJS.defaults.font.family);
          // ctx.fillStyle = this.config.options.defaultFontColor;
          // ctx.textAlign = 'center';
          // ctx.textBaseline = 'bottom';
          // this.data.datasets.forEach(function (dataset) {
          //     for (var i = 0; i < dataset.data.length; i++) {
          //         var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
          //         ctx.fillText(dataset.data[i], model.x, model.y - 5);
          //     }
          // });
      }
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

  const grey = '#BCB1AD';

  const green = '#999980';
  const red = '#91505F';
  const black = '#242629';
  const white = '#FFFEFC';
  const tan = `#AE9581`;
  const blue = '#C9DED5';
  const blue2 = '#69828C';
  const blue3 = '#E2DFE6';
  const orange = '#DE9681';

  useEffect(()=>{
    AWDB.getData().then((response) => {
      // const depths = getData(response.data[0].values);
      // const labels = getLabels(response.data[0].values);
      const values = response[0].values;

      const depths = values.map(value => value.value);
      const labels = values.reduce((prev, value) => {
          prev.push(`${months[value.date.getMonth()]} ${value.date.getDate()}`);
        
        return prev;
      }, []);
      const colors = values.map(() => { return grey});
      // console.log(colors)

      

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
          labels2.push(`${months[tempDate.getMonth()]} ${tempDate.getDate()}`);

          // console.log(colors)
          colors2.push(blue3);
        }

  
        setSnowPack(generateChartData(depths, labels, colors, depths2, labels2, colors2));
      });

      
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
