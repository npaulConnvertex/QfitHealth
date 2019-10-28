import React from 'react';
import { Dimensions, NetInfo, AsyncStorage, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import { DrawerActions } from 'react-navigation-drawer';
import { TabBar, TabView } from "react-native-tab-view";
import { Button as EleButton, SearchBar } from 'react-native-elements';
import { getBusinesses, createServices } from "../axios/api";
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { createNewBusiness } from '../actions/CreateBusinessAction';
import { createNewEmployee, defaultnullEmployee } from "../actions/CreateEmployeeAction";
import { createNewService, defaultnullService } from "../actions/CreateServiceAction";
import { deleteSingleEmployee } from '../actions/DeleteEmployeeAction';
import { settingOpeningHoursAction, defaultnullOpeningHours } from '../actions/SetOpeningHoursAction';
import { mapNumbersToDays, mapDaysToNumbers } from "../shared/Utils";

const FirstRoute = (props) => (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={[styles.searchStyle]}>
            <SearchBar
                placeholder="Search service"
                placeholderTextColor="rgba(85, 85, 85, 0.5)"
                containerStyle={{
                    backgroundColor: '#FFFFFF',
                    shadowColor: "rgba(0, 0, 0, 0.16)",
                    shadowOffset: { width: 3, height: -5 },
                    shadowOpacity: 0.16,
                    shadowRadius: 6,
                    elevation: 6,
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent',
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderRadius: 19 / 3
                }}
                inputStyle={{ backgroundColor: '#FFFFFF' }}
                inputContainerStyle={{ backgroundColor: '#FFFFFF' }}
                lightTheme={true}
                searchIcon={<Icon name="search" color="#888888" size={19} />}
                clearIcon={false}
                style={{ backgroundColor: 'white', fontFamily: 'open-sans-hebrew', fontSize: 15 }}
                onChangeText={(text) => props.onChangeService(text)}
                value={props.searchBar}
                leftIconContainerStyle={{ backgroundColor: '#FFFFFF' }}
                rightIconContainerStyle={{ backgroundColor: '#FFFFFF' }} />
        </View>

        <ScrollView contentInset={{ top: 0, left: 0, bottom: 0, right: 1 }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', paddingBottom: 20 }}>
                <View style={{ minHeight: 80 }}>
                    <TouchableOpacity style={[styles.rowStyle1, {
                        width: '100%',
                        minHeight: 30

                    }]} onPress={() => props.navigation.navigate('NewService', {
                        addServiceCallback: props.onAddService,
                        services: props.services, name: props.searchBar
                    })}
                    >
                        <View style={[styles.mainIconContainer]}>
                            <Icon name={"plus"} type={"solid"} color={"#287F7E"} size={20} />
                        </View>

                        <View style={[styles.centerTextContainer, { height: 21 }]}>
                            {props.searchBar ? <Text style={styles.textStyle4}>Add new service '{props.searchBar}'
                            </Text> : <Text style={styles.textStyle4}>Add new service
                            </Text>}
                        </View>

                    </TouchableOpacity>
                    <View style={{ paddingBottom: 20 }}>
                        {Object.values(props.services).length == 0 ?
                            <Text style={[styles.centerTextContainer,
                            {
                                paddingLeft: 80,
                                fontFamily: 'open-sans-hebrew',
                                color: "#888888",
                                fontSize: 16,
                                paddingTop: 20
                            }
                            ]}>No Service Available</Text>
                            : Object.values(props.services).filter(s => s.isVisible).map(service => (
                                <View key={service.id} style={[styles.rowStyle2, {
                                    width: '100%',
                                    height: 80,
                                    paddingTop: 30,
                                    paddingLeft: 20
                                }]}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <EleButton title={""}
                                            buttonStyle={{
                                                backgroundColor: service.settings.color,
                                                width: 18,
                                                height: 18,
                                                borderRadius: 18 / 3
                                            }}>

                                        </EleButton>
                                    </View>

                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle2}>{props.CapitalizeService(service.name)}</Text>
                                        <Text
                                            style={[styles.textStyle3, { marginTop: 2 }]}> {service.settings != null ? service.settings.duration : ''}minutes
                                    ({service.settings != null ? service.settings.price : ''} ₪)</Text>
                                    </View>

                                </View>
                            ))}</View>
                </View>
            </View>
        </ScrollView>
        {props.isConnected ? <Text></Text> :
            <View style={styles.NetworkContainter}>
                <Text style={styles.NetworkMessage}>No Internet Connection</Text>
            </View>}
        <Animated.View
            style={[{ transform: [{ translateY: props.animatedValue }] }, styles.SnackBarContainter]}>
            <Text numberOfLines={1} style={styles.SnackBarMessage}>{props.SnackBarInsideMsgHolder}</Text>
            {/* <Text style={styles.SnackBarOkText} onPress={props.SnackBarCloseFunction} > OK </Text> */}
        </Animated.View>
    </View >
);

const SecondRoute = (props) => (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={[styles.searchStyle]}>
            <SearchBar
                placeholder="Search employee"
                placeholderTextColor="rgba(85, 85, 85, 0.5)"
                containerStyle={{
                    backgroundColor: '#FFFFFF',
                    shadowColor: "rgba(0, 0, 0, 0.16)",
                    shadowOffset: { width: 3, height: -5 },
                    shadowOpacity: 0.16,
                    shadowRadius: 6,
                    elevation: 6,
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent',
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderRadius: 19 / 3
                }}
                inputStyle={{ backgroundColor: '#FFFFFF' }}
                inputContainerStyle={{ backgroundColor: '#FFFFFF' }}
                lightTheme={true}
                searchIcon={<Icon name="search" color="#888888" size={19} />}
                clearIcon={false}
                style={{ backgroundColor: 'white', fontFamily: 'open-sans-hebrew' }}
                onChangeText={(text) => props.onChangeEmployee(text)}
                value={props.searchBar}
                leftIconContainerStyle={{ backgroundColor: '#FFFFFF' }}
                rightIconContainerStyle={{ backgroundColor: '#FFFFFF' }} />
        </View>
        <ScrollView contentInset={{ top: 0, left: 0, bottom: 0, right: 1 }}>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={{ minHeight: 80 }}>
                    <TouchableOpacity style={[styles.rowStyle1, {
                        width: '100%',
                        minHeight: 30,

                    }]} onPress={() => props.navigation.navigate('NewEmployee', {
                        addEmployeeCallback: props.onAddEmployee,
                        employees: props.employees, name: props.searchBar
                    })}
                    >

                        <View style={[styles.mainIconContainer]}>
                            <Icon name={"plus"} type={"solid"} color={"#287F7E"} size={20} />
                        </View>
                        <View style={styles.centerTextContainer}>
                            {props.searchBar ? <Text style={styles.textStyle4}>Add new employee '{props.searchBar}'
                            </Text> : <Text style={styles.textStyle4}>Add new employee
                            </Text>}

                        </View>

                    </TouchableOpacity>
                    <View style={styles.employeeMapContainer}>
                        {Object.values(props.employees).length == 0 ?
                            <Text style={[styles.centerTextContainer,
                            {
                                paddingLeft: 80,
                                fontFamily: 'open-sans-hebrew',
                                color: "#888888",
                                fontSize: 16,
                                paddingTop: 20
                            }
                            ]}>No Employee Available</Text>
                            : Object.values(props.employees).filter(s => s.isVisible).map(employee => (
                                <TouchableOpacity key={employee.user.id} style={{ width: '100%' }}
                                    onPress={() => props.navigation.navigate('EmployeeProfile',
                                        { employee: employee, deleteEmpIdCallback: props.deleteEmpId })}>
                                    <View key={employee.user.id}
                                        style={[styles.rowStyle2, {
                                            width: '100%',
                                            height: 60,
                                            paddingTop: 25,
                                            paddingLeft: 25
                                        }]}>

                                        <View
                                            style={[styles.circle, { backgroundColor: 'rgba(150, 0, 0, 0.26)' }]}>
                                            <View style={{
                                                flex: 1, justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                {(employee.user.image_id !== null ? <Image source={{ uri: employee.user.image_id }}
                                                    style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                                                    resizeMode={"cover"} /> :
                                                    (employee.user.first_name != null ?
                                                        <Text style={{
                                                            fontFamily: 'open-sans-hebrew',
                                                            fontSize: 23,
                                                            color: '#FFFFFF'
                                                        }}>{employee.user.first_name.substring(0, 1).toUpperCase()}</Text>
                                                        :
                                                        <Text style={{
                                                            fontFamily: 'open-sans-hebrew',
                                                            fontSize: 23,
                                                            color: '#FFFFFF'
                                                        }}>{employee.nickname.substring(0, 1).toUpperCase()}</Text>
                                                    )
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.centerTextContainer}>
                                            {employee.user.first_name != null ?
                                                <Text style={[styles.textStyle2, {
                                                    paddingLeft: 7,
                                                    color: "rgba(0, 0, 0, 0.87)"
                                                }]}>{props.CapitalizeEmployee(employee.user.first_name)} {props.CapitalizeEmployee(employee.user.last_name)}</Text>
                                                :
                                                <Text style={[styles.textStyle2, {
                                                    paddingLeft: 7,
                                                    color: "rgba(0, 0, 0, 0.87)"
                                                }]}>{props.CapitalizeEmployee(employee.nickname)}</Text>
                                            }

                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>
            </View>
        </ScrollView>
        {props.isConnected ? <Text></Text> :
            <View style={styles.NetworkContainter}>
                <Text style={styles.NetworkMessage}>No Internet Connection</Text>
            </View>}
        <Animated.View
            style={[{ transform: [{ translateY: props.animatedValue }] }, styles.SnackBarContainter]}>
            <Text numberOfLines={1} style={styles.SnackBarMessage}>{props.SnackBarInsideMsgHolder}</Text>
            {/* <Text style={styles.SnackBarOkText} onPress={props.SnackBarCloseFunction} > OK </Text> */}
        </Animated.View>
    </View>


);
const ThirdRoute = (props) => (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <View>
            <View style={{
                paddingLeft: 25, paddingBottom: 15, paddingTop: 25,
            }}>
                <Text style={styles.titleStyle}>Times</Text>
            </View>
            <TouchableOpacity onPress={() => console.log("pressed")} style={{
                flex: 0,
                flexDirection: 'row',
                width: '100%',
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Icon name={"store-alt"} type={"solid"} size={19} color={"#888888"} />
                </View>
                <View style={{
                    flex: 3, justifyContent: 'space-evenly',
                }}>
                    <Text style={styles.contentTitle}>Business Name</Text>
                    <Text style={styles.contentSubTitle}>{props.name}</Text>
                </View>
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    paddingRight: 7,
                }}>
                    <Icon name={"pen"} type={"solid"} size={12} color={"#888888"} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("pressed")} style={{
                flex: 0,
                flexDirection: 'row',
                height: 80,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Icon name={"file-alt"} type={"solid"} size={19} color={"#888888"} />
                </View>
                <View style={{
                    flex: 3, justifyContent: 'space-evenly',
                }}>
                    <Text style={styles.contentTitle}>Description</Text>
                    <Text style={styles.contentSubTitle}>Our business serve three different types of treatments </Text>
                </View>
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    paddingRight: 7,
                }}>
                    <Icon name={"pen"} type={"solid"} size={12} color={"#888888"} />

                </View>
            </TouchableOpacity>
        </View>
        <View>
            <View style={{
                paddingLeft: 25, paddingBottom: 15, paddingTop: 25,
            }}>
                <Text style={styles.titleStyle}>Times</Text>
            </View>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('BusinessOpeningHours', {
                    hours: JSON.stringify(props.hours),
                    status: props.status,
                    opening_hours: JSON.stringify(props.opening_hours),
                    onChangeOpeningHoursCallback: props.onChangeOpeningHours
                })}
                style={{
                    flex: 0,
                    flexDirection: 'row',
                    width: '100%',
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Icon name={"clock"} size={19} color={"#888888"} />
                </View>
                <View style={{
                    flex: 4, justifyContent: 'space-evenly',
                }}>
                    <Text style={styles.contentTitle}>Opening Hours</Text>
                    <Text style={styles.contentSubTitle}>{props.openingDays}</Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("pressed")} style={{
                flex: 0,
                flexDirection: 'row',
                width: '100%',
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Icon name={"globe"} size={19} color={"#888888"} />
                </View>
                <View style={{
                    flex: 4, justifyContent: 'space-evenly',
                }}>
                    <Text style={styles.contentTitle}>Timezone</Text>
                    <Text style={styles.contentSubTitle}>{props.timezone}</Text>
                </View>
            </TouchableOpacity>
        </View>
        {props.isConnected ? <Text></Text> :
            <View style={styles.NetworkContainter}>
                <Text style={styles.NetworkMessage}>No Internet Connection</Text>
            </View>}
        <Animated.View
            style={[{ transform: [{ translateY: props.animatedValue }] }, styles.SnackBarContainter]}>
            <Text numberOfLines={1} style={styles.SnackBarMessage}>{props.SnackBarInsideMsgHolder}</Text>
            {/* <Text style={styles.SnackBarOkText} onPress={props.SnackBarCloseFunction} > OK </Text> */}
        </Animated.View>
    </View>
);

class BusinessContainerScreen extends React.Component {
    constructor() {
        super();
        this.animatedValue = new Animated.Value(50);
        this.ShowSnackBar = false;
        this.HideSnackBar = true;
        this.state = {
            SnackBarInsideMsgHolder: '',
            index: 0,
            routes: [
                { key: 'first', title: 'SERVICES' },
                { key: 'second', title: 'EMPLOYEES' },
                { key: 'third', title: 'SETTINGS' },
            ],
            isConnected: false,
            businessName: '',
            searchBarService: "",
            ShowSnackBar: false,
            HideSnackBar: true,
            searchBarEmployee: "",
            employees: {},
            business: [],
            services: {},
            openingDays: null,
            hours: moment.weekdays().reduce(function (acc, cv, ci) {
                if (cv === 'Saturday' || cv === 'Sunday') {
                    acc[cv] = {
                        startTime: "08:00:00",
                        endTime: "17:00:00",
                        open: false,
                        startTimeFocused: false,
                        endTimeFocused: false,
                    };
                } else {
                    acc[cv] = {
                        startTime: "08:00:00",
                        endTime: "17:00:00",
                        open: true,
                        startTimeFocused: false,
                        endTimeFocused: false,
                    };
                }
                return acc;
            }, {}),
        }
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Business',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 17,
                width: '100%',
                color: '#555555'
            },
            headerLeft: <View style={{
                flex: 1,
                width: '100%',
                marginLeft: 20,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}><Icon name="bars" type={"solid"} size={20} style={{ padding: 30 }} color={"#888888"}
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /></View>,
            headerStyle: {
                elevation: 5,
                shadowColor: 'black',
                shadowOffset: { height: -5 },
                shadowOpacity: 0.16,
                shadowRadius: 5,
            }
        }
    };

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <FirstRoute services={this.state.services} animatedValue={this.animatedValue} isConnected={this.state.isConnected}
                    searchBar={this.state.searchBarService} navigation={this.props.navigation} CapitalizeService={this.CapitalizeService}
                    onAddService={this.onAddService} SnackBarCloseFunction={this.SnackBarCloseFunction}
                    SnackBarInsideMsgHolder={this.state.SnackBarInsideMsgHolder} onChangeService={this.onChangeService}
                />;
            case 'second':
                return <SecondRoute employees={this.state.employees} searchBar={this.state.searchBarEmployee} isConnected={this.state.isConnected}
                    navigation={this.props.navigation} deleteEmpId={this.deleteEmpId} CapitalizeEmployee={this.CapitalizeEmployee}
                    onAddEmployee={this.onAddEmployee} onChangeEmployee={this.onChangeEmployee}
                    SnackBarCloseFunction={this.SnackBarCloseFunction} animatedValue={this.animatedValue}
                    SnackBarInsideMsgHolder={this.state.SnackBarInsideMsgHolder} />;
            case 'third':
                return <ThirdRoute name={this.props.name} timezone={this.props.timezone} navigation={this.props.navigation}
                    opening_hours={this.state.opening_hours} onChangeOpeningHours={this.onChangeOpeningHours} isConnected={this.state.isConnected}
                    status="update" openingDays={this.state.openingDays} SnackBarCloseFunction={this.SnackBarCloseFunction} animatedValue={this.animatedValue}
                    SnackBarInsideMsgHolder={this.state.SnackBarInsideMsgHolder} />;
            default:
                return null;
        }
    };

    CapitalizeService = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    CapitalizeEmployee = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    ShowSnackBarFunction(SnackBarInsideMsgHolder, duration = 1000) {
        if (this.ShowSnackBar === false) {
            this.setState({ SnackBarInsideMsgHolder: SnackBarInsideMsgHolder });

            this.ShowSnackBar = true;

            Animated.timing(
                this.animatedValue,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start(this.hide(duration));
        }
    }

    hide = (duration) => {
        this.timerID = setTimeout(() => {
            if (this.HideSnackBar === true) {
                this.HideSnackBar = false;

                Animated.timing(
                    this.animatedValue,
                    {
                        toValue: 50,
                        duration: 200
                    }
                ).start(() => {
                    this.HideSnackBar = true;
                    this.ShowSnackBar = false;
                    clearTimeout(this.timerID);
                })
            }
        }, 10000);
    }

    SnackBarCloseFunction = () => {
        if (this.HideSnackBar === true) {
            this.HideSnackBar = false;
            clearTimeout(this.timerID);

            Animated.timing(
                this.animatedValue,
                {
                    toValue: 50,
                    duration: 200
                }
            ).start(() => {
                this.ShowSnackBar = false;
                this.HideSnackBar = true;
            });
        }
    }

    onAddService = (name, serviceColor, serviceDuration, servicePrice) => {
        let data = {
            name: name,
            color: serviceColor,
            duration: serviceDuration,
            price: servicePrice,
        };
        this.setState({ searchBarService: "" })
        this.props.createNewService(this.state.businessName, data)

    }
    onAddEmployee = (name, phone) => {
        let data = {
            nickname: name,
            phone: phone
        }
        this.setState({ searchBarEmployee: "" })
        this.props.createNewEmployee(this.state.businessName, data)

    };
    deleteEmpId = (employee_user_id) => {
        this.props.deleteSingleEmployee(this.state.businessName, employee_user_id)
    }

    onChangeService = (text) => {
        let filteredServiceData = Object.values(this.state.services).map(service => {
            let regExp = new RegExp(text, 'gi');
            if (regExp.test(service.name)) {
                service.isVisible = true;
            } else {
                service.isVisible = false;
            }
            return service;
        }
        );
        this.setState({ services: filteredServiceData, searchBarService: text });
    };

    onChangeEmployee = (text) => {
        let filteredEmployeeData = Object.values(this.state.employees).map(employee => {
            let regExp = new RegExp(text, 'gi');
            if (employee.user.first_name === null) {
                if (regExp.test(employee.nickname)) {
                    employee.isVisible = true;
                } else {
                    employee.isVisible = false;
                }
            } else {
                if (regExp.test(employee.user.first_name)) {
                    employee.isVisible = true;
                } else {
                    employee.isVisible = false;
                }
            }
            return employee;
        }
        );
        this.setState({ employees: filteredEmployeeData, searchBarEmployee: text });
    };
    onChangeOpeningHours = (data) => {

        const changeData = Object.keys(data).reduce((acc, cv, ci) => {
            if (data[cv].is_open) {
                acc[cv] = {
                    is_open: data[cv].is_open,
                    open: data[cv].open,
                    close: data[cv].close,
                };
            } else {
                acc[cv] = {
                    is_open: data[cv].is_open
                };
            }
            return acc;
        }, {});
        var changeOpeningHrs = mapDaysToNumbers(changeData)
        this.props.settingOpeningHoursAction(this.state.businessName, changeOpeningHrs)
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    };

    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        const businessName = await AsyncStorage.getItem('businessName');

        this.initialSetup(this.props.employees, this.props.services)
        business_opening_hours = mapNumbersToDays(this.props.opening_hours)

        var openingDays = this.calculateDays(business_opening_hours);

        Object.values(business_opening_hours).map(data => {
            data.startTimeFocused = false,
                data.endTimeFocused = false
            if (data.is_open === false) {
                data.open = "08:00:00",
                    data.close = "17:00:00"
            }
        })

        this.setState({
            businessName: businessName,
            openingDays: openingDays,
            opening_hours: business_opening_hours
        })
    }


    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    async componentWillReceiveProps(nextProps) {
        const businessName = await AsyncStorage.getItem('businessName');

        this.initialSetup(nextProps.employees, nextProps.services)
        business_opening_hours = mapNumbersToDays(this.props.opening_hours)

        var openingDays = this.calculateDays(business_opening_hours);

        Object.values(business_opening_hours).map(data => {
            data.startTimeFocused = false,
                data.endTimeFocused = false
            if (data.is_open === false) {
                data.open = "08:00:00",
                    data.close = "17:00:00"
            }
        })
        this.setState({
            businessName: businessName,
            openingDays: openingDays,
            opening_hours: business_opening_hours
        })
        if (nextProps.createSError === true) {
            this.ShowSnackBarFunction("Error While Creating Service")
        }
        else if (nextProps.pendingService === false) {
            this.ShowSnackBarFunction("Service Added Successfully")
        }
        else if (nextProps.pendingService === true) {
            this.ShowSnackBarFunction("Service Added Successfully")
        }
        this.props.defaultnullService();

        if (nextProps.createEError === true) {
            this.ShowSnackBarFunction("Invalid Employee Phone Number")
        }
        else if (nextProps.pendingEmployee === false) {
            this.ShowSnackBarFunction("Employee Added Successfully")
        }
        else if (nextProps.pendingEmployee === true) {
            this.ShowSnackBarFunction("Employee Added Successfully")
        }
        else if (nextProps.deleteEError === false) {
            this.ShowSnackBarFunction("Employee Deleted Successfully")
        }
        this.props.defaultnullEmployee();

        if (nextProps.pendingOpeningHours === true) {
            this.ShowSnackBarFunction("Updated Opening-Hours Successfully")
        }
        else if (nextProps.changeHoursError === true) {
            this.ShowSnackBarFunction("Error While Update OpeningHours")
        }
        this.props.defaultnullOpeningHours();

    }

    initialSetup(employees, services) {
        Object.values(employees).map(data => {
            data.isVisible = true;
        });
        Object.values(services).map((ser) => {
            ser.isVisible = true
        });

        this.setState({
            employees: employees,
            services: services
        })
    }
    calculateDays(settings) {
        let array = Object.keys(settings).map(key => {
            if (settings[key].is_open)
                return key;
            else
                return "";
        });
        array = array.filter(a => a.length > 0);
        return array.join(", ");
    }
    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={this.renderScene}
                style={styles.tabBarStyle}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        style={styles.tabBarStyle}
                        indicatorStyle={{ backgroundColor: '#287F7E' }}
                        renderLabel={({ route, focused, color }) => {
                            if (route.title === 'SETTINGS')
                                return <Icon name="cog" type={"light"} size={21}
                                    color={focused ? '#287F7E' : "#555555"} />;
                            return <Text style={{
                                fontFamily: 'open-sans-hebrew-bold',
                                letterSpacing: 1,
                                fontSize: 12,
                                color: focused ? '#287F7E' : '#888888',
                                margin: 8
                            }}>
                                {route.title}
                            </Text>
                        }}
                    />
                }
            />
        );
    }
}
const mapStateToProps = (state) => (
    {
        employees: state.getBusinessByAliases.employees,
        pendingEmployee: state.getBusinessByAliases.pendingEmployee,
        createEError: state.getBusinessByAliases.createEError,
        deleteEError: state.getBusinessByAliases.deleteEError,
        defaultnullEmployee: state.getBusinessByAliases.defaultnullEmployee,

        services: state.getBusinessByAliases.services,
        pendingService: state.getBusinessByAliases.pendingService,
        createSError: state.getBusinessByAliases.createSError,
        defaultnullService: state.getBusinessByAliases.defaultnullService,

        timezone: state.getBusinessByAliases.timezone,
        opening_hours: state.getBusinessByAliases.opening_hours,
        changeHoursError: state.getBusinessByAliases.changeHoursError,
        pendingOpeningHours: state.getBusinessByAliases.pendingOpeningHours,
        defaultnullOpeningHours: state.getBusinessByAliases.defaultnullOpeningHours,

        name: state.getBusinessByAliases.businessName,
    });
const mapDispatchToProps = (dispatch) => (

    bindActionCreators({
        createNewEmployee, createNewService, deleteSingleEmployee, settingOpeningHoursAction,
        defaultnullService, defaultnullEmployee, defaultnullOpeningHours,

    }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(BusinessContainerScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scene: {
        flex: 1,
    },
    tabBarStyle: {
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { height: -5 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
    },
    rowStyle1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingLeft: 20
    },
    mainIconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 18,
        height: 21
    },
    centerTextContainer: {
        flex: 6,
        justifyContent: 'center',
        paddingLeft: 5
    },
    searchStyle: {
        paddingTop: 20,
        paddingLeft: 11,
        paddingRight: 11
    },

    rowStyle2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    textStyle2: { fontFamily: 'Roboto', fontSize: 16, color: 'rgba(0,0,0,0.87)' },
    textStyle3: { fontFamily: 'Roboto', fontSize: 14, color: 'rgba(0,0,0,0.54)' },
    textStyle4: { fontFamily: 'Roboto', fontSize: 16, color: '#287F7E' },

    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#287F7E'
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: 'open-sans-hebrew',
        color: '#000000',
        paddingBottom: 5,

    },
    contentSubTitle: {
        fontSize: 14,
        fontFamily: 'open-sans-hebrew',
        color: 'rgba(0,0,0,0.50)',
        paddingRight: 5
    },
    titleStyle: {
        color: '#287F7E',
        fontSize: 14,
        fontFamily: 'open-sans-hebrew-bold'
    },
    employeeMapContainer: {
        paddingBottom: 20
    },
    SnackBarContainter:
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
    SnackBarMessage:
    {
        color: '#fff',
        fontSize: 14
    },
    SnackBarOkText: {
        color: '#FFEB3B',
        fontSize: 18,
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        padding: 20

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