/**
 * get time range ["MORNING", "AFTERNOON", "EVENING"]
 */
exports.getTimeRange = function(){
    var today = new Date()
    var curHr = today.getHours()

    if (curHr < 12) {
        return "MORNING";
    } else if (curHr < 18) {
        return "AFTERNOON";
    } else {
        return "EVENING";
    }
}

exports.getRandomNumber = function getRandomArbitrary(min, max) {
    return Math.round((Math.random() * (max - min) + min))
};