import axios from 'axios';

const DARKSKY_AWS_ENDPOINT = 'https://gyr3n45np5.execute-api.us-west-2.amazonaws.com/Prod/forecast';
const TIMBERLINE_LATITUDE = 45.330947;
const TIMBERLINE_LONGITUDE = -121.709854;

let requestCount = 0;
let cachedResponse;

const DarkSky =  {
    getForecast: async function () {
        if(cachedResponse) { return cachedResponse }

        const forecast = await axios.get(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE}/${TIMBERLINE_LONGITUDE}`);

        const forecastData = forecast.data;

        cachedResponse = forecastData;

        return forecastData;
    }
}

export default DarkSky;