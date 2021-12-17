import axios from 'axios';

const DARKSKY_AWS_ENDPOINT = 'https://gyr3n45np5.execute-api.us-west-2.amazonaws.com/Prod/forecast';
const TIMBERLINE_LATITUDE = 45.330947;
const TIMBERLINE_LONGITUDE = -121.709854;

const DarkSky =  {
    getForecast: async function () {
        return axios.get(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE}/${TIMBERLINE_LONGITUDE}`);
    }
}

export default DarkSky;