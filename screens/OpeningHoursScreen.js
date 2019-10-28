import React, { Component, Fragment } from 'react';
import { ScrollView, StyleSheet, NetInfo, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import Icon from "react-native-fontawesome-pro";
import DatePicker from "react-native-datepicker";
import Layout from './../constants/Layout';
import { Button as EleButton } from "react-native-elements";

export default class OpeningHoursScreen extends Component {
    state = {
        isConnected: false,
        daysOfWeek: moment.weekdays(),
        status: this.props.navigation.getParam('status'),
        hours: JSON.parse(this.props.navigation.getParam('opening_hours')),
        expandedDays: moment.weekdays().reduce(function (acc, cv, ci) {
            acc[cv] = false;
            return acc;
        }, {}),
    };

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Opening Hours',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 20,
                width: '100%',
                color: '#555555'
            },
            headerStyle: {
                elevation: 0,
                shadowColor: 'transparent',
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
            },
            headerBackImage: <Icon name="times" type={"solid"} size={20} style={{ padding: 100 }}
                color={"#CCCCCC"} />,
            headerRight: <EleButton title={"Save"} raised
                titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 11 }}
                buttonStyle={{ backgroundColor: '#EC696A', width: 65, height: 27 }}
                containerStyle={{ marginRight: 10 }}
                onPress={() => {
                    if (params.status === 'update') {
                        navigation.state.params.onChangeOpeningHoursCallback(params.updatedHours)
                    }
                    else {
                        navigation.state.params.updatedOpeningHours(params.updatedHours);
                    }
                    navigation.pop(1);
                }}>
            </EleButton>
        }
    };

    openCloseToggle = (day, value) => {
        this.setState((prevState) => {
            const hours = { ...prevState.hours };
            hours[day]['is_open'] = value;
            return {
                ...prevState,
                hours
            };
        });
    };

    expandedToggle = (day) => {
        this.setState((prevState) => {
            const expandedDays = { ...prevState.expandedDays };
            expandedDays[day] = !expandedDays[day];
            return {
                ...prevState,
                expandedDays
            };
        });
    };

    updateTime = (day, key, updatedTime) => {
        this.setState((prevState) => {
            const hours = { ...prevState.hours };
            hours[day][key] = updatedTime;
            return {
                ...prevState,
                hours
            };
        });
    };

    onFocus(day, key) {
        this.setState((prevState) => {
            const hours = { ...prevState.hours };
            for (let k in hours) {
                if (k === day) {
                    hours[day][key] = true;
                    if (key === 'endTimeFocused')
                        hours[day]['startTimeFocused'] = false;
                    if (key === 'startTimeFocused')
                        hours[day]['endTimeFocused'] = false;
                } else {
                    if (hours.hasOwnProperty(k)) {
                        hours[k]['endTimeFocused'] = false;
                        hours[k]['startTimeFocused'] = false;
                    }
                }
            }
            return {
                ...prevState,
                hours
            };
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
                console.log(this.state);
        */

    }

    componentWillMount() {
        this.props.navigation.setParams({ status: this.state.status });
        this.props.navigation.setParams({ updatedHours: this.state.hours });

    }
    componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    };

    render() {
        const { daysOfWeek, expandedDays, hours, hours1 } = this.state;
        return (
            <View><ScrollView>
                <View style={{ flex: 1, padding: 35, minHeight: Layout.window.height - 80 }}>
                    {daysOfWeek.map(day => {
                        return (
                            <View key={day} style={{
                                flex: 1,
                                minHeight: 85,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <View style={styles.rowStyle1}>
                                    <TouchableOpacity style={styles.mainIconContainer}
                                        onPress={() => this.openCloseToggle(day, hours[day].is_open ? false : true)}>
                                        {hours[day].is_open ? (expandedDays[day] ?
                                            <Icon name="check-circle" type={"solid"} size={21}
                                                color={"rgba(40, 127, 126, 1)"} /> :
                                            <Icon name="check-circle" type={"solid"} size={21}
                                                color={"rgba(40, 127, 126, 0.4)"} />) :
                                            <Icon name="times-circle" type={"solid"} size={21}
                                                color={"rgba(136, 136, 136, 0.4)"} />}
                                    </TouchableOpacity>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>{day}</Text>
                                        {hours[day].is_open ? (expandedDays[day] ? (<Fragment>
                                            <Text style={styles.textStyle2}>Edit opening
                                                    hours: </Text>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ alignSelf: 'center' }}><DatePicker
                                                    style={{ width: 100 }}
                                                    date={hours[day]['open']}
                                                    mode="time"
                                                    format="HH:mm:ss"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    minuteInterval={10}
                                                    customStyles={{
                                                        dateInput: {
                                                            borderWidth: 0,
                                                            borderBottomWidth: 2,
                                                            borderBottomColor: hours[day]['startTimeFocused'] ? '#287F7E' : '#888888'
                                                        }
                                                    }}
                                                    onOpenModal={() => this.onFocus(day, 'startTimeFocused')}
                                                    onDateChange={(time) => this.updateTime(day, 'open', time)}
                                                    showIcon={false}
                                                /></View><View style={{ alignSelf: 'center' }}><Text> - </Text></View>
                                                <View style={{ alignSelf: 'center' }}><DatePicker
                                                    style={{ width: 100 }}
                                                    date={hours[day]['close']}
                                                    mode="time"
                                                    format="HH:mm:ss"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    minuteInterval={10}
                                                    customStyles={{
                                                        dateInput: {
                                                            borderWidth: 0,
                                                            borderBottomWidth: 2,
                                                            borderBottomColor: hours[day]['endTimeFocused'] ? '#287F7E' : '#888888'
                                                        }
                                                    }}
                                                    onOpenModal={() => this.onFocus(day, 'endTimeFocused')}
                                                    onDateChange={(time) => this.updateTime(day, 'close', time)}
                                                    showIcon={false}
                                                /></View>
                                                {/*<Text style={styles.textStyle2}>Edit opening
                                            hours: </Text>*/}
                                            </View>
                                        </Fragment>

                                        ) : <Text
                                            style={styles.textStyle2}>{hours[day]['open']} - {hours[day]['close']}</Text>) :
                                            <Text style={styles.textStyle2}>Close</Text>}
                                    </View>
                                    <TouchableOpacity style={styles.endIconContainer}
                                        onPress={() => this.expandedToggle(day)}
                                        hitSlop={{ top: 20, left: 40, bottom: 20, right: 40 }}
                                        pressRetentionOffset={{ top: 20, left: 40, bottom: 20, right: 40 }}>
                                        {hours[day].open ? (expandedDays[day] ? <Icon name="angle-up" type={"solid"}
                                            size={12} color={"#888888"}
                                        /> : <Icon name="angle-down" type={"solid"}
                                            size={12} color={"#888888"}
                                            />) : null}</TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    mainIconContainer: { flex: 1, justifyContent: 'center' },
    endIconContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
    centerTextContainer: { flex: 5, justifyContent: 'center' },
    textStyle1: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#000000' },
    textStyle2: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    },
    NetworkContainter:
    {
        position: 'absolute',
        backgroundColor: '#555555',
        flexDirection: 'row',
        alignItems: 'center',
        left: 0,
        bottom: 0,
        right: 0,
        height: 50,
        paddingLeft: 10,
        paddingRight: 55,
        paddingBottom: 0,
    },
    NetworkMessage:
    {
        color: '#fff',
        fontSize: 14
    },
});
