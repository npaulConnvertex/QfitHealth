import React from 'react';
import {
    NetInfo,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    AsyncStorage,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Alert, TextInput
} from 'react-native';
import { Button as EleButton } from 'react-native-elements';
import Icon from "react-native-fontawesome-pro";
import Layout from "../constants/Layout";
import { Radio, Body, Left, ListItem, Right } from "native-base";
import Modal from "react-native-modal";
import TimeSuggestionStickyList from "../components/TimeSuggestionStickyList";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getBusiness, getBusinesses } from "../axios/api";
import { getTimeSuggestionAction } from "../actions/getTimeSuggestionAction";

class TimeSuggestionsScreen extends React.Component {
    state = {
        isConnected: false,
        serviceName: '',
        Color: '',
        serviceDuration: '',
        isServiceNameFocused: false,
        serviceSelectModalVisible: false,
        employeeModalVisible: false,
        datePickerVisible: false,
        date: '',
        services: {},
        employees: {},
        businessName: '',
        todayDate: '',
        //business: [],

    };

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Find Time',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 20,
                width: '100%',
                color: '#555555'
            },
            headerStyle: {
                elevation: 5,
                shadowColor: 'black',
                shadowOffset: { height: -5 },
                shadowOpacity: 0.16,
                shadowRadius: 5,
                backgroundColor: '#fff'
            },
            headerBackImage: <Icon name="times" type={"solid"} size={20} style={{ padding: 100 }}
                color={"#CCCCCC"} />,
            headerRight: <EleButton title={"Skip"} type={"clear"}
                titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 13, color: '#888888' }}
                containerStyle={{ marginRight: 10 }}
                onPress={() => navigation.navigate('NewAppointment',
                    {
                        name: navigation.getParam('name', null),
                        service_id_props: navigation.getParam('service_id_props', null),
                        duration: navigation.getParam('duration', null),
                        Color: navigation.getParam('color', null),

                    })}>
            </EleButton>
        }
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

        var todayDate = moment().format("YYYY-MM-DDTHH:mm:ss").toString() + "Z";
        // var max_day = moment(todayDate).add(5, 'days');
        // console.warn("max day", max_day)
        if (this.props.navigation.getParam('name') && this.props.navigation.getParam('color') && this.props.navigation.getParam('duration')) {
            this.setState({
                serviceName: this.props.navigation.getParam('name'),
                Color: this.props.navigation.getParam('color'),
                serviceDuration: this.props.navigation.getParam('duration')

            })
        }
        this.props.getTimeSuggestionAction(businessName, todayDate, this.props.navigation.getParam('duration'))

        Object.values(this.props.employees).map(data => {
            data.isVisible = true
        });

        await this.setState({
            employees: this.props.employees,
            services: this.props.services,
            businessName: businessName,
            todayDate: todayDate
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

    componentWillReceiveProps(nextProps) {
        console.log("test")
    }


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



    toggleWithBackDrop = () => {
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
    }

    toggleEmployeeSelected = (key) => {
        this.setState((prevState) => {
            const selectedEmployees = Object.values(prevState.employees).map(selectedEmployee => {
                if (selectedEmployee.user.id !== key) {
                    return selectedEmployee;
                }
                let newSelectedEmployee = { ...selectedEmployee };
                newSelectedEmployee.selected = !selectedEmployee.selected;
                return newSelectedEmployee
            });
            return {
                ...prevState,
                employees: selectedEmployees,
            };
        });
    };

    renderDateButton = () => (<EleButton title={"Date"}
        type={"outline"}
        buttonStyle={{
            backgroundColor: '#FFFFFF',
            width: 82,
            height: 34,
            borderColor: '#CCCCCC',
            borderWidth: 1,
            borderRadius: 10
        }}
        titleStyle={{ fontFamily: 'open-sans-hebrew', fontSize: 13, color: '#555555' }}
        containerStyle={{ paddingLeft: 10 }}
        onPress={() => this.setState((prevState => {
            return { ...prevState, datePickerVisible: !prevState.datePickerVisible }
        }))}
    />);


    /*
    *
    * @TODO
    * Fix Cancel Feature on employee modal
    * */
    getSelectedCount = () => Object.values(this.state.employees).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
    getSelectedCountWithDone = () => Object.values(this.state.employees).reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);


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
                    <Text style={styles.textStyle8}>Select Service</Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {Object.values(this.state.services).map(service => (
                        <View key={service.id} style={{
                            paddingBottom: 40,
                            flex: 1,
                            flexDirection: 'row',
                            width: '100%',
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <EleButton title={""}
                                    buttonStyle={{
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
                                    selected={this.state.serviceName === service.name} selectedColor={"#287F7E"}
                                    onPress={() => this.setState({
                                        serviceName: service.name,
                                        Color: service.settings.color,
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
                    <Text style={styles.textStyle8}>Select Employees <Text
                        style={[styles.textStyle5, { paddingLeft: 15 }]}>{this.getSelectedCount() > 0 ? `(${this.getSelectedCount()} Selected)` : ``}</Text>
                    </Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {Object.values(this.state.employees).map(employee => (
                        <TouchableWithoutFeedback key={employee.user.phone}
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
                                        style={[styles.circle, (employee.selected ? {} : { backgroundColor: "rgba(150, 0, 0, 0.26)" })]}>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            {employee.selected ? (
                                                <Icon name="check" type={"solid"} size={19}
                                                    color={"#fff"} />
                                            ) : (employee.user.image_id != null ? <Image source={{ uri: employee.user.image_id }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2,
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
                flex: 1, height: 73, width: '100%', flexDirection: 'row', backgroundColor: '#fff', ...Platform.select({
                    ios: {
                        shadowColor: 'black',
                        shadowOffset: { height: -10 },
                        shadowOpacity: 0.16,
                        shadowRadius: 10,
                    },
                    android: {
                        elevation: 10,
                    }
                })
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <EleButton title={"DONE"} type={"clear"}
                        titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' }}
                        onPress={() => {
                            this.toggleEmployeeModal(),
                                this.setState(prevState => {
                                    return {
                                        ...prevState, employees: Object.values(prevState.employees).map(e => {
                                            if (e.selected == true)
                                                e.isDone = true;
                                            else e.isDone = false;
                                            return e;
                                        })
                                    }
                                })
                        }} />
                </View>
            </View>
        </View>
    )
    getEmployeesNames = (employeeList) => {
        let combList = '';
        let output = "";
        if (employeeList.length > 2) {
            output += (this.props.employees[employeeList[0]].user.first_name === null ? this.props.employees[employeeList[0]].nickname : this.props.employees[employeeList[0]].user.first_name) + ", ";
            output += (this.props.employees[employeeList[1]].user.first_name === null ? this.props.employees[employeeList[1]].nickname : this.props.employees[employeeList[1]].user.first_name) + " and ";
            output += `${employeeList.length - 2} more`;
        }
        if (employeeList.length === 2) {
            output += (this.props.employees[employeeList[0]].user.first_name === null ? this.props.employees[employeeList[0]].nickname : this.props.employees[employeeList[0]].user.first_name) + ", ";
            output += (this.props.employees[employeeList[1]].user.first_name === null ? this.props.employees[employeeList[1]].nickname : this.props.employees[employeeList[1]].user.first_name);
        }
        if (employeeList.length === 1) {
            output += (this.props.employees[employeeList[0]].user.first_name === null ? this.props.employees[employeeList[0]].nickname : this.props.employees[employeeList[0]].user.first_name);
        }
        return output;

    }
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

    render() {
        const topRowHeight = Layout.isSmallDevice ? 120 : 150;
        const middleRowHeight = Layout.isSmallDevice ? 500 : 580;
        const { services, serviceName, serviceSelectModalVisible, isServiceNameFocused, Color, serviceDuration } = this.state;
        { this.getSelectedCountWithDone() }
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{
                    height: topRowHeight,
                    flex: 0,
                    backgroundColor: '#fff',
                    elevation: 5,
                    shadowColor: 'black',
                    shadowOffset: { height: -5 },
                    shadowOpacity: 0.16,
                    shadowRadius: 5
                }}>
                    <View style={{
                        height: topRowHeight - 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#999999'
                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.toggleSelectModal()}
                        // hitSlop={{ top: 40, left: 150, bottom: 40, right: 150 }}
                        // pressRetentionOffset={{ top: 40, left: 150, bottom: 40, right: 150 }}
                        >
                            {(serviceName.length === 0) ?
                                <View style={styles.rowStyle1}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <EleButton title={""}
                                            buttonStyle={{
                                                backgroundColor: "#E8E8E8",
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
                                            color: '#CCCCCC'
                                        }}>Select Service</Text>
                                    </View>
                                </View>
                                : <View style={styles.rowStyle1}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <EleButton title={""}
                                            buttonStyle={{
                                                backgroundColor: this.state.Color,
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
                                        }}>{this.state.serviceName}</Text>
                                    </View>
                                </View>}
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ height: 60 }}>
                        <View
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <EleButton
                                title={this.getSelectedCountWithDone() > 1 ? `${this.getSelectedCountWithDone()} Employees` : (this.getSelectedCountWithDone() === 1 ? '1 Employee' : 'Employee')}
                                type={"solid"}
                                buttonStyle={[{
                                    backgroundColor: '#FFFFFF',
                                    width: 109,
                                    height: 34,
                                    borderColor: '#CCCCCC',
                                    borderWidth: 1,
                                    borderRadius: 10
                                }, (this.getSelectedCountWithDone() > 0 ? {
                                    backgroundColor: '#287F7E', borderColor: '#287F7E', borderWidth: 1,
                                    borderRadius: 10
                                } : {})]}
                                titleStyle={[{
                                    fontFamily: 'open-sans-hebrew',
                                    fontSize: 13,
                                    color: '#555555'
                                }, (this.getSelectedCountWithDone() > 0 ? { color: '#FFFFFF' } : {})]}
                                containerStyle={{ paddingLeft: 22 }}
                                TouchableComponent={TouchableOpacity}
                                onPress={() => this.toggleEmployeeModal()}
                            />
                            <EleButton title={this.state.date != '' ? this.state.date : 'Date'}
                                type={"outline"}
                                buttonStyle={[{
                                    backgroundColor: '#FFFFFF',
                                    width: 109,
                                    height: 34,
                                    borderColor: '#CCCCCC',
                                    borderWidth: 1,
                                    borderRadius: 10
                                }, (this.state.date ? {
                                    backgroundColor: '#287F7E', borderColor: '#287F7E', borderWidth: 1,
                                    borderRadius: 10
                                } : {})]}
                                titleStyle={[{
                                    fontFamily: 'open-sans-hebrew',
                                    fontSize: 13,
                                    color: '#555555'
                                }, (this.state.date ? { color: '#FFFFFF' } : {})]}
                                containerStyle={{ paddingLeft: 10 }}
                                TouchableComponent={TouchableOpacity}
                                onPress={() => this.datePickerRef.onPressDate()}
                            // onPress={this.datePicker()}
                            />
                        </View>
                    </View>
                    <DatePicker
                        style={{ width: 200 }}
                        date={this.state.date}
                        mode="datetime"
                        placeholder="select date"
                        format={"YYYY-MM-DDTHH:mm:ssZ"}
                        minDate={moment().format("YYYY-MM-DDTHH:mm:ssZ")}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => {
                            this.setState({ date: date })
                        }}
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.datePickerRef = ref}
                    />

                </View>
                <View style={{
                    height: middleRowHeight,
                    width: '100%',
                    flex: 1,
                    backgroundColor: serviceName.length > 0 ? '#fff' : '#F6F6F6'
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
                    <Modal
                        isVisible={this.state.employeeModalVisible}
                        onSwipeComplete={() => this.toggleEmployeeModal()}
                        onBackdropPress={() => this.toggleWithBackDrop()}
                        onBackButtonPress={() => this.toggleEmployeeModal()}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        swipeDirection={['up', 'down']} backdropColor={'#292929'}
                        backdropOpacity={0.4}
                        onModalHide={() => {
                        }}
                    >
                        {this.renderEmployeeModalContent()}
                    </Modal>

                    <View style={{ flex: 1, width: '100%' }}>

                        {this.props.getTimeSuggestions !== null && this.props.employees !== null ?
                            Object.keys(this.props.getTimeSuggestions).map((outeritem, index) => {
                                return (
                                    <View key={index}>
                                        <ListItem itemDivider
                                            style={{
                                                backgroundColor: '#fff',
                                                height: 47,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#EEEEEE'
                                            }}>
                                            <Text style={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 12, color: '#9D9D9D' }}>
                                                {outeritem}
                                            </Text>

                                            <Body style={{ marginRight: 40 }}>
                                            </Body>
                                            <Right />
                                        </ListItem>
                                        {Object.keys(this.props.getTimeSuggestions[outeritem]).map((item, index) => {
                                            let employeeList = this.props.getTimeSuggestions[outeritem];
                                            let availableEmployee = this.getEmployeesNames(employeeList[item])

                                            // selectedDate = moment(item, "HH:mm:ss").format('HH:mm:ss') + ", " + moment(outeritem).format('DD/MM/YYYY')

                                            return (

                                                <ListItem style={{ marginLeft: 0, borderBottomWidth: 0, }}>
                                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                        <Text
                                                            style={{ fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#555555' }}>{moment(item).utc().format("HH:mm")}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            // console.warn(moment(item).utc().format("HH:mm") + ", " + moment(outeritem).format('DD/MM/YYYY'))
                                                            this.props.navigation.navigate('NewAppointment',
                                                                {
                                                                    name: this.props.navigation.getParam('name', null),
                                                                    Color: this.props.navigation.getParam('color', null),
                                                                    duration: serviceDuration,
                                                                    service_id_props: this.props.navigation.getParam('service_id_props', null),
                                                                    emp: employeeList[item],
                                                                    //selectedDate: moment(item, "HH:mm:ss").format('HH:mm:ss') + ", " + moment(outeritem).format('DD/MM/YYYY'),
                                                                    selectedDate: moment(item).utc().format("HH:mm:ss") + ", " + moment(outeritem).format('DD/MM/YYYY')
                                                                })
                                                        }
                                                        }
                                                        style={{ flex: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 10 }}>
                                                        <Text style={{
                                                            fontFamily: 'open-sans-hebrew',
                                                            fontSize: 10,
                                                            color: '#AAAAAA'
                                                        }}>{availableEmployee}</Text>
                                                    </TouchableOpacity>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        {(employeeList[item].length > 1) ? <EleButton title={(employeeList[item].length > 1) ? `${employeeList[item].length}` : ''}
                                                            buttonStyle={{
                                                                backgroundColor: '#EEEEEE',
                                                                width: 30,
                                                                height: 22,
                                                                borderRadius: 5
                                                            }} titleStyle={{
                                                                fontFamily: 'open-sans-hebrew',
                                                                fontSize: 13,
                                                                color: '#555555'
                                                            }} /> : null}
                                                    </View>

                                                </ListItem>

                                            )
                                        })}

                                    </View>
                                )

                            })
                            : null
                        }
                    </View>
                </View>
                {this.state.isConnected ? null:
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        )
    }
}
const mapStateToProps = (state) => ({
    employees: state.getBusinessByAliases.employees,
    services: state.getBusinessByAliases.services,
    getTimeSuggestions: state.getBusinessByAliases.getTimeSuggestions
});
const mapDispatchToProps = (dispatch) => (

    bindActionCreators({ getTimeSuggestionAction }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(TimeSuggestionsScreen)


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
    textStyle5: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#555555' },
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
        minHeight: 200
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: 'open-sans-hebrew',
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