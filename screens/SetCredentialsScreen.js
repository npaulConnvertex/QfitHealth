import React, { Fragment } from 'react';
import { Image, NetInfo, StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { Button, Container, Content, StyleProvider, Toast } from 'native-base';
import { Col, Grid, Row } from "react-native-easy-grid";
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import { Button as EleButton, SocialIcon } from "react-native-elements";
import BottomNavigationWithLineArt from "../shared/BottomNavigationWithLineArt";
import Icon from "react-native-fontawesome-pro";
import Layout from './../constants/Layout';
import { refreshSession, createSocialUser, callApi } from "../axios/api";
// import * as Localization from 'expo-localization';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';



export default class SetCredentialsScreen extends React.Component {
    state = {
        isConnected: false,
    }
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        const { navigation } = this.props;
        const phone = navigation.getParam('phone', '');
        // const data = await AsyncStorage.getItem("refresh_token");
        // console.log("dataaaa", data)
        setTimeout(() => {
            Toast.show({
                text: `${phone} verified!`,
                position: "top",
                textStyle: { fontFamily: 'open-sans-hebrew-bold', color: '#fff', textAlign: 'center' },
                type: "success",
                duration: 3000,
                style: { backgroundColor: '#287F7E', marginTop: 20 }
            })
        }, 100);
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

    /*
    * @TODO
    *   Implement Google and Facebook Sign up
    * */
    onFacebookSignUp = async () => {

        console.log("Test");
        const refresh_token = await AsyncStorage.getItem("refresh_token");
        //console.log("dataaaa", refresh_token)
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

            console.log("details", type, token, permissions, expires);
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,first_name,last_name,birthday,picture.type(large)`);
                // console.log(`${JSON.stringify(await response.json())}!`);

                await AsyncStorage.getItem("refresh_token")
                    .then(refresh_token => {
                        //console.log("refresh_token", refresh_token)
                        refreshSession(refresh_token)
                            .then(async (newSessionData) => {
                                //console.log("newSessionData", JSON.stringify(newSessionData))
                                if (newSessionData.data.success) {
                                    // console.log(newSessionData.data.success)
                                    await AsyncStorage.multiSet([
                                        ["access_token", newSessionData.data.access_token],
                                        ["session", JSON.stringify(newSessionData.data.session)]
                                    ]).then(async () => {
                                        this.createSocialAccount(response, token);

                                    }).catch(e => {
                                        console.log("Failed to update storage 4", JSON.stringify(e));
                                        this.setState({ animation: false })
                                    });
                                } else {
                                    Alert.alert("Error", "Failed to refresh session 1");
                                    this.setState({ animation: false })
                                }
                            })
                            .catch(err => console.log("Failed to refresh session 2", JSON.stringify(err)));
                    })
                    .catch(err => console.log("Failed to get refresh token"));







                //this.props.navigation.navigate('Main');
                /*
                * @TODO
                *   Call Social Login API
                * */
                //Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            } else {
                // type === 'cancel'
            }
        } catch ({ error, message }) {
            console.log(JSON.stringify(error), message);
            alert(`Facebook Login Error: ${JSON.stringify(message)}`);
        }
    }


    createSocialAccount = async (response, token) => {
        console.log("============================\n\n")
        console.log("token", token)
        console.log("============================\n\n")
        var details = await response.json();
        console.log("details", details);
        console.log(details.name)
        console.log("============================\n\n")
        console.log("============================\n\n")

        await createSocialUser(details.first_name, details.last_name, details.picture.data.url, details.email, 'facebook', token).then(responseJson => {
            if (responseJson.data.success) {
                this.setState({ animation: false })
                Alert.alert("Signup Successfully...")
                this.props.navigation.navigate('SignIn')
            } else {
                console.log(Alert.alert("Error", "Failed to complete profile registration"))
            }
        }).catch(err => {
            console.log(`err -> ${JSON.stringify(err)}`);
            this.setState({ animation: false })
        });
    }

    onGoogleSignUp = async () => {
        console.log("test")
        Alert.alert("Not Implemented")
        // const [access_token, refresh_token] = await AsyncStorage.multiGet(['access_token', 'refresh_token']);

        // console.log("=================================\n=================================\n=================================\n")

        // try {
        //     //con+st clientId = "77705969140-7u1i1d27r0i1m1u2mo7gq0f1fe6p2fv2.apps.googleusercontent.com";
        //     const { type, accessToken, user } = await Google.logInAsync({
        //         androidClientId: '77705969140-7u1i1d27r0i1m1u2mo7gq0f1fe6p2fv2.apps.googleusercontent.com',
        //         iosClientId: '77705969140-g7hhg00rpuinm1je3800s7g6r7o6bb0i.apps.googleusercontent.com',
        //         scopes: ["profile", "email"]
        //     });
        //     console.log("GOOGLE ACCOUNT LOG type, accessToken, user", type, accessToken, user)
        //     console.log("REFRESH TOKEN [access_token, refresh_token]", [access_token, refresh_token])
        //     // const google_token = accessToken;
        //     // console.log("google_token", google_token)

        //     console.log("=================================\n=================================\n=================================\n")

        //     if (type === 'success') {
        //         this.setState({ animation: true });

        //         await AsyncStorage.getItem("refresh_token")
        //             .then(refresh_token => {
        //                 console.log("refresh_token", refresh_token)
        //                 refreshSession(refresh_token)
        //                     .then(async (newSessionData) => {
        //                         console.log("newSessionData", JSON.stringify(newSessionData))
        //                         if (newSessionData.data.success) {
        //                             await AsyncStorage.multiSet([
        //                                 ["access_token", newSessionData.data.access_token],
        //                                 ["session", JSON.stringify(newSessionData.data.session)]
        //                             ]).then(async (success) => {

        //                                 // const [access_token, refresh_token] = await AsyncStorage.multiGet(['access_token', 'refresh_token']);
        //                                 // console.log("aaaaaa [access_token, refresh_token]", [access_token, refresh_token])


        //                                 this.googleSignUpRestOfWorkApi(user, accessToken)

        //                                 // createSocialUser(user.givenName, user.familyName, user.photoUrl, user.email, 'google', google_token)
        //                                 //     .then(responseJson => {
        //                                 //         if (responseJson.data.success) {
        //                                 //             this.setState({ animation: false })
        //                                 //             Alert.alert("Signup Successfully...")
        //                                 //             this.props.navigation.navigate('SignIn')
        //                                 //             //this.props.navigation.navigate('Main', {phone: this.props.navigation.getParam('phone', '')});
        //                                 //         } else {
        //                                 //             Alert.alert("Error", "Failed to complete profile registration");
        //                                 //         }
        //                                 //     }
        //                                 //     ).catch(err => {
        //                                 //         console.log(`err -> ${JSON.stringify(err)}`);
        //                                 //         this.setState({ animation: false })
        //                                 //     });



        //                             }).catch(e => {
        //                                 console.log("Failed to update storage 4", JSON.stringify(e));
        //                                 this.setState({ animation: false })
        //                             });
        //                         } else {
        //                             Alert.alert("Error", "Failed to refresh session 1");
        //                             this.setState({ animation: false })
        //                         }
        //                     })
        //                     .catch(err => console.log("Failed to refresh session 2", JSON.stringify(err)));
        //             })
        //             .catch(err => console.log("Failed to get refresh token"));
        //     } else {
        //         console.warn("No Done")
        //     }
        // } catch (e) {
        //     Alert.alert(e.toString())

        // }
    }


    googleSignUpRestOfWorkApi(user, accessToken) {
        console.log("============================\n\n")
        // console.log("token", token)
        console.log("token", accessToken)
        console.log("user", user)
        console.log("============================\n\n")

        const google_token = accessToken;
        console.log("google_token", google_token)
        if (type === 'success') {
            this.setState({ animation: true });
            // await AsyncStorage.getItem("refresh_token")
            //     .then(refresh_token => {
            //         console.log("refresh_token", refresh_token)
            //         refreshSession(refresh_token)
            //             .then(async (newSessionData) => {
            //                 console.log("newSessionData", JSON.stringify(newSessionData))
            //                 if (newSessionData.data.success) {
            //                     await AsyncStorage.multiSet([
            //                         ["access_token", newSessionData.data.access_token],
            //                         ["session", JSON.stringify(newSessionData.data.session)]
            //                     ]).then(async (success) => {
            //                         const [access_token, refresh_token] = await AsyncStorage.multiGet(['access_token', 'refresh_token']);
            //                         console.log("aaaaaa [access_token, refresh_token]", [access_token, refresh_token])
            //                         createSocialUser(user.givenName, user.familyName, user.photoUrl, user.email, 'google', google_token)
            //                             .then(responseJson => {
            //                                 if (responseJson.data.success) {
            //                                     this.setState({ animation: false })
            //                                     Alert.alert("Signup Successfully...")
            //                                     this.props.navigation.navigate('SignIn')
            //                                     //this.props.navigation.navigate('Main', {phone: this.props.navigation.getParam('phone', '')});
            //                                 } else {
            //                                     Alert.alert("Error", "Failed to complete profile registration");
            //                                 }
            //                             }
            //                             ).catch(err => {
            //                                 console.log(`err -> ${JSON.stringify(err)}`);
            //                                 this.setState({ animation: false })
            //                             });
            //                     }).catch(e => {
            //                         console.log("Failed to update storage 4", JSON.stringify(e));
            //                         this.setState({ animation: false })
            //                     });
            //                 } else {
            //                     Alert.alert("Error", "Failed to refresh session 1");
            //                     this.setState({ animation: false })
            //                 }
            //             })
            //             .catch(err => console.log("Failed to refresh session 2", JSON.stringify(err)));
            //     })
            //     .catch(err => console.log("Failed to get refresh token"));
        } else {
            ///console.warn("No Done")
            console.warn("No Done")
        }
    }



    render() {
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 320 : 400;
        const bottomRowHeight = Layout.isSmallDevice ? 180 : 220;
        const hairlineWidth = (Layout.window.width - 100) / 2;
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
                                            Almost there!
                                        </Text>
                                    </View>
                                </Col>
                            </Row>
                            <Row size={1} style={styles.lastRow}>
                                <View style={styles.row}>
                                    <Text style={{
                                        fontFamily: 'open-sans-hebrew',
                                        fontSize: 14,
                                        color: '#555555'
                                    }}>How would you like to sign in?</Text>
                                </View>
                            </Row>
                            {!Layout.isSmallDevice ? (<Fragment><Row>
                                <Col><SocialIcon
                                    title='Continue with Facebook'
                                    button
                                    type='facebook'
                                    style={{ borderRadius: 5 }}
                                    onPress={() => this.onFacebookSignUp()}
                                /></Col>
                            </Row>
                                <Row>
                                    <Col>
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
                                            onPress={() => this.onGoogleSignUp()}
                                        />
                                    </Col>
                                </Row></Fragment>) : (
                                    <Row>
                                        <Col>
                                            <SocialIcon
                                                title='Facebook'
                                                button
                                                type='facebook'
                                                style={{ borderRadius: 5 }}
                                                onPress={() => this.onFacebookSignUp()}
                                            />
                                        </Col>
                                        <Col>
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
                                                onPress={() => this.onGoogleSignUp()} />
                                        </Col>
                                    </Row>
                                )}
                            <Row style={styles.row}>
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
                            </Row>
                            <Row size={1} style={styles.lastRow}>
                                <Col><StyleProvider style={getTheme(material)}>
                                    <Content>
                                        <Button block success bordered
                                            onPress={() => this.props.navigation.navigate('SetupProfile', { phone: phone })}>
                                            <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#EC696A' }}>
                                                Using password
                                            </Text>
                                        </Button>
                                    </Content>
                                </StyleProvider></Col>
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
    loginButtonBelowText1: {
        fontSize: 14,
        paddingHorizontal: 5,
        alignSelf: 'center',
        color: 'rgba(0,0,0, 0.38)'
    },
    circle: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
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
