export const stations = [
    {
        name: 'Hood',
        triplet: '651:OR:SNTL',
        default: true,
    },
    {
        name: 'Mckenzie',
        triplet: '619:OR:SNTL',
        default: false,
    },
    {
        name: 'Aneroid',
        triplet: '302:OR:SNTL',
        default: false,
    },
    {
        name: 'Eilertson Meadows',
        triplet: '464:OR:SNTL',
        default: false,
    },
    {
        name: 'Wolf Creek',
        triplet: '873:OR:SNTL',
        default: false,
    },
    {
        name: 'Bourne',
        triplet: '361:OR:SNTL',
        default: false,
    }
]

export const getDefaultStation = () => {
    return stations.find((station) => station.default)
}