export function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours, minutes, secs]
        .map(num => num.toString().padStart(2, '0'))
        .join(':')
}
export function timeToSeconds(time){
    console.log(time)
    const [hours, minutes, seconds] = time?.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
}