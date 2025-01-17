const {chartJSNodeCanvas} = require("./canvas");
const {colors} = require("../../../Constants");

Number.prototype.betweenWithoutTouch = function (min, max) {
    if (min && max) return this >= min && this < max
    else if (min && !max) return this >= min
    else if (!min && max) return this < max
    else return false
}

const getColorDependingOnThreshold = ({value, thresholds}) => {
    const {good, moderate, unhealthy, very_unhealthy, dangerous} = thresholds
    if (value.betweenWithoutTouch(0, good)) return colors.LessThanGood
    else if (value.betweenWithoutTouch(good, moderate)) return colors.BetweenGoodAndModerate
    else if (value.betweenWithoutTouch(moderate, unhealthy)) return colors.BetweenModerateAndUnhealthy
    else if (value.betweenWithoutTouch(unhealthy, very_unhealthy)) return colors.BetweenUnhealthyAndVeryUnhealthy
    else if (value.betweenWithoutTouch(very_unhealthy, dangerous)) return colors.BetweenVeryUnhealthyAndDangerous
    else return colors.MoreThanDangerous
}

const makeDataset = ({readings, station, thresholds}) => {
    const stationName = station.name
    const stationReadings = readings
    const currentValues = []
    const dotsColors = []
    stationReadings.forEach(o => {
        const value = {
            x: o.recorded_at,
            y: o.value,
        }
        const currentColor = getColorDependingOnThreshold({
            value: o.value,
            thresholds: thresholds
        })
        dotsColors.push(currentColor)
        currentValues.push(value)
    })

    return [{
        label: stationName,
        data: currentValues,
        backgroundColor: dotsColors
    }]
}

const getChartBase64 = async (dataset, pollutantUnit, title) => {

    const [currentData] = dataset
    const {data} = currentData
    const labels = data.map(value => value.x).sort()

    const canvasConfig = getCanvasConfig({dataset, pollutantUnit, title, labels})

    return await chartJSNodeCanvas.renderToDataURL(canvasConfig)
}

const getCanvasConfig = ({dataset, pollutantUnit, labels, title}) => {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataset,
        },
        options: {
            animations: false,
            showLine: false,
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    },
                    type: 'timeseries',
                    time: {
                        'unit': 'day'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: `Concentración ${pollutantUnit}`
                    },
                }
            }
        }
    };
}

module.exports = {
    getChartBase64,
    makeDataset
}
