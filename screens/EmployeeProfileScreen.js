import React, { Component } from 'react';
import { Image, NetInfo, StyleSheet, Text, View, Alert, Linking } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import moment from "moment";

const { Popover } = renderers;

export default class EmployeeProfileScreen extends Component {
    state = {
        isConnected: false
    }
    static navigationOptions = ({ navigation }) => {
        const employee = navigation.getParam('employee', '');
        return {
            title: 'Employees',
            headerTitleStyle: {
                color: '#555555',
                height: 23,
                fontFamily: 'open-sans-hebrew',
                fontSize: 17,
                marginLeft: -9,

            },
            headerStyle: {
                elevation: 0,
            },
            headerBackImage: <Icon name="times" type={"solid"} size={20}
                color={"#555555"} style={{ marginLeft: 28, padding: 100 }} />,
            headerRight:
                <View style={{ flex: 1, width: '100%', marginRight: 22 }}>
                    <Menu
                        renderer={Popover}
                        rendererProps={{ placement: 'bottom', anchorStyle: { flex: 0, width: 0, height: 15 } }}
                    >
                        <MenuTrigger>
                            <View style={{ padding: 5 }}>
                                <Icon name="ellipsis-v"
                                    type={"regular"}
                                    size={20}
                                    color={"#888888"} marginLeft={28} style={{ padding: 30 }} />
                            </View>
                        </MenuTrigger>

                        <MenuOptions style={{
                            height: 30,
                            width: 132.14,
                            paddingVertical: 2,
                            shadowColor: 'black',
                            elevation: 5,
                            marginBottom: 5
                        }}>
                            {/* <MenuOption>
                                <Text style={{
                                    color: '#000000',
                                    marginLeft: 24,
                                    fontSize: 16,
                                    fontFamily: 'open-sans-hebrew',
                                    marginTop: 2,

                                }}>Edit</Text>
                            </MenuOption> */}
                            <MenuOption onSelect={() => {
                                Alert.alert(
                                    'Alert',
                                    'Are you sure, you really want to Delete?',
                                    [{
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK', onPress: () => { navigation.state.params.deleteEmpIdCallback(employee.user.id); navigation.pop(1); }

                                    }
                                    ],
                                    { cancelable: false },
                                );



                            }}>
                                <Text style={{
                                    color: '#000000',
                                    marginLeft: 24,
                                    fontSize: 16,
                                    fontFamily: 'open-sans-hebrew',
                                    marginBottom: 9.54,
                                    marginLeft: 8
                                }}>Delete</Text>
                            </MenuOption>

                        </MenuOptions>
                    </Menu>
                </View>

        }
    };
    Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
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

    _handlePress(number) {
        Linking.openURL("tel:" + number);
        // this.props.onPress && this.props.onPress();
    };

    render() {
        const { navigation } = this.props;
        const employee = navigation.getParam('employee', '');
        console.log("InserteEmployee", moment(employee.user.inserted_at).format("DD/MM/YYYY"))
        return (
            <View style={styles1.MainContainer}>

                <View style={{ flex: 0, justifyContent: "center", alignItems: 'center', marginTop: 30 }}>

                    {(employee.user.image_id != null ? <Image source={{ uri: employee.user.image_id }}
                        style={{ width: 89, height: 89, borderRadius: 89 / 2, backgroundColor: 'rgba(150, 0, 0, 0.26)' }}
                        resizeMode={"cover"} /> :
                        <Text style={{
                            fontFamily: 'open-sans-hebrew',
                            fontSize: 50,
                            textAlign: "center",
                            paddingTop: 13,
                            width: 89, height: 89, borderRadius: 89 / 2,
                            color: 'rgba(255,255,255,0.87)',
                            backgroundColor: 'rgba(150, 0, 0, 0.26)'
                        }}>{employee.user.first_name != null ? employee.user.first_name.substring(0, 1).toUpperCase() : employee.nickname.substring(0, 1).toUpperCase()}</Text>)}
                </View>


                <View style={{ marginBottom: 20, marginTop: 15 }}>
                    {employee.user.first_name != null ?
                        <Text style={{
                            flex: 0,
                            color: '#000000',
                            fontFamily: 'open-sans-hebrew',
                            fontSize: 20,
                        }}>{this.Capitalize(employee.user.first_name)} {this.Capitalize(employee.user.last_name)}</Text> :
                        <Text style={{
                            flex: 0,
                            color: '#000000',
                            fontFamily: 'open-sans-hebrew',
                            fontSize: 20,
                        }}>{this.Capitalize(employee.nickname)}</Text>
                    }
                </View>


                <View style={styles1.rowstyle}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={"phone"} type={"solid"} size={19} color={"#888888"} />
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text
                            onPress={() => this._handlePress(parsePhoneNumberFromString(employee.user.phone).format("INTERNATIONAL"))}
                            style={{
                                fontFamily: 'open-sans-hebrew',
                                fontSize: 16,
                                color: '#555555'
                            }}>{parsePhoneNumberFromString(employee.user.phone).format("INTERNATIONAL")}</Text>
                    </View>

                </View>

                <View style={styles1.rowstyle}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={"user-clock"} type={"regular"} size={19} width={24} color={"#888888"} />
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#000000' }}>{moment(employee.user.inserted_at).format("DD/MM/YYYY")}</Text>
                        <Text style={{ fontFamily: 'open-sans-hebrew', fontSize: 14, color: "rgba(0, 0, 0, 0.54)" }}>Employed
                            since</Text>
                    </View>

                </View>
                {this.state.isConnected ? null :
                    <View style={styles1.NetworkContainter}>
                        <Text style={styles1.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        )
    }
}

const styles1 = StyleSheet.create(
    {
        MainContainer:
        {
            flex: 1,
            alignItems: 'center',
            width: '100%',
            height: 270,
        },
        rowstyle: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 60,
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
