import axios from 'axios';

const DARKSKY_AWS_ENDPOINT = 'https://gyr3n45np5.execute-api.us-west-2.amazonaws.com/Prod/forecast/darksky';
const TIMBERLINE_LATITUDE = 45.330947;
const TIMBERLINE_LONGITUDE = -121.709854;

const params = {
    exclude: 'minutely,hourly,flags',
};

const DarkSky =  {
    getForecast: async function () {
        const forecast = await axios.get(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE},${TIMBERLINE_LONGITUDE}`, { params });

        const forecastData = forecast.data;

        return forecastData;
    },
    getPast: async function(date) {
        const time = new Date(date).getTime() / 1000;

        const forecast = await axios.get(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE},${TIMBERLINE_LONGITUDE},${time}`, { params });

        const forecastData = forecast.data;

        return forecastData;
    },
}

export default DarkSky;