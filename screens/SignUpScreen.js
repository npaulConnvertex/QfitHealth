import React from 'react';
import { Alert, NetInfo, Animated, AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { Button, Container, Content, StyleProvider } from 'native-base';
import { Col, Grid, Row } from "react-native-easy-grid";
import Icon from "react-native-fontawesome-pro";
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import BottomNavigationWithLineArt from "../shared/BottomNavigationWithLineArt";
import { beginPhoneVerification, findUserByPhone, newGuestSession } from "../axios/api";
import PhoneInput from "react-native-phone-input";
import Layout from './../constants/Layout';
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import * as Localization from 'expo-localization';


export default class SignUpScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        isConnected: false,
        phone: "",
        isPhoneFocused: false,
    };

    onChangeHandle = (field, value) => {
        if (field === 'phone') {
            this.setState({
                phone: new AsYouType().input(value)
            });
        } else {
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

    componentWillMount() {
        this._animatedPhoneIsFocused = new Animated.Value(0);
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

    componentDidUpdate() {
        Animated.timing(this._animatedPhoneIsFocused, {
            toValue: (this.state.isPhoneFocused || this.state.phone !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }


    sendVerificationCode = () => {
        console.log("sendVerificationCode")
        newGuestSession().then(responseJson => {
            if (responseJson.data.success) {
                console.log("responseJson.data.refresh_token", responseJson.data.refresh_token)
                AsyncStorage.multiSet([
                    ["access_token", responseJson.data.access_token],
                    ["refresh_token", responseJson.data.refresh_token],
                    ["session", JSON.stringify(responseJson.data.session)]
                ]).then(success => {
                    console.log("stor succesfully")
                    findUserByPhone(parsePhoneNumberFromString(this.state.phone).format("E.164"))
                        .then(res => {
                            console.log("has password", res.data.users[0].has_password)
                            console.log("social_auth_providers", res.data.users[0].social_auth_providers.length)
                            if (res.data.users[0].has_password === false && res.data.users[0].social_auth_providers.length === 0) {
                                beginPhoneVerification(this.state.phone)
                                    .then(phoneVerificationResponse => {
                                        if (phoneVerificationResponse.data.success) {
                                            this.props.navigation.navigate('Verification', { phone: this.state.phone });
                                        } else {
                                            Alert.alert(" SIGNUP Error 5", "Failed to send phone verification");
                                        }
                                    })
                                    .catch(err => Alert.alert(" SIGNUP Error 4", "Failed to send phone verification. Please check the number"));
                            } else {
                                Alert.alert("Info", "Already verified");
                            }
                        })
                        .catch(err => console.log(" SIGNUPError 3", JSON.stringify(err)));
                }).catch(e => console.log("SIGNUP Error 2", e));
            } else {
                Alert.alert(" SIGNUP Error 1", "Failed to send phone verification");
            }
        }
        ).catch(err => console.log(`err -> ${err}`));
    };

    render() {
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 320 : 400;
        const bottomRowHeight = Layout.isSmallDevice ? 180 : 220;
        const phoneLabelStyle = {
            position: 'absolute',
            left: '12%',
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
        return (
            <Container>
                <Grid>
                    <Row style={{ padding: 40 }}>
                        <Grid style={styles.container}>
                            <Row style={styles.row}>
                                <View style={styles.circle}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="user" type={"light"} size={48} color={"#555555"} />
                                    </View>
                                </View>
                            </Row>
                            <Row style={styles.row}>
                                <Col>
                                    <View style={styles.row}>
                                        <Text style={{
                                            fontFamily: 'open-sans-hebrew-bold',
                                            fontSize: 21,
                                            color: '#555555'
                                        }}>
                                            Let's get you started!
                                        </Text>
                                    </View>
                                </Col>
                            </Row>
                            <Row style={styles.row}>

                                <Col>
                                    <View style={styles.inputContainer}>
                                        <Animated.Text style={phoneLabelStyle}>
                                            Phone number
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
                                                height: 24,
                                                borderBottomColor: (this.state.isPhoneFocused) ? '#287F7E' : '#888888'
                                            }}
                                            textProps={{
                                                onFocus: () => this.onFocusChange("isPhoneFocused"),
                                                onBlur: () => this.onBlurChange("isPhoneFocused")
                                            }}
                                            onChangePhoneNumber={(text) => this.onChangeHandle("phone", this.phone.getValue())}
                                            value={this.state.phone}
                                            onSelectCountry={() => this.onSelectCountry()}
                                        />
                                    </View>
                                </Col>
                            </Row>
                            <Row style={styles.row}>
                                <Col><StyleProvider style={getTheme(material)}>
                                    <Content>
                                        <Button block success
                                            onPress={() => this.sendVerificationCode()}
                                            disabled={!(this.state.phone)}>
                                            <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Send
                                                verification code</Text>
                                        </Button>
                                    </Content>
                                </StyleProvider></Col>
                            </Row>
                        </Grid>
                    </Row>
                    <Row style={{ height: bottomRowHeight }}>
                        <BottomNavigationWithLineArt bottomRowHeight={bottomRowHeight} SignUpRoute={false}
                            navigation={this.props.navigation} />
                    </Row>
                </Grid>

                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#888888'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        borderBottomWidth: 2,
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16
    },
    circle: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
        borderColor: '#555555',
        borderWidth: 2,
    },
    inputContainer: {
        paddingTop: 18
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
