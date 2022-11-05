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
    }
]

export const getDefaultStation = () => {
    return stations.find((station) => station.default)
}