import React from 'react';
import { Alert, NetInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Container, Content, StyleProvider } from 'native-base';
import { Col, Grid, Row } from "react-native-easy-grid";
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import OtpInputs from "../shared/OtpInputs";
import BottomNavigationWithLineArt from "../shared/BottomNavigationWithLineArt";
import { beginPhoneVerification } from "../axios/api";
import { verifyPhone } from "../axios/api";
import Icon from "react-native-fontawesome-pro";
import Layout from './../constants/Layout';

export default class OtpVerificationScreen extends React.Component {
    state = {
        otpInputVal: "",
        isConnected: false,
    };
    static navigationOptions = {
        header: null,
        phone: "",
    };

    otpInputCallback = (values) => {
        console.log(values);
        this.setState({ otpInputVal: values.join("") });
    };

    onVerifyClick = () => {
        verifyPhone(this.state.otpInputVal).then(responseJson => {
            console.log(JSON.stringify(responseJson));
            if (responseJson.data.success) {
                this.props.navigation.navigate('SetCredentials', { phone: this.props.navigation.getParam('phone', '') });
            } else {
                Alert.alert("Error", "Failed to verify");
            }
        }
        ).catch(err => console.log(`err -> ${err}`));
    };

    sendVerificationCode = () => {
        const PHONE = this.props.navigation.getParam('phone', '');
        beginPhoneVerification(PHONE)
            .then(phoneVerificationResponse => {
                if (phoneVerificationResponse.data.success) {
                    Alert.alert(
                        "Info",
                        "Resend OTP successfully");
                } else {
                    Alert.alert("Error", "Failed to send phone verification");
                }
            })
            .catch(err => Alert.alert("Error", "Failed to send phone verification. Please check the number"));
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
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 320 : 400;
        const bottomRowHeight = Layout.isSmallDevice ? 180 : 220;
        const { navigation } = this.props;
        const phone = navigation.getParam('phone', '');
        return (
            <Container>
                <Grid>
                    <Row>
                        <View style={styles.container}>
                            <Row size={2}>
                                <View style={styles.circle}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="user" type={"light"} size={48} color={"#555555"} />
                                    </View>
                                </View>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    <View style={styles.row}>
                                        <Text style={{
                                            fontFamily: 'open-sans-hebrew-bold',
                                            fontSize: 21,
                                            color: '#555555'
                                        }}>
                                            We have sent you code
                                        </Text>
                                    </View>
                                </Col>
                            </Row>
                            <Row size={1} style={styles.lastRow}>
                                <View style={styles.row}>
                                    <Text style={{
                                        fontFamily: 'open-sans-hebrew-bold',
                                        fontSize: 14,
                                        color: '#CCCCCC'
                                    }}>Phone number: </Text>
                                    <Text style={{
                                        fontFamily: 'open-sans-hebrew-bold',
                                        fontSize: 14,
                                        color: '#555555'
                                    }}>{phone}</Text>
                                </View>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    {/*<TextInput
                                        style={styles.textInput}
                                        textContentType={"oneTimeCode"}
                                        onChangeText={(text) => this.setState({text})}
                                    />*/}
                                    <OtpInputs inputCallback={this.otpInputCallback} />
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    {/* <StyleProvider style={getTheme(material)}> */}
                                    <Content>
                                        <TouchableOpacity
                                            // block success
                                            style={{ width: "100%", height: 50, backgroundColor: '#ec696a', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                                            onPress={() => this.onVerifyClick()}
                                            disabled={(this.state.otpInputVal.length < 4)}>
                                            <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>
                                                Verify Phone
                                            </Text>
                                        </TouchableOpacity>
                                    </Content>
                                    {/* </StyleProvider> */}
                                </Col>
                            </Row>
                            <Row size={1} style={styles.lastRow}>
                                <View style={styles.row}>
                                    <Text style={{ color: '#555555' }}>Didn't receive the code? </Text>
                                    <TouchableOpacity onPress={() => { this.sendVerificationCode(), console.log("ResendPrESSD") }}><Text style={{
                                        fontFamily: 'open-sans-hebrew-bold',
                                        color: '#287F7E'
                                    }}>Resend</Text></TouchableOpacity>
                                </View>
                            </Row>
                        </View>
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
        paddingTop: Layout.isSmallDevice ? 40 : 80,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 0,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#888888'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lastRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textInput: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16
    },
    circle: {
        width: 110,
        height: 110,
        borderRadius: 134 / 2,
        borderColor: '#555555',
        borderWidth: 2,
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
