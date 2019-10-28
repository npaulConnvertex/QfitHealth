import React, { Component } from 'react';
import { Alert, NetInfo, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, ImageBackground, View, AsyncStorage } from 'react-native';
import { Button, Radio, StyleProvider } from "native-base";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import Icon from "react-native-fontawesome-pro";
import DatePicker from "react-native-datepicker";
import Layout from "../constants/Layout";
import moment from "moment";
import Modal from "react-native-modal";
import { Button as EleButton } from "react-native-elements";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { createNewSlots } from "../actions/CreateAvailabilitySlotsAction";
import { createNewBlocks } from '../actions/CreateBusyBlocksAction';

class AddBreakScreen extends Component {

    state = {
        isConnected: false,
        dateTime: null,
        startTime: null,
        endTime: null,
        totalTime: null,
        repeatSelect: "No Repeat",
        title: "",
        repeat: [{ name: 'No Repeat' },
        { name: 'Daily' },
        { name: 'Weekly' }],
        repeatModeVisible: false,
        employeeModalVisible: false,
        business: [],
        breakEmployees: {},
        page: null,
        isSelected: false,
        selectedEmployeesCount: []
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: (navigation.getParam('page') === 'slot') ? 'New Slot' : 'New Break',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 20,
                width: '100%',
                color: (navigation.getParam('page') === 'slot') ? '#FFFFFF' : '#555555'

            },
            headerStyle: {
                elevation: 0,
                shadowColor: 'transparent',
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
                backgroundColor: (navigation.getParam('page') === 'slot') ? '#287F7E' : '#EEEEEE'

            },
            headerBackImage: <Icon name="times" type={"solid"} size={25} style={{ padding: 100 }}
                color={"#888888"} />,
            headerBackground: (navigation.getParam('page') === 'break') ? <Image source={require('./../assets/images/line-background.png')} style={{
                width: '100%',
                height: '100%',
            }} resizeMode={"cover"} /> : <Image />
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
        // Object.values(this.props.employees).map(data => {
        //     data.isVisible = true
        // });
        // var businessName = this.props.business.aliases[0];

        // console.warn("THE EMPLOYEES FROM EMPLOUYEES", this.props.employees)

        var emplNewList = {}

        await Object.values(this.props.employees).map((item, index) => {
            emplNewList[item.user.id] = item
            emplNewList[item.user.id].isDone = false;
            emplNewList[item.user.id].selected = false;

        })

        await this.setState({
            // businessName: businessName,
            breakEmployees: emplNewList,
        })


        this.setState({
            businessName: businessName,
            breakEmployees: emplNewList,
        })

        console.warn("STATE EMPLOUYEES", this.state.breakEmployees);

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

    async componentWillReceiveProps(nextProps) {
        // Object.values(nextProps.employees).map(data => {
        //     data.isVisible = true
        // });
        // var businessName = this.props.business.aliases[0];
        // var emplNewList = {}

        // await Object.values(nextProps.employees).map((item, index) => {
        //     emplNewList[item.user.id] = item
        //     emplNewList[item.user.id].isDone = false;
        //     emplNewList[item.user.id].selected = false;

        // })

        // await this.setState({
        //     // businessName: businessName,
        //     breakEmployees: emplNewList,
        // });

        // console.warn("STATE EMPLOYEES", nextProps.employees)

    }
    toggleEmployeeModal = () => {
        this.setState((prevState => {
            return { ...prevState, employeeModalVisible: !prevState.employeeModalVisible }
        }));
    };

    toggleWithBackDrop = () => {
        this.toggleEmployeeModal();
        this.setState(prevState => {
            const selectedEmp = Object.values(prevState.breakEmployees).map(e => {
                if (e.isDone == true) { e.selected = true }
                else e.selected = false
                return e;
            })
            return {
                ...prevState, breakEmployees: selectedEmp
            }
        })
    }

    toggleEmployeeSelected = (key) => {
        this.setState((prevState) => {
            const selectedEmployees = Object.values(prevState.breakEmployees).map(selectedEmployee => {
                if (selectedEmployee.user.id !== key) {
                    return selectedEmployee;
                }
                let newSelectedEmployee = { ...selectedEmployee };
                newSelectedEmployee.selected = !selectedEmployee.selected;
                return newSelectedEmployee
            });
            return {
                ...prevState,
                breakEmployees: selectedEmployees,
            };
        });
    };

    getSelectedCount = () => Object.values(this.state.breakEmployees).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
    getSelectedCountWithDone = () => Object.values(this.state.breakEmployees).reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);


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
                    {Object.values(this.state.breakEmployees).map(employee => (
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
                                                    backgroundColor: "rgba(150, 0, 0, 0.26)"
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
                                const selectedEmp = Object.values(prevState.breakEmployees).map(e => {
                                    if (e.isDone == true) { e.selected = true }
                                    else e.selected = false
                                    return e;
                                })
                                return {
                                    ...prevState, breakEmployees: selectedEmp
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
                                        ...prevState,
                                        employees: Object.values(prevState.breakEmployees).map(e => {
                                            if (e.selected == true)
                                                e.isDone = true;
                                            else e.isDone = false;
                                            return e;
                                        }),
                                        selectedEmployeesCount: Object.values(prevState.breakEmployees).filter(x => x.isDone == true)
                                            .map(emp => {
                                                return emp.user.id;
                                            })

                                    }

                                });

                        }} />
                </View>
            </View>
        </View>
    )

    checkSameDay = (date) => {
        if (moment().isSame(date, 'day'))
            return true;
        return false;
    };

    calculateTime = (startTime, endTime) => {

        var timeDiff = moment.utc(moment(endTime, " HH:mm").diff(moment(startTime, " HH:mm"))).format("HH:mm");
        const diffDuration = moment.duration(timeDiff);
        var hrs = diffDuration.hours();
        var min = diffDuration.minutes();

        var convertIntoMin = hrs * 60;
        var totalMin = parseInt(convertIntoMin) + parseInt(min);
        this.setState({ totalTime: totalMin })
    };

    onSubmit = () => {
        let DATE = this.state.dateTime;
        let sTIME = moment(this.state.startTime, "HH:mm").format("HH:mm:ss");
        let eTIME = moment(this.state.endTime, "HH:mm").format("HH:mm:ss");
        var breakData = {
            'name': this.state.title,
            'employee_ids': this.state.selectedEmployeesCount,
            'end_time_utc': DATE + 'T' + eTIME + 'Z',
            'start_time_utc': DATE + 'T' + sTIME + 'Z',
            'extra_data': this.state.repeatSelect,
        };
        console.log("break data", breakData)
        if (this.props.navigation.getParam('page') === 'slot') {
            this.props.createNewSlots(this.state.businessName, breakData)
            //Alert.alert("Info", "Slot Created Successfully");
            this.props.navigation.navigate('Calendar', { newEmployees: this.state.breakEmployees });
        } else {
            this.props.createNewBlocks(this.state.businessName, breakData)
            //Alert.alert("Info", "Break Created Successfully");
            this.props.navigation.navigate('Calendar', { newEmployees: this.state.breakEmployees });
        }
    }


    renderModalContent = () => (
        <View style={[styles.content,]}>
            <View style={{
                flex: 1, height: 20, width: '100%', backgroundColor: '#fff', ...Platform.select({
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
                    <Text style={styles.textStyle8}>Select Repeat</Text>
                </View>
            </View>
            {this.state.repeat.map(service => (
                <View key={service.name} style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

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
                            selected={this.state.repeatSelect === service.name} selectedColor={"#287F7E"}
                            onPress={() => this.setState({
                                repeatSelect: service.name,
                                repeatModeVisible: false
                            })} />
                    </View>
                </View>
            ))}
        </View>
    );
    toggleRepeatModal = () => {
        this.setState((prevState => {
            return { ...prevState, repeatModeVisible: !prevState.repeatModeVisible }
        }));
    };
    onChangeHandle = (field, value) => {
        this.setState({
            [field]: value
        });
    };

    render() {
        const page = this.props.navigation.getParam('page');
        const topRowHeight = Layout.isSmallDevice ? 460 : 540;
        const bottomRowHeight = Layout.isSmallDevice ? 60 : 80;
        const { repeatModeVisible, dateTime, startTime, endTime, repeatSelect, selectedEmployeesCount, title } = this.state;
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{
                    height: topRowHeight,
                    width: '100%',
                    flex: 0,
                }}>
                    <Modal
                        isVisible={this.state.employeeModalVisible}
                        onSwipeComplete={() => this.toggleEmployeeModal()}
                        onBackdropPress={() => this.toggleWithBackDrop()}
                        onBackButtonPress={() => this.toggleWithBackDrop()}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        swipeDirection={['up', 'down']}
                        backdropColor={'#292929'}
                        backdropOpacity={0.4}
                        onModalHide={() => {
                        }}
                    >
                        {this.renderEmployeeModalContent()}
                    </Modal>
                    <Modal
                        isVisible={repeatModeVisible}
                        onBackdropPress={() => this.toggleRepeatModal()}
                        onBackButtonPress={() => this.toggleRepeatModal()}
                        onSwipeComplete={() => this.toggleRepeatModal()}
                        backdropColor={'#292929'}
                        backdropOpacity={0.4}
                        animationIn={"fadeIn"}
                        animationOut={"fadeOut"}
                        animationInTiming={100}
                        animationOutTiming={10}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={10}
                        hideModalContentWhileAnimating
                        swipeDirection={['up', 'down']}
                    >
                        {this.renderModalContent()}
                    </Modal>

                    <DatePicker
                        style={{ width: 200, height: 0 }}
                        date={this.state.dateTime}
                        mode="date"
                        placeholder="select date"
                        format={"YYYY-MM-DD"}
                        minDate={moment().format("YYYY-MM-DD")}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => {
                            this.setState({ dateTime: date })

                        }}
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.datePickerRef = ref}
                    />
                    <DatePicker
                        style={{ width: 200, height: 0 }}
                        date={this.state.startTime}
                        mode="time"
                        placeholder="Select start time"
                        format={"HH:mm"}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(time) => {
                            this.setState({ startTime: time });
                            if (this.state.endTime != null) {
                                this.calculateTime(this.state.startTime, this.state.endTime)
                            }
                        }}
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.startTimePickerRef = ref}
                    />
                    <DatePicker
                        style={{ width: 200, height: 0 }}
                        date={this.state.endTime}
                        mode="time"
                        placeholder="Select end time"
                        format={"HH:mm"}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(time) => {
                            this.setState({ endTime: time });
                            this.calculateTime(this.state.startTime, this.state.endTime)
                        }}
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.endTimePickerRef = ref}
                    />

                    <View style={{ height: 60, width: '100%' }}>
                        {page == 'break' ?
                            <ImageBackground source={require('./../assets/images/line-background.png')} style={{ flex: 1, resizeMode: 'cover', height: '100%' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>{
                                            page == 'slot' ? <Icon name={"expand"} type={"solid"} size={19} color={"#FFFFFF"} />
                                                : <Icon name={"mug-hot"} type={"solid"} size={19} color={"#888888"} />
                                        }
                                    </View>
                                    <View style={{
                                        flex: 5,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',

                                    }}>
                                        <TextInput
                                            style={[styles.textInput, (page == 'slot' ? { color: '#FFFFFF' } : { color: '#888888' })]}
                                            placeholder={"Title"}
                                            onChangeText={(text) => this.onChangeHandle("title", text)}
                                        />
                                    </View>
                                </View>
                            </ImageBackground>
                            :
                            <View style={[styles.rowStyle1, (page == 'slot' ? { backgroundColor: '#287F7E' } : { backgroundColor: '#EEEEEE' })]}>

                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>{
                                        page == 'slot' ? <Icon name={"expand"} type={"solid"} size={19} color={"#FFFFFF"} />
                                            : <Icon name={"mug-hot"} type={"solid"} size={19} color={"#888888"} />
                                    }

                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',

                                }}>
                                    <TextInput
                                        style={[styles.textInput, (page == 'slot' ? { color: '#FFFFFF' } : { color: '#888888' })]}
                                        placeholder={"Title"}
                                        onChangeText={(text) => this.onChangeHandle("title", text)}
                                    />
                                </View>

                            </View>
                        }
                    </View>



                    {/* Select Employee */}
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#DDDDDD'
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
                                    <Icon name={"id-card"}
                                        size={19} color={"#888888"} />
                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {this.getSelectedCountWithDone() > 0 ? <Text style={styles.textStyle5}>All Employee ({this.getSelectedCountWithDone()})</Text> : <Text
                                        style={{
                                            fontFamily: 'open-sans-hebrew',
                                            fontSize: 16,
                                            color: '#AAAAAA'
                                        }}>Select Employee</Text>}
                                </View>
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                    {/* select date */}
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#DDDDDD'
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
                                    <Icon name={"calendar-day"}
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
                                    }}>Select Date </Text> : <Text
                                        style={styles.textStyle5}>{dateTime} {this.checkSameDay(dateTime) ? '(Today)' : ''}</Text>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {/* start time */}
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#DDDDDD'
                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }}
                            onPress={() => this.startTimePickerRef.onPressDate()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    <Icon name={"clock"}
                                        size={19} color={"#888888"} />
                                    <View style={{ position: 'absolute', heigth: 6, width: 6, backgroundColor: 'white', zIndex: 1, bottom: 17, left: 33 }}>
                                        <Icon name={"caret-right"} type={"solid"}
                                            size={10} color={"#8AC640"} />
                                    </View>


                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {!startTime ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select  Start Time </Text> : <Text
                                        style={styles.textStyle5}>{startTime}</Text>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {/* end time */}
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }}
                            onPress={() => this.endTimePickerRef.onPressDate()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    <Icon name={"clock"}
                                        size={19} color={"#888888"} />
                                    <View style={{ position: 'absolute', heigth: 12, width: 12, backgroundColor: 'white', padding: 2, zIndex: 1, bottom: 20, left: 33 }}>
                                        <Icon name={"square"} type={"solid"}
                                            size={6} color={"#EC696A"} />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 3,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {!endTime ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select End Time </Text> : <Text
                                        style={styles.textStyle5}>{endTime}</Text>}
                                </View>
                                <View style={{
                                    flex: 2,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    <Text style={{ backgroundColor: '#EEEEEE', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 10 }}>{this.state.totalTime} MINUTES</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    {/* Repeat */}
                    <View style={{
                        height: 60,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#DDDDDD'
                    }}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.toggleRepeatModal()}
                            hitSlop={{ top: 20, left: 150, bottom: 20, right: 150 }}
                            pressRetentionOffset={{ top: 20, left: 150, bottom: 20, right: 150 }}>
                            <View style={styles.rowStyle1}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name={"redo-alt"}
                                        size={19} color={"#888888"} />
                                </View>
                                <View style={{
                                    flex: 5,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                    {repeatSelect.length === 0 ? <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#AAAAAA'
                                    }}>Select Repeat</Text> : <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 16,
                                        color: '#000000'
                                    }}>{repeatSelect}</Text>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>

                </View>
                <View style={{ height: bottomRowHeight, borderTopWidth: 1, borderTopColor: '#DDDDDD' }}>
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
                            <StyleProvider style={getTheme(material)}>
                                <Button
                                    style={{
                                        elevation: 0, shadowColor: null,
                                        shadowOffset: null,
                                        shadowRadius: null,
                                        shadowOpacity: null,
                                    }}
                                    disabled={selectedEmployeesCount.length === 0 || title === "" || repeatSelect === "" || startTime === null || endTime === null || dateTime === null}
                                    block
                                    success={!(selectedEmployeesCount.length === 0 || title === "" || repeatSelect === "" || startTime === null || endTime === null || dateTime === null)}
                                    onPress={() => this.onSubmit()}>
                                    <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Create</Text>
                                </Button>
                            </StyleProvider>
                        </View>
                        {this.state.isConnected ? null :
                            <View style={styles.NetworkContainter}>
                                <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                            </View>}
                    </View>
                </View>
            </View>

        )
    }

}


const mapStateToProps = (state) => ({
    employees: state.getBusinessByAliases.employees,
    blockError: state.createBlockError,
    slotError: state.createSlotError
});


const mapDispatchToProps = (dispatch) => (

    bindActionCreators({ createNewSlots, createNewBlocks }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(AddBreakScreen)


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
        fontFamily: 'open-sans-hebrew',
        fontSize: 25,
        height: 34,
    },
    textInput1: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#DDDDDD',
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
        minHeight: 200,
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
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
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