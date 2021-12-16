import axios from 'axios';

const AWDB_JSON_ENDPOINT = 'https://hh45z6zeke.execute-api.us-west-2.amazonaws.com/Prod/';

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

const Awdb =  {
    getHourlyData: async function () {
        const path = 'getHourlyData';

        const today = new Date();
        const threeDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-3);

        return axios.get(`${AWDB_JSON_ENDPOINT}${path}`, {
            params: {
                stationTriplets: '651:OR:SNTL',
                ordinal: '1',
                elementCd: 'SNWD',
                beginDate: convertDateToAWDBFormat(threeDaysAgo),
                endDate: convertDateToAWDBFormat(today),
            }
        });
    }
}

export default Awdb;