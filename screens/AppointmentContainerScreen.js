import React from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Icon from 'react-native-fontawesome-pro'
import { TabBar, TabView } from "react-native-tab-view";
import { Button as EleButton } from 'react-native-elements';
import DatePicker from "react-native-datepicker";
import moment from "moment";
import Layout from "../constants/Layout";
import Modal from 'react-native-modal';
import Upcoming from '../screens/Upcoming';

const FirstRoute = () => (
    <View></View>
)
const SecondRoute = (props) => (
    <View style={{ height: '100%', paddingBottom: 10 }}>
        <View style={{
            height: 80,
            borderBottomColor: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            elevation: 2,
            shadowColor: 'rgba(17, 17, 17, 0.11)'
        }}>

            <View
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12 }}>

                <EleButton
                    title={props.getEmployeeSelectedCountWithDone() > 1 ? `${props.getEmployeeSelectedCountWithDone()} Employees` : (props.getEmployeeSelectedCountWithDone() === 1 ? '1 Employee' : 'Employee')}
                    type={"solid"}
                    buttonStyle={[{
                        backgroundColor: '#FFFFFF',
                        width: 100,
                        height: 34,
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        borderRadius: 10
                    }, (props.getEmployeeSelectedCountWithDone() > 0 ? {
                        backgroundColor: '#287F7E', borderColor: '#287F7E', borderWidth: 1,
                        borderRadius: 10
                    } : {})]}
                    titleStyle={[{
                        fontFamily: 'open-sans-hebrew',
                        fontSize: 13,
                        color: '#555555'
                    }, (props.getEmployeeSelectedCountWithDone() > 0 ? { color: '#FFFFFF' } : {})]}
                    containerStyle={{ paddingLeft: 20 }}
                    TouchableComponent={TouchableOpacity}
                    onPress={() => props.toggleEmployeeModal()}
                />
                <EleButton title={props.date != '' ? props.date : 'Date'}
                    type={"outline"}
                    buttonStyle={[{
                        backgroundColor: '#FFFFFF',
                        width: 100,
                        height: 34,
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        borderRadius: 10
                    }, (props.date ? {
                        backgroundColor: '#287F7E', borderColor: '#287F7E', borderWidth: 1,
                        borderRadius: 10
                    } : {})]}
                    titleStyle={[{
                        fontFamily: 'open-sans-hebrew',
                        fontSize: 13,
                        color: '#555555'
                    }, (props.date ? { color: '#FFFFFF' } : {})]}
                    containerStyle={{ paddingLeft: 10 }}
                    TouchableComponent={TouchableOpacity}
                    onPress={() => this.datePickerRef.onPressDate()}

                />
                <EleButton title={props.getCustomerSelectedCountWithDone() > 1 ? `${props.getCustomerSelectedCountWithDone()} Customers` : (props.getCustomerSelectedCountWithDone() === 1 ? '1 Customers' : 'Customers')}
                    type={"solid"}
                    buttonStyle={[{
                        backgroundColor: '#FFFFFF',
                        width: 100,
                        height: 34,
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        borderRadius: 10
                    }, (props.getCustomerSelectedCountWithDone() > 0 ? {
                        backgroundColor: '#287F7E', borderColor: '#287F7E', borderWidth: 1,
                        borderRadius: 10
                    } : {})]}
                    titleStyle={[{
                        fontFamily: 'open-sans-hebrew',
                        fontSize: 13,
                        color: '#555555'
                    }, (props.getCustomerSelectedCountWithDone() > 0 ? { color: '#FFFFFF' } : {})]}
                    containerStyle={{ paddingLeft: 10 }}
                    TouchableComponent={TouchableOpacity}
                    onPress={() => props.toggleCustomerModal()}
                />

            </View>
            <View style={{//middleRowHeight : Layout.isSmallDevice ? 500 : 580,
                width: '100%',
            }}>
                <Modal
                    isVisible={props.employeeModalVisible}
                    onSwipeComplete={() => props.toggleEmployeeModal()}
                    onBackdropPress={() => props.toggleEmployeeWithBackDrop()}
                    onBackButtonPress={() => props.toggleEmployeeModal()}
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
                    {props.renderEmployeeModalContent()}
                </Modal>
                <Modal
                    isVisible={props.customerModalVisible}
                    onSwipeComplete={() => props.toggleCustomerModal()}
                    onBackdropPress={() => props.toggleCustomerWithBackDrop()}
                    onBackButtonPress={() => props.toggleCustomerModal()}
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
                    {props.renderCustomerModalContent()}
                </Modal>

            </View>
        </View>
        <DatePicker
            style={{ width: 0, height: 0 }}
            date={props.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate={moment().format("YYYY-MM-DD")}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {
                props.callback(date);
            }}
            showIcon={false}
            hideText={true}
            ref={(ref) => this.datePickerRef = ref}
        ></DatePicker>

        <ScrollView>
            <TouchableWithoutFeedback>
                <Upcoming />
            </TouchableWithoutFeedback>
        </ScrollView>

    </View>
)

export default class AppointmentContainerScreen extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'ACTIVITY' },
            { key: 'second', title: 'UPCOMING' },
        ],
        employeeModalVisible: false,
        customerModalVisible: false,
        datePickerVisible: false,
        date: "",
        employees: [
            {
                "name": "Test",
                "phone": "+918240662983",
                "image": true,
                "color": "rgba(150, 0, 0, 0.26)",
                selected: false,
                isDone: false
            },
            {
                "name": "Test1",
                "phone": "+918240662984",
                "image": false,
                "color": "rgba(150, 0, 0, 0.26)",
                selected: false,
                isDone: false
            }, {
                "name": "Test2",
                "phone": "+918240662985",
                "image": false,
                "color": "rgba(0, 46, 100, 0.55)",
                selected: false,
                isDone: false
            }, {
                "name": "Test3",
                "phone": "+918240662981",
                "image": false,
                "color": "rgba(0, 0, 150, 0.26)",
                selected: false,
                isDone: false
            }, {
                "name": "Test4",
                "phone": "+91824066290",
                "image": false,
                "color": "rgba(0, 150, 0, 0.26)",
                selected: false,
                isDone: false
            }, {
                "name": "Test5",
                "phone": "+918240662990",
                "image": false,
                "color": "rgba(159, 168, 218, 0.55)",
                selected: false,
                isDone: false
            },
            {
                "name": "Test6",
                "phone": "+918240662900",
                "image": true,
                "color": "rgba(150, 0, 0, 0.26)",
                selected: false,
                isDone: false
            }],
        customers: [
            {
                name: 'Adam Amar',
                image: true,
                phone: '+919511970204',
                selected: false,
                color: "rgba(0, 46, 100, 0.55)",
                isDone: false
            },

            {
                name: 'Zehar Ashdot',
                image: false,
                phone: '+912344555566',
                selected: false,
                color: "rgba(0, 46, 100, 0.55)",
                isDone: false
            },
            {
                name: 'Yamini Unta',
                image: true,
                phone: '+912344556778',
                selected: false,
                color: "rgba(0, 46, 100, 0.55)",
                isDone: false
            },
            {
                name: 'Amit Mizrahi',
                image: false,
                phone: '+919585464574',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },
            {
                name: 'Aan Zuchruf',
                image: false,
                phone: '+919585464522',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },
            {
                name: 'Asaf Cohen',
                image: false,
                phone: '+919585464533',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },
            {
                name: 'Aviv Goldner',
                image: false,
                phone: '+919585464544',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },
            {
                name: 'Benny Goodman',
                image: false,
                phone: '+919585464555',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },
            {
                name: 'Bibi King',
                image: false,
                phone: '+919585464474',
                selected: false,
                color: "rgba(150, 0, 0, 0.26)",
                isDone: false
            },

        ],

    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Appointments',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 17,
                width: '100%',
                color: '#555555'
            },
            headerStyle: {
                elevation: 5,
                shadowColor: 'black',
                shadowOffset: { height: -5 },
                shadowOpacity: 0.16,
                shadowRadius: 5,
            },
            headerRight: <View style={{ marginRight: 22, padding: 5 }}>
                <Icon name="ellipsis-v"
                    type={"regular"}
                    size={20}
                    color={"#888888"} marginLeft={22} style={{ padding: 30 }} />
            </View>,
            headerLeft: <View style={{
                flex: 1,
                width: '100%',
                marginLeft: 20,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}><Icon name="bars" type={"solid"} size={20} color={"#888888"} style={{ padding: 30 }}
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /></View>,


        }
    };
    renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <FirstRoute />;
            case 'second':
                return <SecondRoute date={this.state.date}
                    employeeModalVisible={this.state.employeeModalVisible}
                    toggleEmployeeWithBackDrop={this.toggleEmployeeWithBackDrop}
                    getEmployeeSelectedCount={this.getEmployeeSelectedCount}
                    getEmployeeSelectedCountWithDone={this.getEmployeeSelectedCountWithDone}
                    toggleEmployeeModal={this.toggleEmployeeModal}
                    renderEmployeeModalContent={this.renderEmployeeModalContent}
                    toggleEmployeeSelected={this.toggleEmployeeSelected}
                    toggleCustomerWithBackDrop={this.toggleCustomerWithBackDrop}
                    customerModalVisible={this.state.customerModalVisible}
                    toggleCustomerModal={this.toggleCustomerModal}
                    renderCustomerModalContent={this.renderCustomerModalContent}
                    toggleCustomerSelected={this.toggleCustomerSelected}
                    getCustomerSelectedCount={this.getCustomerSelectedCount}
                    getCustomerSelectedCountWithDone={this.getCustomerSelectedCountWithDone}
                    callback={this.callback}
                />
            default:
                return null;
        }
    };
    componentDidMount() {
        //console.log("container 12345")
    }
    //Employee
    getEmployeeSelectedCount = () => this.state.employees.reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
    getEmployeeSelectedCountWithDone = () => this.state.employees.reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);

    toggleEmployeeWithBackDrop = () => {
        this.toggleEmployeeModal();
        this.setState(prevState => {
            const selectedEmp = prevState.employees.map(e => {
                if (e.isDone == true) { e.selected = true }
                else e.selected = false
                return e;
            })
            return {

                ...prevState, employees: selectedEmp
            }

        })
    }

    toggleEmployeeModal = () => {
        this.setState((prevState => {
            return { ...prevState, employeeModalVisible: !prevState.employeeModalVisible }
        }));
    };
    callback = (date) => {
        this.setState({ date: date })
    }
    toggleEmployeeSelected = (key) => {
        this.setState((prevState) => {
            const selectedEmployees = prevState.employees.map(selectedEmployee => {
                if (selectedEmployee.phone !== key) {
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
    renderEmployeeModalContent = () => (
        <View style={{
            height: 440, backgroundColor: 'white',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'rgba(0, 0, 0, 0.1)',
        }}>
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
                    <Text style={styles.textStyle1}>Select Employees <Text
                        style={[styles.textStyle2, { paddingLeft: 15 }]}>{this.getEmployeeSelectedCount() > 0 ? `(${this.getEmployeeSelectedCount()} Selected)` : ``}</Text>
                    </Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {this.state.employees.map(employee => (
                        <TouchableWithoutFeedback key={employee.name}
                            onPress={() => this.toggleEmployeeSelected(employee.phone)}><View
                                key={employee.name} style={{
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
                                        style={[styles.circle, (employee.selected ? {} : { backgroundColor: employee.color })]}>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            {employee.selected ? (
                                                <Icon name="check" type={"solid"} size={19}
                                                    color={"#fff"} />
                                            ) : (employee.image ? <Image source={require('./../assets/images/Person.png')}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2
                                                }}
                                                resizeMode={"cover"} /> :
                                                <Text style={{
                                                    fontFamily: 'open-sans-hebrew',
                                                    fontSize: 23,
                                                    color: 'rgba(255,255,255,0.87)'
                                                }}>{employee.name.substring(0, 1)}</Text>)}
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 3, justifyContent: 'space-evenly',
                                }}>
                                    <Text
                                        style={[styles.contentTitle, { color: employee.selected ? '#287F7E' : 'rgba(0,0,0,0.87)' }]}>{employee.name}</Text>
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
                flex: 1, width: '100%', flexDirection: 'row', backgroundColor: '#fff', ...Platform.select({
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
                                const selectedEmp = prevState.employees.map(e => {
                                    if (e.isDone == true) { e.selected = true }
                                    else e.selected = false
                                    return e
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
                                        ...prevState, employees: prevState.employees.map(e => {
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
    );
    //Customer
    getCustomerSelectedCount = () => this.state.customers.reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
    getCustomerSelectedCountWithDone = () => this.state.customers.reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);

    toggleCustomerWithBackDrop = () => {
        this.toggleCustomerModal();
        this.setState(prevState => {
            const selectedCum = prevState.customers.map(c => {
                if (c.isDone == true) { c.selected = true }
                else c.selected = false
                return c;
            })
            return {

                ...prevState, customers: selectedCum
            }

        })
    }
    toggleCustomerModal = () => {
        this.setState((prevState => {
            return { ...prevState, customerModalVisible: !prevState.customerModalVisible }
        }));
    };
    toggleCustomerSelected = (key) => {
        this.setState((prevState) => {
            const selectedCustomers = prevState.customers.map(selectedCustomer => {
                if (selectedCustomer.phone !== key) {
                    return selectedCustomer;
                }
                let newSelectedCustomer = { ...selectedCustomer };
                newSelectedCustomer.selected = !selectedCustomer.selected;
                return newSelectedCustomer
            });
            return {
                ...prevState,
                customers: selectedCustomers,
            };
        });
    };
    renderCustomerModalContent = () => (
        <View style={{
            height: 440, backgroundColor: 'white',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'rgba(0, 0, 0, 0.1)',
        }}>
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
                    <Text style={styles.textStyle1}>Select Customers <Text
                        style={[styles.textStyle2, { paddingLeft: 15 }]}>{this.getCustomerSelectedCount() > 0 ? `(${this.getCustomerSelectedCount()} Selected)` : ``}</Text>
                    </Text>
                </View>
            </View>
            <View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
                <ScrollView>
                    {this.state.customers.map(customers => (
                        <TouchableWithoutFeedback key={customers.name}
                            onPress={() => this.toggleCustomerSelected(customers.phone)}><View
                                key={customers.name} style={{
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
                                        style={[styles.circle, (customers.selected ? {} : { backgroundColor: customers.color })]}>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            {customers.selected ? (
                                                <Icon name="check" type={"solid"} size={19}
                                                    color={"#fff"} />
                                            ) : (customers.image ? <Image source={require('./../assets/images/Person.png')}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 40 / 2
                                                }}
                                                resizeMode={"cover"} /> :
                                                <Text style={{
                                                    fontFamily: 'open-sans-hebrew',
                                                    fontSize: 23,
                                                    color: 'rgba(255,255,255,0.87)'
                                                }}>{customers.name.substring(0, 1)}</Text>)}
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 3, justifyContent: 'space-evenly',
                                }}>
                                    <Text
                                        style={[styles.contentTitle, { color: customers.selected ? '#287F7E' : 'rgba(0,0,0,0.87)' }]}>{customers.name}</Text>
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
                flex: 1, width: '100%', flexDirection: 'row', backgroundColor: '#fff', ...Platform.select({
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
                            this.toggleCustomerModal();
                            this.setState(prevState => {
                                const selectedCum = prevState.customers.map(e => {
                                    if (e.isDone == true) { e.selected = true }
                                    else e.selected = false
                                    return e
                                })
                                return {
                                    ...prevState, customers: selectedCum
                                }
                            })
                        }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <EleButton title={"DONE"} type={"clear"}
                        titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' }}
                        onPress={() => {
                            this.toggleCustomerModal(),
                                this.setState(prevState => {
                                    return {
                                        ...prevState, customers: prevState.customers.map(e => {
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
    );

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
                            return <Text style={{
                                fontFamily: 'open-sans-hebrew-bold',
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

        )
    }
}
const styles = StyleSheet.create({

    tabBarStyle: {
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { height: -5 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
    },
    textStyle2: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#555555' },

    textStyle1: { fontFamily: 'open-sans-hebrew', fontSize: 20, color: '#000' },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#287F7E'
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: 'open-sans-hebrew-light',
        color: 'rgba(0,0,0,0.87)'
    },
})