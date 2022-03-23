import constants from '../constants';

const AWDB_JSON_ENDPOINT = 'https://hh45z6zeke.execute-api.us-west-2.amazonaws.com/Prod/';

let cachedResponse = {};

const Awdb =  {
    getHourlyData: async function () {
        const path = 'getHourlyData';

        const today = new Date();
        const daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-3);

        const params = {
            stationTriplets: '651:OR:SNTL',
            ordinal: '1',
            elementCd: 'SNWD',
            beginDate: convertDateToAWDBFormat(daysAgo),
            endDate: convertDateToAWDBFormat(today),
        };

        const response = await fetch(`${AWDB_JSON_ENDPOINT}${path}?${new URLSearchParams(params)}`);
        const snowData = await response.json();

        return snowData;
    },
    getData: async function (elementCd) {
        if(cachedResponse[elementCd]) {
            return cachedResponse[elementCd];
        }

        const path = 'getData';

        const today = new Date();
        const daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1));

        const params = {
            stationTriplets: '651:OR:SNTL',
            ordinal: '1',
            elementCd: elementCd,
            duration: 'DAILY',
            beginDate: convertDateToAWDBFormat(daysAgo),
            endDate: convertDateToAWDBFormat(today),
        };

        const response = await fetch(`${AWDB_JSON_ENDPOINT}${path}?${new URLSearchParams(params)}`);
        const snowData = await response.json();
 
        // HANDLE BAD REQUEST
        
        const transformedResponse = [];
        
        for(const item of snowData) {
            const transformedItems = [];
            const beginDate = new Date(fixDateForSafari(item.beginDate));

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

        cachedResponse[elementCd] = transformedResponse;

        return transformedResponse;
    }
}

export default Awdb;

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

function fixDateForSafari(date) {
    return date.replaceAll('-', '/');
}