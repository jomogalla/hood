const DARKSKY_AWS_ENDPOINT = 'https://gyr3n45np5.execute-api.us-west-2.amazonaws.com/Prod/forecast/darksky';
const TIMBERLINE_LATITUDE = 45.330947;
const TIMBERLINE_LONGITUDE = -121.709854;

const params = {
    exclude: 'minutely,hourly,flags',
};

const DarkSky =  {
    getForecast: async function () {
        const response = await fetch(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE},${TIMBERLINE_LONGITUDE}?${new URLSearchParams(params)}`)
        const forecast = await response.json();

        return forecast;
    },
    getPast: async function(date) {
        const time = new Date(date).getTime() / 1000;

        const response = await fetch(`${DARKSKY_AWS_ENDPOINT}/${TIMBERLINE_LATITUDE},${TIMBERLINE_LONGITUDE},${time}?${new URLSearchParams(params)}`);
        const forecast = await response.json();

        return forecast;
    },
}

export default DarkSky;