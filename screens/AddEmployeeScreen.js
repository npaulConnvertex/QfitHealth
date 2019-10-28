import React, { Component } from 'react';
import { Alert, Text, NetInfo, Animated, StyleSheet, TextInput, View } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import { Button as AddButton } from "react-native-elements";
import PhoneInput from "react-native-phone-input";
import { AsYouType } from "libphonenumber-js";
import * as Localization from 'expo-localization';

export default class AddEmployeeScreen extends Component {
    state = {
        name: "",
        phone: "",
        isEmployeeNameFocused: false,
        isPhoneFocused: false,
        isConnected: false,
    };
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'New Employee',
            headerTitleStyle: {
                fontWeight: 'bold',
                width: '100%',
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
                color={"#555555"} />,
            headerRight: <AddButton
                title={"Add"} raised
                titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 11 }}
                buttonStyle={{ backgroundColor: '#EC696A', width: 65, height: 27 }}
                containerStyle={{ marginRight: 10 }}
                onPress={() => {
                    // let isPhoneExists = Object.values(navigation.state.params.employees).filter(e =>
                    //     e.user.phone === navigation.getParam("phone", "")
                    // )
                    // if (isPhoneExists.length > 0) {
                    //     Alert.alert("Invalid Number", "Employee Phone Already Exists");
                    //     navigation.pop(1);
                    // } else {
                    navigation.state.params.addEmployeeCallback(navigation.getParam("name", ""), navigation.getParam("phone", ""));
                    navigation.pop(1);
                    //}


                }}
                disabled={navigation.getParam("name", "").length === 0 || navigation.getParam("phone", "").length === 0}
            >
            </AddButton>

        }
    };
    onChangeHandle = (field, value) => {
        if (field === 'phone') {

            this.props.navigation.setParams({ phone: value });
            this.setState({
                [field]: value
            })
        } else {
            this.props.navigation.setParams({ name: value });
            this.setState({
                [field]: value
            })
        }

    };
    onFocusChange = (field) => {
        this.setState({ [field]: true });
    };
    onBlurChange = (field) => {
        this.setState({ [field]: false });
    };
    onSelectCountry = () => {
        this.setState({ isPhoneFocused: true });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        Animated.timing(this._animatedEmployeeNameIsFocused, {
            toValue: (this.state.isEmployeeNameFocused || this.state.name !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedPhoneIsFocused, {
            toValue: (this.state.isPhoneFocused || this.state.phone !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }

    componentWillMount() {
        this._animatedEmployeeNameIsFocused = new Animated.Value(0);
        this._animatedPhoneIsFocused = new Animated.Value(0);
        if (this.props.navigation.getParam('name')) {
            this.setState({
                name: this.props.navigation.getParam('name')
            });
        }
        else {
            this.props.navigation.setParams({ name: this.state.name });
        }

        this.props.navigation.setParams({ phone: this.state.phone });
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    };

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );
        this.setState({ phone: this.phone.getCountryCode() })
    }

    render() {
        const phoneLabelStyle = {
            position: 'absolute',
            left: 40,
            top: this._animatedPhoneIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedPhoneIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedPhoneIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };

        const employeeLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedEmployeeNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedEmployeeNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedEmployeeNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };


        return (

            <View
                style={[styles.employeeContent]}>
                <View style={{ height: 35, marginTop: 10 }}>
                    <View style={styles.inputContainer}>
                        <Animated.Text style={employeeLabelStyle}>
                            Employee Name
                        </Animated.Text>
                        <TextInput value={this.state.name}
                            style={[styles.textInput1, (this.state.isEmployeeNameFocused) ? {
                                borderBottomColor: '#287F7E',
                            } : { borderBottomColor: '#888888' }]}
                            onFocus={() => this.onFocusChange("isEmployeeNameFocused")}
                            onBlur={() => this.onBlurChange("isEmployeeNameFocused")}
                            onChangeText={(text) => {
                                this.onChangeHandle("name", text)
                            }}

                        />

                    </View>
                </View>
                <View style={{ height: 35, marginTop: 20 }}>
                    <View style={styles.inputContainer}>
                        <Animated.Text style={phoneLabelStyle}>
                            Phone Number
                        </Animated.Text>
                        <PhoneInput
                            ref={ref => {
                                this.phone = ref;
                            }}
                            initialCountry={Localization.region}
                            textStyle={{
                                width: '100%',
                                borderBottomWidth: 2,
                                fontFamily: 'open-sans-hebrew-bold',
                                fontSize: 16,
                                height: 30,
                                borderBottomColor: (this.state.isPhoneFocused) ? '#287F7E' : '#888888'
                            }}
                            textProps={{
                                onFocus: () => this.onFocusChange("isPhoneFocused"),
                                onBlur: () => this.onBlurChange("isPhoneFocused")
                            }}
                            onChangePhoneNumber={(text) => {
                                this.onChangeHandle("phone", this.phone.getValue())
                            }}
                            value={this.state.phone}
                            onSelectCountry={() => this.onSelectCountry()}
                        />
                    </View>
                </View>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    employeeContent: {
        backgroundColor: '#ffffff',
        padding: 15,
        justifyContent: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    inputContainer: {
        paddingTop: 16,
    },
    textInput1: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16,
        height: 30

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

