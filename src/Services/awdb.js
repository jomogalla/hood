import axios from 'axios';

const AWDB_JSON_ENDPOINT = 'https://hh45z6zeke.execute-api.us-west-2.amazonaws.com/Prod/';

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
    },
    getData: async function () {
        const path = 'getData';

        const today = new Date();
        const threeDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);

        const response = await axios.get(`${AWDB_JSON_ENDPOINT}${path}`, {
            params: {
                stationTriplets: '651:OR:SNTL',
                ordinal: '1',
                elementCd: 'SNWD',
                duration: 'DAILY',
                beginDate: convertDateToAWDBFormat(threeDaysAgo),
                endDate: convertDateToAWDBFormat(today),
            }
        });

        const transformedResponse = [];
        
        for(const item of response.data) {
            const transformedItems = [];
            const beginDate = new Date(item.beginDate);

            for(let i = 0; i < item.values.length; i++) {
                transformedItems.push({
                    date: new Date(new Date().setDate(beginDate.getDate() + i)),
                    flag: item.flags[i],
                    value: item.values[i],
                })
            }

            let newItem = {
                stationTriplet: item.stationTriplet,
                beginDate: item.beginDate,
                endDate: item.endDate,
                duration: item.duration,
                values: transformedItems
            }

            transformedResponse.push(newItem)
        }

        return transformedResponse;
    }
}

export default Awdb;

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}