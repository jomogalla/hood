import axios from 'axios';

const AWDB_JSON_ENDPOINT = 'https://hh45z6zeke.execute-api.us-west-2.amazonaws.com/Prod/';

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const awdb =  {
    getHourlyData: async function () {
        const path = 'getHourlyData'; //Man

        const today = convertDateToAWDBFormat(new Date());

        return axios.get(`${AWDB_JSON_ENDPOINT}${path}`, {
            params: {
                stationTriplets: '651:OR:SNTL',
                ordinal: '1',
                elementCd: 'SNWD',
                beginDate: today,
                endDate: today,
            }
        });
    }
}

export default awdb;