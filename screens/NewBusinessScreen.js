import React, { Component } from 'react';
import {
    NetInfo,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    AsyncStorage
} from 'react-native';
import Layout from './../constants/Layout';
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import { Button, CheckBox, Radio, StyleProvider } from "native-base";
import { Button as EleButton } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Icon from "react-native-fontawesome-pro";
import moment from 'moment';
import * as Localization from 'expo-localization';
import { mapDaysToNumbers } from "../shared/Utils";
import { createBusiness } from "../axios/api";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createNewBusiness } from '../actions/CreateBusinessAction';
import { getAllBusinesses } from '../actions/GetBusinessesAction';
import { ChannelConnection } from "../channel";



class NewBusinessScreen extends Component {
    static navigationOptions = {
        title: 'New Business',
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

    };
    state = {
        isConnected: false,
        userProfile: "",
        business_name: '',
        business_type: '',
        isBusinessNameFocused: false,
        isBusinessTypeFocused: false,
        stepNo: 1,
        businessSelectModalVisible: false,
        business_types: [
            { name: 'Hair Salon', icon: 'cut' },
            { name: 'Beauty Salons', icon: 'eye' },
            { name: 'Personal Trainer', icon: 'dumbbell' },
            { name: 'Dentist', icon: 'tooth' },
            { name: 'Tutor Lesson', icon: 'book' }
        ],
        isSelfEmployee: false,
        employees: [],
        services: [],
        hours: moment.weekdays().reduce(function (acc, cv, ci) {
            if (cv === 'Saturday' || cv === 'Sunday') {
                acc[cv] = {
                    open: "08:00:00",
                    close: "17:00:00",
                    is_open: false,
                    startTimeFocused: false,
                    endTimeFocused: false,
                };
            } else {
                acc[cv] = {
                    open: "08:00:00",
                    close: "17:00:00",
                    is_open: true,
                    startTimeFocused: false,
                    endTimeFocused: false,
                };
            }
            return acc;
        }, {}),
    };

    onChangeHandle = (field, value) => {
        this.setState({
            [field]: value
        });
    };
    onFocusChange = (field) => {
        this.setState({ [field]: true });
    };

    onBlurChange = (field) => {
        this.setState({ [field]: false });
    };


    componentWillMount() {
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    toggleSelectModal = () => {
        this.setState((prevState => {
            return { ...prevState, businessSelectModalVisible: !prevState.businessSelectModalVisible }
        }));
    };

    onAddEmployee = (employeeName, phone) => {
        this.setState((prevState) => {
            const employees = [...prevState.employees];
            employees.push({ name: employeeName, phone });
            return {
                ...prevState,
                employees,
            };
        });
    };

    onDeleteEmployee = (phone) => {
        this.setState((prevState) => {
            const employees = prevState.employees.filter(e => e.phone !== phone);
            return { ...prevState, employees };
        });
    };

    onAddService = (name, serviceColor, serviceDuration, servicePrice) => {
        this.setState((prevState) => {
            const services = [...prevState.services];
            services.push({
                name: name,
                duration: serviceDuration,
                price: servicePrice,
                color: serviceColor
            });
            return {
                ...prevState,
                services
            };

        });
    };

    onDeleteService = (name) => {
        this.setState((prevState) => {
            const services = prevState.services.filter(e => e.name !== name);
            return { ...prevState, services };
        });
    };

    updatedOpeningHours = (updatedOpenHours) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                hours: updatedOpenHours
            }
        });
    };

    getEmployeesNames = () => {
        let output = "";
        const { employees } = this.state;
        if (this.state.isSelfEmployee) {
            output += "You";
            if (employees.length > 0) {
                output += ", ";
            }
            if (employees.length > 2) {
                output += employees[0].name + ", ";
                output += employees[1].name + " and ";
                output += `${employees.length - 2} more`;
            }
            if (employees.length === 2) {
                output += employees[0].name + " and ";
                output += employees[1].name;
            }
            if (employees.length === 1) {
                output += employees[0].name;
            }
        } else {
            if (employees.length > 3) {
                output += employees[0].name + ", ";
                output += employees[1].name + ", ";
                output += employees[2].name + " and ";
                output += `${employees.length - 2} more`;
            }
            if (employees.length === 3) {
                output += employees[0].name + ", ";
                output += employees[1].name + " and ";
                output += employees[2].name;
            }
            if (employees.length === 2) {
                output += employees[0].name + " and ";
                output += employees[1].name;
            }
            if (employees.length === 1) {
                output += employees[0].name;
            }
        }
        return output;
    };

    getServicesNames = () => {
        let output = "";
        const { services } = this.state;
        if (services.length > 3) {
            output += services[0].name + ", ";
            output += services[1].name + ", ";
            output += services[2].name + " and ";
            output += `${services.length - 2} more`;
        }
        if (services.length === 3) {
            output += services[0].name + ", ";
            output += services[1].name + " and ";
            output += services[2].name;
        }
        if (services.length === 2) {
            output += services[0].name + " and ";
            output += services[1].name;
        }
        if (services.length === 1) {
            output += services[0].name;
        }
        return output;
    };

    createBusiness = () => {
        const openingHours = Object.keys(this.state.hours).reduce((acc, cv, ci) => {
            if (this.state.hours[cv].is_open) {
                acc[cv] = {
                    is_open: this.state.hours[cv].is_open,
                    open: this.state.hours[cv].open,
                    close: this.state.hours[cv].close,
                };
            } else {
                acc[cv] = {
                    is_open: this.state.hours[cv].is_open
                };
            }
            return acc;
        }, {});
        const data = {
            "name": this.state.business_name,
            "type": this.state.business_type,
            "timezone": Localization.timezone,
            "set_creator_as_employee": this.state.isSelfEmployee,
            "employees": this.state.employees.map(e => ({ nickname: e.name, phone: e.phone })),
            "services": this.state.services.map(s => ({
                name: s.name,
                duration: parseInt(s.duration), price: parseInt(s.price), color: s.color
            })),
            "opening_hours": mapDaysToNumbers(openingHours)
        };
        console.log("OENINGHOURSDat", data)

        this.props.createNewBusiness(data)
        this.props.navigation.navigate('Calendar');

    };

    renderModalContent = () => (
        <View style={[styles.content, { justifyContent: 'space-between' }]}>
            <View style={{
                flex: 1, height: 65, width: '100%', backgroundColor: '#fff', ...Platform.select({
                    ios: {
                        shadowColor: 'black',
                        shadowOffset: { height: -5 },
                        shadowOpacity: 0.16,
                        shadowRadius: 5,
                    },
                    android: {
                        elevation: 5,
                    }
                })
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 24 }}>
                    <Text style={styles.textStyle8}>Business Types</Text>
                </View>
            </View>
            {this.state.business_types.map(type => (
                <View key={type.name} style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Icon name={type.icon} type={"solid"} size={20} color={"#888888"} />
                    </View>
                    <View style={{
                        flex: 3, justifyContent: 'space-evenly',
                    }}>
                        <Text style={styles.contentTitle}>{type.name}</Text>
                    </View>
                    <View style={{
                        flex: 1, alignItems: 'center',
                        paddingRight: 7,
                    }}>
                        <Radio
                            hitSlop={{ top: 15, left: 300, bottom: 15, right: 40 }}
                            pressRetentionOffset={{ top: 15, left: 300, bottom: 15, right: 40 }}
                            selected={this.state.business_type === type.name} selectedColor={"#287F7E"}
                            onPress={() => this.setState({
                                business_type: type.name,
                                businessSelectModalVisible: false
                            })} />
                    </View>
                </View>
            ))}
        </View>
    );
    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        this.props.getAllBusinesses();
        var data = await AsyncStorage.multiGet(['session'])
        var userData = data[0][1];
        this.setState({ userProfile: JSON.parse(userData) })

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
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 460 : 540;
        const bottomRowHeight = Layout.isSmallDevice ? 60 : 80;
        const iconStyle = {
            position: 'absolute',
            right: 0,
            top: 18,
        };

        const { business_name, business_type, business_types, stepNo, isSelfEmployee, employees, services, hours } = this.state;

        return (<View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ height: topRowHeight, flex: 0 }}>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.textInput, (this.state.isBusinessNameFocused) ? {
                                borderBottomColor: '#287F7E',
                            } : { borderBottomColor: '#CCCCCC' }]}
                            placeholder={"Business Name"}
                            onFocus={() => this.onFocusChange("isBusinessNameFocused")}
                            onBlur={() => this.onBlurChange("isBusinessNameFocused")}
                            onChangeText={(text) => this.onChangeHandle("business_name", text)}
                        />
                    </View>
                </View>
            </View>
            <View style={{
                height: middleRowHeight,
                width: '100%',
                flex: 1,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <Modal
                    isVisible={this.state.businessSelectModalVisible}
                    animationIn={"fadeIn"}
                    animationOut={"fadeOut"}
                    animationInTiming={100}
                    animationOutTiming={10}
                    backdropTransitionInTiming={100}
                    backdropTransitionOutTiming={10}
                    hideModalContentWhileAnimating
                    onSwipeComplete={() => this.toggleSelectModal()}
                    onBackdropPress={() => this.toggleSelectModal()}
                    onBackButtonPress={() => this.toggleSelectModal()}
                    backdropColor={'#292929'}
                    backdropOpacity={0.4}
                    swipeDirection={['up', 'down']}
                >
                    {this.renderModalContent()}
                </Modal>
                <ScrollView contentInset={{ top: 0, left: 0, bottom: 0, right: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        {stepNo === 1 ? <View style={{ height: 45 }}>
                            <TouchableWithoutFeedback onPress={() => this.toggleSelectModal()}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.textInput1, (this.state.isBusinessTypeFocused) ? {
                                            borderBottomColor: '#287F7E',
                                        } : { borderBottomColor: '#888888' }]}
                                        onFocus={() => this.onFocusChange("isBusinessTypeFocused")}
                                        onBlur={() => this.onBlurChange("isBusinessTypeFocused")}
                                        editable={false}
                                        placeholder={"Business Type"}
                                        value={this.state.business_type}
                                    />
                                    <TouchableWithoutFeedback
                                        hitSlop={{ top: 40, left: 300, bottom: 40, right: 40 }}
                                        pressRetentionOffset={{ top: 40, left: 300, bottom: 40, right: 40 }}
                                        style={[iconStyle, { width: '100%', height: '100%' }]}
                                        onPress={() => this.toggleSelectModal()}>
                                        <FontAwesome
                                            name='chevron-down'
                                            color='rgba(0,0,0,0.38)'
                                            size={16}
                                            style={[iconStyle]}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </View> : (stepNo < 1 ? null : <View style={{ height: 88 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                width: '100%',
                                height: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Icon name={business_types.find(k => k.name === business_type).icon} type={"solid"}
                                        size={19} color={"rgba(136, 136, 136, 0.4)"} />
                                </View>
                                <View style={{ flex: 5 }}>
                                    <Text style={styles.textStyle2}>Business Type</Text>
                                    <Text style={styles.textStyle3}>{business_type}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                </View>
                            </View>
                        </View>)}
                        {stepNo === 2 ? <View style={{ minHeight: 140 }}>
                            <View style={styles.rowStyle1}>
                                <Text style={styles.textStyle1}>Employees</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.rowStyle1, {
                                    width: '100%',
                                    height: 100,
                                }]}
                                onPress={() => this.setState((prevState => {
                                    return { ...prevState, isSelfEmployee: !prevState.isSelfEmployee }
                                }))}>
                                <View style={[styles.mainIconContainer]}>
                                    <CheckBox color={"#287F7E"} checked={isSelfEmployee}
                                        style={{ borderRadius: 2, left: 0 }}
                                        onPress={() => this.setState((prevState => {
                                            return { ...prevState, isSelfEmployee: !prevState.isSelfEmployee }
                                        }))} />
                                </View>
                                <View style={styles.centerTextContainer}>
                                    <Text style={styles.textStyle2}>{this.state.userProfile.first_name} {this.state.userProfile.last_name}</Text>
                                    <Text style={[styles.textStyle3, { marginTop: 2 }]}>Tap here in order to set yourself
                                        as
                                        an employee</Text>
                                </View>
                                <View style={styles.endIconContainer}>
                                </View>
                            </TouchableOpacity>

                            {employees.map(employee => (
                                <View key={employee.phone} style={[styles.rowStyle2, {
                                    width: '100%',
                                    height: 88,
                                }]}><View style={[styles.mainIconContainer]}>
                                        <Icon name={"user"} type={"solid"} size={19} color={"rgba(136,136,136,0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle2}>{employee.name}</Text>
                                        <Text style={[styles.textStyle3, { marginTop: 2 }]}>{employee.phone}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.endIconContainer}
                                        onPress={() => this.onDeleteEmployee(employee.phone)}>
                                        <Icon name={"trash"} type={"solid"} size={15} color={"#888888"} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity style={[styles.rowStyle1, {
                                width: '100%',
                                minHeight: 30,
                            }]} onPress={() => this.props.navigation.navigate('AddEmployee', {
                                addEmployeeCallback: this.onAddEmployee,
                                employees
                            })}
                            >
                                <View style={[styles.mainIconContainer]}>
                                    <Icon name={"plus"} type={"solid"} size={19} color={"#287F7E"} />
                                </View>
                                <View style={styles.centerTextContainer}>
                                    <Text style={styles.textStyle4}>Add Employee</Text>
                                </View>
                                <View style={styles.endIconContainer}>
                                </View>
                            </TouchableOpacity>
                        </View> : (stepNo < 2 ? null : <View style={{ height: 88 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                width: '100%',
                                height: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Icon name={"user"} type={"solid"}
                                        size={19} color={"rgba(136, 136, 136, 0.4)"} />
                                </View>
                                <View style={{ flex: 5 }}>
                                    <Text style={styles.textStyle2}>Employees</Text>
                                    <Text style={styles.textStyle3}>{this.getEmployeesNames()}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                </View>
                            </View>
                        </View>)}
                        {stepNo === 3 ? <View style={{ minHeight: 80 }}>
                            <View style={styles.rowStyle1}>
                                <Text style={styles.textStyle1}>Services</Text>
                            </View>
                            {services.map(service => (
                                <View key={service.name} style={[styles.rowStyle2, {
                                    width: '100%',
                                    height: 88,
                                }]}><View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                        <EleButton title={""}
                                            buttonStyle={{
                                                backgroundColor: service.color,
                                                width: 18,
                                                height: 18,
                                                borderRadius: 18 / 3
                                            }} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle2}>{service.name}</Text>
                                        <Text
                                            style={[styles.textStyle3, { marginTop: 2 }]}>{service.duration} minutes, {service.price}₪</Text>
                                    </View>
                                    <TouchableOpacity style={styles.endIconContainer}
                                        onPress={() => this.onDeleteService(service.name)}>
                                        <Icon name={"trash"} type={"solid"} size={15} color={"#888888"} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity style={[styles.rowStyle1, {
                                width: '100%',
                                minHeight: 30,
                            }]} onPress={() => this.props.navigation.navigate('AddService', {
                                addServiceCallback: this.onAddService,
                                services
                            })}
                            >
                                <View style={[styles.mainIconContainer]}>
                                    <Icon name={"plus"} type={"solid"} size={19} color={"#287F7E"} />
                                </View>
                                <View style={styles.centerTextContainer}>
                                    <Text style={styles.textStyle4}>Add Service</Text>
                                </View>
                                <View style={styles.endIconContainer}>
                                </View>
                            </TouchableOpacity>
                        </View> : (stepNo < 3 ? null : <View style={{ height: 88 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                width: '100%',
                                height: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Icon name={"luggage-cart"} type={"solid"}
                                        size={19} color={"rgba(136, 136, 136, 0.4)"} />
                                </View>
                                <View style={{ flex: 5 }}>
                                    <Text style={styles.textStyle2}>Services</Text>
                                    <Text style={styles.textStyle3}>{this.getServicesNames()}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                </View>
                            </View>
                        </View>)}
                        {stepNo === 4 ? <View style={{ minHeight: 160 }}>
                            <View style={[styles.rowStyle1, { marginBottom: 20 }]}>
                                <Text style={styles.textStyle1}>Opening Hours</Text>
                            </View>
                            {Object.keys(hours).map(day => (
                                <View key={day} style={[styles.rowStyle2, {
                                    width: '100%',
                                    height: 20,
                                }]}>
                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text
                                            style={[styles.textStyle7, { textAlign: 'left' }]}>{day.substring(0, 3)}</Text>
                                    </View>
                                    <View style={{ flex: 5, justifyContent: 'center' }}>
                                        {hours[day].is_open ? <Text
                                            style={[styles.textStyle3]}>
                                            {`${hours[day]['open']} - ${hours[day]['close']}`}
                                        </Text> : <Text
                                            style={{
                                                fontFamily: 'open-sans-hebrew-italic',
                                                fontSize: 14,
                                                color: '#999999'
                                            }}>
                                                {`Closed`}
                                            </Text>}
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity style={[styles.rowStyle1, {
                                width: '100%',
                                minHeight: 30,
                                marginTop: 10
                            }]} onPress={() => this.props.navigation.navigate('OpeningHours', {
                                opening_hours: JSON.stringify(hours),
                                updatedOpeningHours: this.updatedOpeningHours
                            })}
                            >
                                <View style={[styles.mainIconContainer]}>
                                    <Icon name={"pencil"} type={"solid"} size={19} color={"#287F7E"} />
                                </View>
                                <TouchableOpacity style={styles.centerTextContainer}
                                    onPress={() => this.props.navigation.navigate('OpeningHours', {
                                        opening_hours: JSON.stringify(hours),
                                        status: "create",
                                        updatedOpeningHours: this.updatedOpeningHours
                                    })}>
                                    <Text style={styles.textStyle4}>Modify Opening Hours</Text>
                                </TouchableOpacity>
                                <View style={styles.endIconContainer}>
                                </View>
                            </TouchableOpacity>
                        </View> : (stepNo < 4 ? null : <View style={{ height: 88, backgroundColor: '#0000ff' }}></View>)}
                    </View>
                </ScrollView>
            </View>
            <View style={{ height: bottomRowHeight, borderTopWidth: 1, borderTopColor: '#CCCCCC' }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    paddingRight: 20
                }}>
                    {((services.length === 0 && stepNo === 3) || (employees.length === 0 && stepNo === 2 && !isSelfEmployee)) ?
                        <TouchableOpacity style={{ flex: 4, alignItems: 'flex-end', marginRight: 40 }}
                            hitSlop={{ top: 40, left: 40, bottom: 40, right: 40 }}
                            pressRetentionOffset={{ top: 40, left: 40, bottom: 40, right: 40 }}
                            onPress={() => this.setState((prevState => {
                                return { ...prevState, stepNo: prevState.stepNo + 1 }
                            }))}>
                            <Text style={styles.textStyle6}>Skip</Text>
                        </TouchableOpacity> : <View style={{ flex: 4 }}></View>}
                    <View style={{ flex: 2, alignSelf: 'center' }}>
                        {(stepNo < 4) ? <StyleProvider style={getTheme(material)}>
                            <Button
                                style={{
                                    elevation: 0, shadowColor: null,
                                    shadowOffset: null,
                                    shadowRadius: null,
                                    shadowOpacity: null,
                                }}
                                disabled={(services.length === 0 && stepNo === 3) || (employees.length === 0 && stepNo === 2 && !isSelfEmployee) || (business_type.length === 0 && stepNo === 1)}
                                block
                                success={!((services.length === 0 && stepNo === 3) || (employees.length === 0 && stepNo === 2 && !isSelfEmployee) || (business_type.length === 0 && stepNo === 1))}
                                onPress={() => this.setState((prevState => {
                                    return { ...prevState, stepNo: prevState.stepNo + 1 }
                                }))}>
                                <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Next</Text>
                            </Button>
                        </StyleProvider> :
                            <StyleProvider style={getTheme(material)}>
                                <Button
                                    style={{
                                        elevation: 0, shadowColor: null,
                                        shadowOffset: null,
                                        shadowRadius: null,
                                        shadowOpacity: null,
                                    }}
                                    disabled={business_name.length < 3}
                                    block
                                    success={!(business_name.length < 3)}
                                    onPress={() => this.createBusiness()}>
                                    <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Create</Text>
                                </Button>
                            </StyleProvider>}
                    </View>
                </View>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>

        </View>)
    }
}

const mapStateToProps = (state) => ({
    // transactionId: state.CreateBusinessReducer,
    // error: state.createBError
});
const mapDispatchToProps = (dispatch) => (

    bindActionCreators({ createNewBusiness, getAllBusinesses }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(NewBusinessScreen)



const styles = StyleSheet.create({
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    rowStyle2: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    mainIconContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    endIconContainer: { flex: 1, justifyContent: 'center' },
    centerTextContainer: { flex: 6, justifyContent: 'center', paddingLeft: 5 },
    textInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew',
        fontSize: 25,
        height: 45,
        paddingLeft: 23,
        paddingBottom: 10,
    },
    textInput1: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16,
        height: 30
    },
    inputContainer: {
        paddingTop: 16
    },
    textStyle1: { fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' },
    textStyle7: { fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: 'rgba(0,0,0,0.54)' },
    textStyle6: { fontFamily: 'open-sans-hebrew-bold', fontSize: 13, color: '#287F7E' },
    textStyle4: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#287F7E' },
    textStyle5: { fontFamily: 'open-sans-hebrew', fontSize: 20, color: '#555555' },
    textStyle2: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: 'rgba(0,0,0,0.87)' },
    textStyle8: { fontFamily: 'open-sans-hebrew', fontSize: 20, color: '#000' },
    textStyle3: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    },
    content: {
        backgroundColor: 'white',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        minHeight: 350
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: 'open-sans-hebrew-light',
        color: 'rgba(0,0,0,0.87)'
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    employeeContent: {
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        minHeight: Layout.window.height - 160
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
