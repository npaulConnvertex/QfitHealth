import React, { Fragment } from 'react';
import {
    NetInfo,
    Alert,
    Animated,
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Grid, Row } from "react-native-easy-grid";
import { Button, Content, StyleProvider } from 'native-base';
import { Button as EleButton, SocialIcon } from 'react-native-elements';
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import PhoneInput from "react-native-phone-input";
import { FontAwesome } from '@expo/vector-icons';
import { newSessionPassword, createSocialUser, newSessionSocial } from "../axios/api";
import Layout from './../constants/Layout';
import * as Facebook from 'expo-facebook';
import { AsYouType } from "libphonenumber-js";
import BottomNavigationWithLineArt from "../shared/BottomNavigationWithLineArt";
import LoadingAnimation from './../shared/LoadingAnimation';
import { ChannelConnection } from "../channel";
import * as Localization from 'expo-localization';
import * as Google from 'expo-google-app-auth';

export default class SignInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        isConnected: false,
        phone: "",
        password: "",
        isPhoneFocused: false,
        isPasswordFocused: false,
        isPasswordVisible: false,
        user: null,
        animation: false
    };

    componentWillMount() {
        this._animatedPasswordIsFocused = new Animated.Value(0);
        this._animatedPhoneIsFocused = new Animated.Value(0);
    }

    componentDidMount() {
        console.log("Localization.region", Localization.region)
        // this.initAsync();
        obj = new ChannelConnection();
        obj.connect()
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
        Animated.timing(this._animatedPasswordIsFocused, {
            toValue: (this.state.isPasswordFocused || this.state.password !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedPhoneIsFocused, {
            toValue: (this.state.isPhoneFocused || this.state.phone !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }

    render() {
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 320 : 400;
        const bottomRowHeight = Layout.isSmallDevice ? 180 : 220;
        const logoWidth = Layout.window.width - 80;
        const hairlineWidth = (Layout.window.width - 100) / 2;
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
        const passwordLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedPasswordIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedPasswordIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedPasswordIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };
        const iconStyle = {
            position: 'absolute',
            right: 0,
            top: 18,
        };
        console.log("Localization.region", Localization.region)
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                {this.state.animation &&
                    <LoadingAnimation visible={this.state.animation} />
                }
                <View style={{ height: topRowHeight, marginTop: Layout.isSmallDevice ? 20 : 40, flex: 0 }}>
                    <Grid>
                        <Row style={styles.row}>
                            <View style={{ height: topRowHeight / 2 }}>
                                <Image resizeMode={"contain"} style={{ height: topRowHeight / 2, width: logoWidth }}
                                    source={require('./../assets/images/logo_dark.png')} />
                            </View>
                        </Row>
                    </Grid>
                </View>
                <View style={{
                    height: middleRowHeight,
                    width: '100%',
                    flex: 0,
                    paddingLeft: 40,
                    paddingRight: 40,
                }}>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <View style={{ height: 30 }}>
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
                        </View>
                        <View style={{ height: 30 }}>
                            <View style={styles.inputContainer}>
                                <Animated.Text style={passwordLabelStyle}>
                                    Password
                                </Animated.Text>
                                <TextInput
                                    style={[styles.textInput, (this.state.isPasswordFocused) ? {
                                        borderBottomColor: '#287F7E',
                                    } : { borderBottomColor: '#888888' }]}
                                    secureTextEntry={!this.state.isPasswordVisible}
                                    onFocus={() => this.onFocusChange("isPasswordFocused")}
                                    onBlur={() => this.onBlurChange("isPasswordFocused")}
                                    onChangeText={(text) => this.onChangeHandle("password", text)}
                                />
                                <TouchableWithoutFeedback
                                    hitSlop={{ top: 40, left: 40, bottom: 40, right: 40 }}
                                    pressRetentionOffset={{ top: 40, left: 40, bottom: 40, right: 40 }}
                                    style={[iconStyle, { width: 20, height: '100%' }]}
                                    onPress={() => this.setState((prevState) => ({ isPasswordVisible: !prevState.isPasswordVisible }))}>
                                    {this.state.isPasswordVisible ? <FontAwesome
                                        name='eye-slash'
                                        color='rgba(0,0,0,0.38)'
                                        size={17}
                                        style={[iconStyle]}
                                    /> : <FontAwesome
                                            name='eye'
                                            color='rgba(0,0,0,0.38)'
                                            size={17}
                                            style={[iconStyle]}
                                        />}
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{ height: 45, marginTop: 10 }}>
                            <StyleProvider style={getTheme(material)}>
                                <Content>
                                    <Button block success onPress={() => this.signInWithPassword()}
                                        disabled={!(this.state.phone && this.state.password)}>
                                        <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>Sign
                                            in</Text>
                                    </Button>
                                </Content>
                            </StyleProvider>
                        </View>
                        <View style={{ height: 20 }}>
                            <View style={styles.row}>
                                <Text style={{ fontFamily: 'open-sans-hebrew', color: '#555555', fontSize: 13 }}>Forgot
                                    your login details? </Text>
                                <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#287F7E', fontSize: 13 }}>Get
                                    help sign
                                    in</Text>
                            </View>
                        </View>
                        <View style={{ height: 15 }}>
                            <View style={styles.row}>
                                <View style={{
                                    backgroundColor: 'rgba(0,0,0, 0.38)',
                                    height: 1,
                                    width: hairlineWidth
                                }} />
                                <Text style={styles.loginButtonBelowText1}>OR</Text>
                                <View style={{
                                    backgroundColor: 'rgba(0,0,0, 0.38)',
                                    height: 1,
                                    width: hairlineWidth
                                }} />
                            </View>
                        </View>
                        {!Layout.isSmallDevice ? (<Fragment>
                            <View style={{ height: 45 }}>
                                <SocialIcon
                                    title='Continue with Facebook'
                                    button
                                    type='facebook'
                                    style={{ borderRadius: 5, minHeight: 50 }}
                                    onPress={() => this.facebookLogIn()}
                                />
                            </View>
                            <View style={{ height: 45 }}>
                                <EleButton
                                    buttonStyle={{
                                        margin: 7,
                                        borderRadius: 5, backgroundColor: '#E7E7E7', paddingTop: 14,
                                        paddingBottom: 14,
                                    }}
                                    titleStyle={{
                                        fontFamily: 'open-sans-hebrew-bold',
                                        fontSize: 13,
                                        color: '#333333',
                                        marginLeft: 15
                                    }}
                                    icon={
                                        <Image resizeMode={"center"} style={{ height: 20, width: 20 }}
                                            source={require('./../assets/images/200px-Google__G__Logo.svg.png')} />
                                    }
                                    title="Continue with Google"
                                    onPress={() => this.onGoogleSignIn()}
                                />
                            </View>
                        </Fragment>) : (<View style={{ height: 45 }}>
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <SocialIcon
                                        title='Facebook'
                                        button
                                        type='facebook'
                                        style={{ borderRadius: 5, minHeight: 50 }}
                                        onPress={() => this.facebookLogIn()}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <EleButton
                                        buttonStyle={{
                                            margin: 7,
                                            borderRadius: 5, backgroundColor: '#E7E7E7', paddingTop: 14,
                                            paddingBottom: 14,
                                        }}
                                        titleStyle={{
                                            fontFamily: 'open-sans-hebrew-bold',
                                            fontSize: 13,
                                            color: '#333333',
                                            marginLeft: 15
                                        }}
                                        icon={
                                            <Image resizeMode={"center"} style={{ height: 24, width: 24 }}
                                                source={require('./../assets/images/200px-Google__G__Logo.svg.png')} />
                                        }
                                        title="Google"
                                        onPress={() => this.onGoogleSignIn()}
                                    />
                                </View>
                            </View>
                        </View>)}
                    </View>
                </View>
                <View style={{ height: bottomRowHeight }}>
                    <BottomNavigationWithLineArt bottomRowHeight={bottomRowHeight} SignUpRoute={true}
                        navigation={this.props.navigation} />
                </View>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        );
    }

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

    signInWithPassword = () => {
        console.log(this.state);
        console.log(this.phone.getValue());
        this.setState({ animation: true });
        newSessionPassword(this.state.phone, this.state.password).then(responseJson => {
            if (responseJson.data.success) {
                this.setState({ animation: false });
                AsyncStorage.multiSet([
                    ["access_token", responseJson.data.access_token],
                    ["refresh_token", responseJson.data.refresh_token],
                    ["session", JSON.stringify(responseJson.data.session)]
                ]).then(success => this.props.navigation.navigate('Main'), { phone: this.state.phone }).catch(e => console.log(e));

            } else {
                Alert.alert("Error", "Invalid Credentials");
                this.setState({ animation: false });
            }
        }
        ).catch(err => {
            Alert.alert("Error", "Invalid Credentials");
            this.setState({ animation: false });
        });
    };

    // initAsync = async () => {
    //     await GoogleSignIn.initAsync({
    //         clientId: '<YOUR_IOS_CLIENT_ID>',
    //     });
    //     this._syncUserWithStateAsync();
    // };

    // _syncUserWithStateAsync = async () => {
    //     const user = await GoogleSignIn.signInSilentlyAsync();
    //     this.setState({ user });
    // };

    // signOutAsync = async () => {
    //     await GoogleSignIn.signOutAsync();
    //     this.setState({ user: null });
    // };

    // signInAsync = async () => {
    //     try {
    //         await GoogleSignIn.askForPlayServicesAsync();
    //         const { type, user } = await GoogleSignIn.signInAsync();
    //         if (type === 'success') {
    //             this._syncUserWithStateAsync();
    //         }
    //     } catch ({ message }) {
    //         alert('login: Error:' + message);
    //     }
    // };

    onGoogleSignIn = async () => {
        console.log("test")
        Alert.alert("Not implemented")
        // try {
        //     //const clientId = "77705969140-7u1i1d27r0i1m1u2mo7gq0f1fe6p2fv2.apps.googleusercontent.com";
        //     const { type, accessToken, user } = await Google.logInAsync({
        //         androidClientId: '77705969140-7u1i1d27r0i1m1u2mo7gq0f1fe6p2fv2.apps.googleusercontent.com',
        //         iosClientId: '77705969140-g7hhg00rpuinm1je3800s7g6r7o6bb0i.apps.googleusercontent.com',
        //         scopes: ["profile", "email"]
        //     });
        //     console.log("type, accessToken, user", type, accessToken, user)
        //     if (type === 'success') {
        //         this.setState({ animation: true });
        //         await newSessionSocial("google", accessToken).then(res => {
        //             console.log("res", JSON.stringify(res))
        //             if (responseJson.data.success) {
        //                 this.setState({ animation: false });
        //                 AsyncStorage.multiSet([
        //                     ["access_token", responseJson.data.access_token],
        //                     ["refresh_token", responseJson.data.refresh_token],
        //                     ["session", JSON.stringify(responseJson.data.session)],
        //                     ["provider", 'google']
        //                 ]).then(success => this.props.navigation.navigate('Main')).catch(e => console.log(e));

        //             } else {
        //                 Alert.alert("Error", "Invalid Credentials");
        //                 this.setState({ animation: false });
        //             }
        //         })
        //             .catch(err => {
        //                 Alert.alert("Error", " test Invalid Credentials");
        //                 this.setState({ animation: false });
        //             })

        //     }


        // } catch (e) {
        //     Alert.alert(e.toString())

        // }
    };

    facebookLogIn = async () => {
        console.log("Test");
        try {

            //867091977024755
            //418385385324704

            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync('867091977024755', {
                permissions: ["email", "public_profile", "user_friends"],
            });
            // Alert.alert("hi")
            console.log("details", type, token, permissions, expires);
            if (type === 'success') {
                this.setState({ animation: true });
                await newSessionSocial("facebook", token).then(responseJson => {
                    console.log("res", JSON.stringify(responseJson))
                    if (responseJson.data.success) {
                        this.setState({ animation: false });
                        AsyncStorage.multiSet([
                            ["access_token", responseJson.data.access_token],
                            ["refresh_token", responseJson.data.refresh_token],
                            ["session", JSON.stringify(responseJson.data.session)],
                            ["provider", 'facebook']
                        ]).then(success => this.props.navigation.navigate('Main')).catch(e => console.log(e));

                    } else {
                        Alert.alert("Error", "Invalid Credentials");
                        this.setState({ animation: false });
                    }
                })
                    .catch(err => {
                        Alert.alert("Error", "Invalid Credentials");
                        this.setState({ animation: false });

                    })

            } else {

            }



        } catch ({ error, message }) {
            console.log(JSON.stringify(error), message);
            alert(`Facebook Login Error: ${JSON.stringify(message)}`);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '0px 40px 0 40px',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        height: 24,
        borderBottomWidth: 2,
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16
    },
    hairline: {
        backgroundColor: 'rgba(0,0,0, 0.38)',
        height: 1,
        width: 165
    },
    loginButtonBelowText1: {
        fontSize: 14,
        paddingHorizontal: 5,
        alignSelf: 'center',
        color: 'rgba(0,0,0, 0.38)'
    },
    bottomRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: '#CCCCCC',
        borderTopWidth: 1
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
