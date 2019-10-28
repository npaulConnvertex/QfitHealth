import React from 'react';
import { Image, Platform, NetInfo, ScrollView, StyleSheet, Text, AsyncStorage, TouchableWithoutFeedback, View, Alert } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import Layout from "../constants/Layout";
import { Button, Radio, StyleProvider } from "native-base";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import { Button as EleButton } from "react-native-elements";
import Modal from "react-native-modal";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { createNewAppointment } from "../actions/CreateAppointmentAction";
import { mapNumbersToDays } from "../shared/Utils";

class NewAppointmentScreen extends React.Component {
    static navigationOptions = {
        title: 'New Appointment',
        headerTitleStyle: {
            fontFamily: 'open-sans-hebrew',
            fontSize: 20,
            width: '100%',
            color: '#555555'
        },
        businessName: '',
        headerBackImage: <Icon name="chevron-left" type={"solid"} size={19} style={{ padding: 20 }}
            color={"#CCCCCC"} />,
        headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
            },
        },
    };

    state = {
        isConnected: false,
        serviceName: "",
        serviceDuration: '',
        services: [],
        serviceSelectModalVisible: false,
        employeeModalVisible: false,
        customerModalVisible: false,

        employeeName: "",
        employees: {},
        services_id: null,
        dateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        employee_id: null,
        customer_id: null,
        colorname: '',
        customers: {},
        customerName: '',
        Date: ""
    };
    async componentWillMount() {
        const businessName = await AsyncStorage.getItem('businessName');
        this.setState({
            businessName: businessName
        })
    }



    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        if (this.props.navigation.getParam('name') || this.props.navigation.getParam('service_id_props') ||
            this.props.navigation.getParam('Color') || this.props.navigation.getParam('duration')) {
            this.setState({
                serviceName: this.props.navigation.getParam('name'),
                colorname: this.props.navigation.getParam('Color'),
                services_id: this.props.navigation.getParam('service_id_props'),
                serviceDuration: this.props.navigation.getParam('duration'),
            })
        }
        if (this.props.navigation.getParam('emp')) {
            let availableEmp = this.props.navigation.getParam('emp');
            const availableEmpList = {};
            availableEmp.map((emp) => {
                availableEmpList[emp] = this.props.employees[emp]
            })
            this.setState({
                employees: availableEmpList
            })
        }
        else {
            Object.values(this.props.employees).map(data => {
                data.isVisible = true
            });
            this.setState({
                employees: this.props.employees
            })
        }
        // YYYY-MM-DD HH:mm:ss
        // format('hh:mm:ss') + ", " + moment(outeritem).format('DD/MM/YYYY')
        if (this.props.navigation.getParam('selectedDate')) {
            let selectedDate = this.props.navigation.getParam('selectedDate');
            this.setState({
                dateTime: moment(selectedDate, "HH:mm:ss, DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")
            })
        }


        // Object.values(this.props.employees).map(data => {
        //     data.isVisible = true
        // });
        Object.values(this.props.customers).map((ser) => {
            ser.isVisible = true
        });

        const openingHours = await mapNumbersToDays(this.props.openingHours);
        console.log("openingHours", openingHours)
        this.setState({
            services: this.props.services,
            customers: this.props.customers,
            openingHours: openingHours

        })
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

    onCreateAppointment = () => {
        var sDate = moment(this.state.dateTime).format("YYYY-MM-DD")
        //console.warn(moment(sDate).format("dddd"))
        var Time = moment(this.state.dateTime).format("HH:mm:ss")
        // console.log(moment(this.state.dateTime).format("HH:mm:ss"))
        // console.log("startTime", moment(this.state.dateTime).format("YYYY-MM-DD"))
        // var Time = moment(this.state.dateTime).format("HH:mm:ss")
        // console.log("Dateee", moment(this.state.dateTime).format("HH:mm:ss"))
        const durationInMinutes = this.state.serviceDuration;
        const endTime = moment(Time, 'HH:mm:ss').add(durationInMinutes, 'minutes').format('HH:mm:ss');

        var selectedDay = moment(sDate).format("dddd");
        var selectedDayObj = this.state.openingHours[selectedDay];
        console.log("check days", selectedDay, Time, durationInMinutes, selectedDayObj, selectedDayObj.is_open, selectedDayObj.close, selectedDayObj.open);



        // if (selectedDayObj.is_open === true) {
        //     var measureDuration = 0;
        //     var opentimearr = selectedDayObj.open.split(":");
        //     var closetimearr = selectedDayObj.close.split(":");
        //     var selectArr = Time.split(":");
        //     var openhr = parseInt(opentimearr[0])
        //     var openmin = parseInt(opentimearr[1])
        //     var closehr = parseInt(closetimearr[0])
        //     var closemin = parseInt(closetimearr[1])
        //     var selectHr = parseInt(selectArr[0])
        //     var selectMin = parseInt(selectArr[1]);


        //     measureDuration = selectMin === 0 ? (((closehr - selectHr) * 60) + closemin) : (((closehr - selectHr - 1) * 60) + (60 - selectMin) + closemin);

        //     console.warn("FOUND IT", openhr, openmin, closehr, closemin, measureDuration, selectHr, selectMin, selectedDayObj.open, selectedDayObj.close)


        //     if (durationInMinutes <= measureDuration && selectHr >= openhr && selectHr < closehr) {
        //         var data = {
        //             name: this.state.serviceName,
        //             service_id: this.state.services_id,
        //             start_time_utc: sDate + 'T' + Time + 'Z',
        //             end_time_utc: sDate + 'T' + endTime + 'Z',
        //             employee_id: this.state.employee_id,
        //             customer_id: this.state.customer_id,
        //             extra_data: {}
        //         };
        //         this.props.createNewAppointment(this.state.businessName, data);
        //         Alert.alert("Info", "Appointment Created Successfully");
        //         this.props.navigation.navigate('Calendar');

        //     }
        //     else {
        //         Alert.alert("Alert", "Your selected time does not fall between opening hours.")
        //     }
        // }
        // else {
        //     Alert.alert("Alert", "Business is close for this day.")
        // }
        // else {


        var data = {
            name: this.state.serviceName,
            service_id: this.state.services_id,
            start_time_utc: sDate + 'T' + Time + 'Z',
            end_time_utc: sDate + 'T' + endTime + 'Z',
            employee_id: this.state.employee_id,
            customer_id: this.state.customer_id,
            extra_data: {}
        };
        this.props.createNewAppointment(this.state.businessName, data);
        // Alert.alert("Info", "Appointment Created Successfully");
        this.props.navigation.navigate('Calendar');

    };

    toggleSelectModal = () => {
        this.setState((prevState => {
            return { ...prevState, serviceSelectModalVisible: !prevState.serviceSelectModalVisible }
        }));
    };

    toggleEmployeeModal = () => {
        this.setState((prevState => {
            return { ...prevState, employeeModalVisible: !prevState.employeeModalVisible }
        }));
    };

    toggleCustomerModal = () => {
        this.setState((prevState => {
            return { ...prevState, customerModalVisible: !prevState.customerModalVisible }

        }));
    };

    toggleEmployeeSelected = (id) => {
        this.setState((prevState) => {
            const employee_id = id
            const employeeName = Object.values(prevState.employees).map(emp => {
                if (emp.user.id === id) {
                    if (emp.user.first_name != null) {
                        return emp.user.first_name + " " + emp.user.last_name
                    } else {
                        return emp.nickname
                    }
                }
            })
            return {
                ...prevState,
                employeeName,
                employee_id,
                employeeModalVisible: false
            };
        });
    };

    toggleCustomerSelected = (id) => {
        this.setState((prevState) => {
            const customer_id = id
            const customerName = Object.values(prevState.customers).map(cust => {
                if (cust.user.id === id) {
                    if (cust.user.first_name != null) {
                        return cust.user.first_name + " " + cust.user.last_name
                    } else {
                        return cust.nickname
                    }
                }
            })
            return {
                ...prevState,
                customerName,
                customer_id,
                customerModalVisible: false
            };
        });
    };

    checkSameDay = (date) => {
        if (moment().isSame(date, 'day'))
            return true;
        return false;
    };

    renderModalContent = () => (
        <View style={[styles.content, { justifyContent: 'space-between' }]}>
            <View style={{
                flex: 0, height: 65, width: '100%', backgroundColor: '#fff', ...Platform.select({
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
                    <Text style={styles.textStyle8}>Select Services</Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>

                    {Object.values(this.state.services).map(service => (
                        <View key={service.id} style={{
                            flex: 1,
                            flexDirection: 'row',
                            width: '100%',
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 7,
                            padding: 5,
                            marginBottom: 9,

                        }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <EleButton title={""}
                                    buttonStyle={{
                                        //backgroundColor: service.color,
                                        backgroundColor: service.settings.color,
                                        width: 18,
                                        height: 18,
                                        borderRadius: 18 / 3
                                    }} />
                            </View>
                            <View style={{
                                flex: 3, justifyContent: 'space-evenly',
                            }}>
                                <Text style={styles.contentTitle}>{service.name}</Text>
                            </View>
                            <View style={{
                                flex: 1, alignItems: 'center',
                                paddingRight: 7,
                            }}>
                                <Radio
                                    hitSlop={{ top: 15, left: 300, bottom: 15, right: 40 }}
                                    pressRetentionOffset={{ top: 15, left: 300, bottom: 15, right: 40 }}
                                    selected={this.state.serviceName === service.name && this.state.colorname === service.settings.color}
                                    // selectedColor={this.state.color === service.settings.color}
                                    onPress={() => this.setState({
                                        serviceName: service.name,
                                        services_id: service.id,
                                        colorname: service.settings.color,
                                        serviceSelectModalVisible: false
                                    })} />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

        </View>
    );


    renderEmployeeModalContent = () => (
        <View style={{
            height: 440, backgroundColor: 'white',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'rgba(0, 0, 0, 0.1)',
        }}>
            <View style={{
                flex: 1, height: 70, width: '100%', backgroundColor: '#fff',
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 24 }}>
                    <Text style={styles.textStyle8}>Available Employees</Text>
                    {this.state.dateTime ? <Text style={styles.textStyle5}>{moment(this.state.dateTime, "YYYY-MM-DD HH:mm:ss").format("MMMM DD, HH:mm")}
                        {(this.checkSameDay(this.state.dateTime)) ? ' (Today)' : ''}</Text> : <Text></Text>}
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {Object.values(this.state.employees).filter(s => s.isVisible).map(employee => (
                        <TouchableWithoutFeedback key={employee.user.id}
                            onPress={() => this.toggleEmployeeSelected(employee.user.id)}><View
                                key={employee.user.id} style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    width: '100%',
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 9
                                }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <View
                                        style={[styles.circle, (this.state.employeeName === employee.nickname ? {} : { backgroundColor: "rgba(150, 0, 0, 0.26)" })]}>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            {this.state.employeeName === employee.nickname ? (
                                                <Icon name="check" type={"solid"} size={19}
                                                    color={"#fff"} />
                                            ) : (employee.user.image_id ? <Image source={{ uri: employee.user.image_id }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2,
                                                    backgroundColor: 'rgba(150, 0, 0, 0.26)'
                                                }}
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
                                </View>
                                <View style={{
                                    flex: 3, justifyContent: 'space-evenly',
                                }}>
                                    {employee.user.first_name != null ?
                                        <Text style={[styles.textStyle2, {
                                            paddingLeft: 7,
                                            color: "rgba(0, 0, 0, 0.87)"
                                        }]}>{employee.user.first_name} {employee.user.last_name}</Text>
                                        :
                                        <Text style={[styles.textStyle2, {
                                            paddingLeft: 7,
                                            color: "rgba(0, 0, 0, 0.87)"
                                        }]}>{employee.nickname}</Text>
                                    }

                                </View>
                                <View style={{
                                    flex: 1, alignItems: 'center',
                                    paddingRight: 7,
                                }}>
                                </View>
                            </View></TouchableWithoutFeedback>
                    ))}
                </ScrollView>
            </View>
            <View style={{
                flex: 1, height: 73, width: '100%', flexDirection: 'row', backgroundColor: '#fff'
            }}>
                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <EleButton title={"CANCEL"} type={"clear"}
                        titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#888888' }}
                        onPress={() => {
                            this.toggleEmployeeModal();
                            this.setState(prevState => {
                                const selectedEmp = Object.values(prevState.employees).map(e => {
                                    if (e.isDone == true) { e.selected = true }
                                    else e.selected = false
                                    return e;
                                })
                                return {
                                    ...prevState, employees: selectedEmp
                                }
                            })
                        }} />
                </View>

            </View>
        </View>
    );



    renderCustomerModalContent = () => (
        <View style={{
            height: 440, backgroundColor: 'white',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'rgba(0, 0, 0, 0.1)',
        }}>
            <View style={{
                flex: 1, height: 65, width: '100%', backgroundColor: '#fff',
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 24 }}>
                    <Text style={styles.textStyle8}>Customer List
 </Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {Object.values(this.state.customers).map(customer => (
                        <TouchableWithoutFeedback key={customer.user.id}
                            onPress={() => this.toggleCustomerSelected(customer.user.id)}><View
                                key={customer.user.id} style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    width: '100%',
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 9
                                }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <View
                                        style={[styles.circle, (this.state.customerName === customer.nickname ? {} : { backgroundColor: "rgba(150, 0, 0, 0.26)" })]}>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            {this.state.customerName === customer.nickname ? (
                                                <Icon name="check" type={"solid"} size={19}
                                                    color={"#fff"} />
                                            ) : (customer.user.image_id ? <Image source={{ uri: customer.user.image_id }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2,
                                                    backgroundColor: "rgba(150, 0, 0, 0.26)"
                                                }}
                                                resizeMode={"cover"} /> :
                                                (customer.user.first_name != null ?
                                                    <Text style={{
                                                        fontFamily: 'open-sans-hebrew',
                                                        fontSize: 23,
                                                        color: '#FFFFFF'
                                                    }}>{customer.user.first_name.substring(0, 1).toUpperCase()}</Text>
                                                    :
                                                    <Text style={{
                                                        fontFamily: 'open-sans-hebrew',
                                                        fontSize: 23,
                                                        color: '#FFFFFF'
                                                    }}>{customer.nickname.substring(0, 1).toUpperCase()}</Text>))}
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 3, justifyContent: 'space-evenly',
                                }}>
                                    {customer.user.first_name != null ?
                                        <Text
                                            style={[styles.contentTitle, { color: this.state.customerName === customer.nickname ? '#287F7E' : 'rgba(0,0,0,0.87)' }]}>
                                            {customer.user.first_name} {customer.user.last_name}
                                        </Text>
                                        :
                                        <Text
                                            style={[styles.contentTitle, { color: this.state.customerName === customer.nickname ? '#287F7E' : 'rgba(0,0,0,0.87)' }]}>
                                            {customer.nickname}
                                        </Text>}

                                </View>
                                <View style={{
                                    flex: 1, alignItems: 'center',
                                    paddingRight: 7,
                                }}>
                                </View>
                            </View></TouchableWithoutFeedback>
                    ))}
                </ScrollView>
            </View>
            <View style={{
                flex: 1, height: 73, width: '100%', flexDirection: 'row', backgroundColor: '#fff'
            }}>
                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <EleButton title={"CANCEL"} type={"clear"}
                        titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#888888', }}
                        onPress={() => {
                            this.toggleCustomerModal();
                            this.setState(prevState => {
                                const selectedCust = Object.values(prevState.customers).map(e => {
                                    if (e.isDone == true) { e.selected = true }
                                    else e.selected = false
                                    return e;
                                })
                                return {
                                    ...prevState, customers: selectedCust
                                }
                            })
                        }} />
                </View>

            </View>
        </View>
    );


    render() {
        const topRowHeight = Layout.isSmallDevice ? 460 : 540;
        const bottomRowHeight = Layout.isSmallDevice ? 60 : 80;
        const { serviceSelectModalVisible, serviceName, services, dateTime, employeeName, customerName } = this.state;

        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{
                    height: topRowHeight,
                    width: '100%',
                    flex: 0,
                }}>
                    <Modal
                        isVisible={serviceSelectModalVisible}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        swipeDirection={['up', 'down']}
                        onSwipeComplete={() => this.toggleSelectModal()}
                        onBackdropPress={() => this.toggleSelectModal()}
                        onBackButtonPress={() => this.toggleSelectModal()}
                        backdropColor={'#292929'}
                        backdropOpacity={0.4}
                    >
                        {this.renderModalContent()}
                    </Modal>
                    <DatePicker
                        style={{ width: 200 }}
                        date={moment(this.state.dateTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss, DD/MM/YYYY")}
                        mode="datetime"
                        placeholder="select date"
                        format={"HH:mm:ss, DD/MM/YYYY"}
                        minDate={moment().format("HH:mm:ss, DD/MM/YYYY")}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => {
                            this.setState({ dateTime: moment(date, "HH:mm:ss, DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") })
                        }}
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.datePickerRef = ref}
                    />

                    {/* employee modal */}
                    <Modal
                        isVisible={this.state.employeeModalVisible}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        onSwipeComplete={() => this.toggleEmployeeModal()}
                        onBackdropPress={() => this.toggleEmployeeModal()}
                        onBackButtonPress={() => this.toggleEmployeeModal()}
                        swipeDirection={['up', 'down']}
                        backdropColor={'#292929'}
                        backdropOpacity={0.4}
                        onModalHide={() => {
                        }}
                    >
                        {this.renderEmployeeModalContent()}
                    </Modal>
                    {/* customer modal */}
                    <Modal
                        isVisible={this.state.customerModalVisible}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        onSwipeComplete={() => this.toggleCustomerModal()}
                        onBackdropPress={() => this.toggleCustomerModal()}
                        onBackButtonPress={() => this.toggleCustomerModal()}
                        swipeDirection={['up', 'down']}
                        backdropColor={'#292929'}
                        backdropOpacity={0.4}
                        onModalHide={() => {
                        }}
                    >
                        {this.renderCustomerModalContent()}
                    </Modal>

                    <View style={{
                        height: 50,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                        borderBottomWidth: 2,
                        borderBottomColor: "#CCCCCC",
                        paddingBottom: 10
                    }}>

                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.toggleSelectModal()}
                            hitSlop={{ top: 40, left: 150, bottom: 40, right: 150 }}
                            pressRetentionOffset={{ top: 40, left: 150, bottom: 40, right: 150 }}>
                            {(serviceName.length === 0) ? <View>
                                <Text style={{ fontFamily: 'open-sans-hebrew', fontSize: 25, color: '#CCCCCC' }}>Select
 Service</Text>
                            </View> : <View style={styles.rowStyle1}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <EleButton title={""}
                                            buttonStyle={{
                                                backgroundColor: this.state.colorname,
                                                width: 18,
                                                height: 18,
                                                borderRadius: 18 / 3
                                            }} />
                                    </View>
                                    <View style={{
                                        flex: 5,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',

                                    }}>
                                        <Text style={{
                                            fontFamily: 'open-sans-hebrew',
                                            fontSize: 25,
                                            color: '#000000'
                                        }}>
                                            {this.state.serviceName}
                                        </Text>
                                    </View>
                                </View>}
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{
                        height: 50,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 6,
                        borderBottomColor: "#DDDDDD",


                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }}
                            onPress={() => this.datePickerRef.onPressDate()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name={"clock"} type={"solid"}
                                        size={19} color={"#888888"} />
                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {!dateTime ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select Date / Time</Text> : <Text
                                        style={styles.textStyle5}>{moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm, DD/MM/YYYY")}
                                            {(this.checkSameDay(dateTime)) ? ' (Today)' : ''}</Text>}

                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                        borderBottomColor: "#DDDDDD",
                        elevation: 0.4


                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.toggleEmployeeModal()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name={"id-card"} type={"solid"}
                                        size={19} color={"#888888"} />
                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {employeeName.length === 0 ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select Employee</Text> : <Text style={styles.textStyle5}>{employeeName}</Text>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.toggleCustomerModal()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name={"user"} type={"solid"}
                                        size={19} color={"#888888"} />
                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {customerName.length === 0 ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select Customer</Text> : <Text style={styles.textStyle5}>{customerName}</Text>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
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
                        <View style={{ flex: 4 }}></View>
                        <View style={{ flex: 2, alignSelf: 'center' }}>

                            <EleButton
                                title={"Create"}
                                titleStyle={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}
                                buttonStyle={{ backgroundColor: "#287F7E", width: 111, height: 40 }}
                                disabled={this.state.employee_id === null || this.state.customer_id === null || this.state.dateTime === null}
                                block
                                onPress={this.onCreateAppointment}>
                                <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Create</Text>
                            </EleButton>

                        </View>
                    </View>
                </View>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>)
    }
}
const mapStateToProps = (state) => ({
    employees: state.getBusinessByAliases.employees,
    customers: state.getBusinessByAliases.customers,
    services: state.getBusinessByAliases.services,
    openingHours: state.getBusinessByAliases.opening_hours,
});
const mapDispatchToProps = (dispatch) => (

    bindActionCreators({ createNewAppointment }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(NewAppointmentScreen)


const styles = StyleSheet.create({
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    rowStyle2: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'
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
    textStyle5: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#555555' },
    textStyle2: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: 'rgba(0,0,0,0.87)' },
    textStyle8: { fontFamily: 'open-sans-hebrew', fontSize: 20, color: '#000', paddingBottom: 2 },
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
        minHeight: 200
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
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#287F7E'
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