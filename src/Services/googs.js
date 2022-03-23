const axios = null;

const GOOGLE_DIRECTIONS_ENDPOINT = 'https://maps.googleapis.com/maps/api/directions/json';

function convertDateToAWDBFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const Googs =  {
    getDirections: async function () {
        return axios.get(`${GOOGLE_DIRECTIONS_ENDPOINT}`, {
            params: {
                origin: 'Portland+OR',
                destination: 'Timberline+Lodge+OR',
                key: 'AIzaSyBqLyUnk_LINR_5UTpg56pcRCyy76eB5N0', // Going to need to delete this key...
            },
        });
    }
}

export default Googs;