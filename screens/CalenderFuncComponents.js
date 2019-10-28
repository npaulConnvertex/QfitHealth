import React, { Fragment } from 'react';
import {
    AsyncStorage,
    NetInfo,
    Alert,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    TouchableHighlight,
} from 'react-native';
import moment from 'moment';



getSelectedCount = (data) => Object.values(data).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);

getSelectedCountWithDone = (data) => Object.values(data).reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);


export const RenderAvailEvents = (props) => {

    let employeeid = props.employeeid, employees = props.employees, slot = props.slot, allSlots = props.allSlots, minDuration = props.minDuration;
    let index = props.index, times = props.times, rowHeight = props.rowHeight, selectedMenuItem = props.selectedMenuItem, onPressEvent = props.onPressEvent;
    // console.warn("HELLO");
    // console.log("HELLO", slot);
    return (
        <View

            style={{
                width: calculateWidths(slot, index, employeeid, allSlots),
                height: (slot.duration / 60) * rowHeight,
                // width: '100%',
                height: slot.duration,
                justifyContent: 'center',
                position: 'absolute',
                top: times.reduce((acc, cv, ci) => {
                    if (cv.hours() <= moment(slot.startTime, "HH:mm:ss").hours())
                        acc += rowHeight;
                    return acc;
                }, 0) + (moment(slot.startTime, "HH:mm:ss").minutes() / 60) * rowHeight,
                backgroundColor: 'white',
                zIndex: 9,
                borderStyle: 'dashed',
                left: calculateLefts(slot, index, employeeid, allSlots),
                borderWidth: 1,
                borderRadius: 2,
                borderColor: "#888888",
                padding: 1,
                paddingBottom: 2,

            }}>
            {
                <Innverview
                    onPressEvent={onPressEvent}
                    slot={slot}
                    employees={employees}
                    minDuration={minDuration}
                    selectedMenuItem={selectedMenuItem} />
            }
        </View>
    )
}



const Innverview = (props) => {

    let employeeid = props.employeeid, employees = props.employees, slot = props.slot, allSlots = props.allSlots, minDuration = props.minDuration;
    let index = props.index, times = props.times, rowHeight = props.rowHeight, selectedMenuItem = props.selectedMenuItem, onPressEvent = props.onPressEvent;;


    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPressEvent}
            style={[{
                flex: 1,
                paddingLeft: 5,
                paddingTop: 5,
            },

            slot.duration < minDuration ? {
                justifyContent: 'center',
                paddingLeft: 2,
                paddingTop: 2
            } : {}

            ]}>
            {/* TEMP CHANGES */}
            <View
            >
                <Fragment>
                    <Text
                        style={[styles.textStyle1, slot.duration < minDuration ? { fontSize: 9 } : {}]}>
                        {slot.customer}
                    </Text>
                    {slot.duration < minDuration && this.getSelectedCount() <= 2 && selectedMenuItem === 'Day' ?
                        <Text
                            style={styles.textStyle3}>{slot.duration} m</Text> : null}
                    {this.getSelectedCount(employees) <= 2 && slot.duration > minDuration ?
                        <Text
                            style={styles.textStyle2}>{slot.startTime.format("HH:mm")} - {slot.startTime.clone().add(slot.duration, "minutes").format("HH:mm")}
                        </Text> :
                        null}
                </Fragment>

            </View>
        </TouchableOpacity>
    );
}



const calculateLefts = (slot, j, accessor, slots) => {
    let array = findOverlaps(slot, j, accessor, slots);

    // console.warn("NEW ARRAY ", array[0]);

    if (array.length === 1)
        return '0%';
    else {
        let index = array.findIndex(e => e.key === slots[accessor][j].key);
        // console.log("LEFTS %   ", index * (100 / array.length) + "%")
        return index * (100 / array.length) + "%";
    }

};

const calculateWidths = (slot, j, accessor, slots) => {
    let array = findOverlaps(slot, j, accessor, slots);

    // console.log(slot, "SLOT", j, "J", array, " array")

    if (array.length === 1)
        return '100%';
    else {
        let index = array.findIndex(e => e.key === slots[accessor][j].key);
        // console.log("WIDTH %  ", 100 / array.length + "%")
        return 100 / array.length + "%";
    }
};



const findOverlaps = (slot, j, accessor, allslots) => {
    let array = allslots[accessor].reduce((acc, cv, ci) => {
        //console.log("slots start time", cv.startTime)
        let endTime = moment(cv.startTime).clone().add(cv.duration, "minutes");
        let slotEndTime = moment(slot.startTime).clone().add(slot.duration, "minutes");

        if (moment(slot.startTime, "HH:mm:ss").isBetween(moment(cv.startTime, "HH:mm:ss"), endTime, "minutes", '()') && ci !== j) {
            if (acc.findIndex(e => e.key === cv.key) === -1)
                acc.push(cv);
        }
        if (moment(slotEndTime, "HH:mm:ss").isBetween(moment(cv.startTime, "HH:mm:ss"), endTime, "minutes", '()') && ci !== j) {
            if (acc.findIndex(e => e.key === cv.key) === -1)
                acc.push(cv);
        }

        if (moment(slot.startTime, "HH:mm:ss").isSame(moment(cv.startTime, "HH:mm:ss"), "minutes") && slotEndTime.isSame(moment(endTime, "HH:mm:ss"), "minutes")) {
            if (acc.findIndex(e => e.key === cv.key) === -1)
                acc.push(cv);
        }

        if (moment(slot.startTime, "HH:mm:ss").isSame(moment(cv.startTime, "HH:mm:ss"), "minutes") && endTime.isBefore(moment(slotEndTime, "HH:mm:ss"), "minutes")) {
            if (acc.findIndex(e => e.key === cv.key) === -1)
                acc.push(cv);
        }

        if (moment(slotEndTime, "HH:mm:ss").isSame(moment(endTime, "HH:mm:ss"), "minutes") && cv.startTime.isAfter(moment(slot.startTime, "HH:mm:ss"), "minutes")) {
            if (acc.findIndex(e => e.key === cv.key) === -1)
                acc.push(cv);
        }

        return acc;
    }, [slot]);

    array = array.sort((a, b) => {
        if (moment(a.startTime).diff(moment(b.startTime), "minutes") === 0) {
            /*
            * For same times key will decide
            * */
            return a.key - b.key;
        }
        return moment(a.startTime).diff(moment(b.startTime), "minutes")
    });
    return array;
};


const styles = StyleSheet.create({
    textStyle1: {
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 11,
        color: '#000000'
    },
    textStyle2: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 9,
        color: '#000000'
    },
    textStyle3: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 10,
        color: '#000000',
        position: 'absolute',
        right: 10
    },
})