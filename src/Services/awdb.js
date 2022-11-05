import constants from '../constants';

const AWDB_JSON_ENDPOINT = 'https://hh45z6zeke.execute-api.us-west-2.amazonaws.com/Prod/';

let cachedResponse = {};

const Awdb =  {
    getData: async function ({ stationTriplets, elementCd, ordinal = 1, duration = 'DAILY', startDate, endDate }) {
        if(cachedResponse[elementCd]) {
            return cachedResponse[elementCd];
        }

        const path = 'getData';

        const params = {
            stationTriplets,
            ordinal,
            elementCd,
            duration,
            beginDate: convertDateToAWDBFormat(startDate),
            endDate: convertDateToAWDBFormat(endDate),
        };

        const response = await fetch(`${AWDB_JSON_ENDPOINT}${path}?${new URLSearchParams(params)}`);
        const snowData = await response.json();
 
        // HANDLE BAD REQUEST
        
        const transformedResponse = transformResponse(snowData);

        cachedResponse[elementCd] = transformedResponse;

        return transformedResponse;
    },
    getStationMetadata: async function ({ stationTriplet }) {
        const path = 'getStationMetadata';

        const params = {
            stationTriplet,
        };

        const response = await fetch(`${AWDB_JSON_ENDPOINT}${path}?${new URLSearchParams(params)}`);
        const stationData = await response.json();

        return stationData;
    }
}

export default Awdb;

function transformResponse(data) {
    const transformedData = [];
        
    for(const item of data) {
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

        transformedData.push(newItem)
    }

    return transformedData;
}

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

function fixDateForSafari(date) {
    return date.replaceAll('-', '/');
}