const DARKSKY_AWS_ENDPOINT = 'https://gyr3n45np5.execute-api.us-west-2.amazonaws.com/Prod/forecast/darksky';

const params = {
    exclude: 'minutely,hourly,flags',
};

const DarkSky =  {
    getForecast: async function ({latitude, longitude}) {
        const response = await fetch(`${DARKSKY_AWS_ENDPOINT}/${latitude},${longitude}?${new URLSearchParams(params)}`)
        const forecast = await response.json();

        return forecast;
    },
    getPast: async function({date, latitude, longitude}) {
        const time = new Date(date).getTime() / 1000;

        const response = await fetch(`${DARKSKY_AWS_ENDPOINT}/${latitude},${longitude},${time}?${new URLSearchParams(params)}`);
        const forecast = await response.json();

        return forecast;
    },
}

export default DarkSky;