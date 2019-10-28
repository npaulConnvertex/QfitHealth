function mapDaysToNumbers(object) {
    const arr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return arr.reduce(function (acc, cv, ci) {
        acc[ci] = object[cv];
        return acc;
    }, {});
}

function mapNumbersToDays(object) {
    const arr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return arr.reduce(function (acc, cv, ci) {
        acc[cv] = object[ci];
        return acc;
    }, {});
}

export {
    mapDaysToNumbers,
    mapNumbersToDays
}
