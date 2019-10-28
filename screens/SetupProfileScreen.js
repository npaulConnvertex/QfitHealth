import React from 'react';
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
import { Button, Container, Content, StyleProvider } from 'native-base';
import { Col, Grid, Row } from "react-native-easy-grid";
import { FontAwesome } from '@expo/vector-icons';
// import { ImagePicker } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import BottomNavigationWithLineArt from "../shared/BottomNavigationWithLineArt";
import { createUserPassword, refreshSession } from "../axios/api";
import Layout from "../constants/Layout";
import LoadingAnimation from './../shared/LoadingAnimation';


export default class SetupProfileScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        isConnected: false,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        isFirstNameFocused: false,
        isLastNameFocused: false,
        isPasswordFocused: false,
        image: null,
        isPasswordVisible: false,
        animation: false
    };


    onCompleteRegistrationClick = async () => {
        this.setState({ animation: true });
        await AsyncStorage.getItem("refresh_token")
            .then(refresh_token => {
                console.log("refresh_token", refresh_token)
                refreshSession(refresh_token)
                    .then(async (newSessionData) => {
                        console.log("newSessionData", JSON.stringify(newSessionData))
                        if (newSessionData.data.success) {
                            await AsyncStorage.multiSet([
                                ["access_token", newSessionData.data.access_token],
                                ["session", JSON.stringify(newSessionData.data.session)]
                            ]).then(success => {
                                createUserPassword(this.state.first_name, this.state.last_name, this.state.password, this.state.image).then(responseJson => {
                                    if (responseJson.data.success) {
                                        this.setState({ animation: false })
                                        Alert.alert("Signup Successfully...")
                                        this.props.navigation.navigate('SignIn')
                                    } else {
                                        Alert.alert("Error", "Failed to complete profile registration");
                                    }
                                }
                                ).catch(err => {
                                    console.log(`err -> ${JSON.stringify(err)}`);
                                    this.setState({ animation: false })
                                });
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
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });
        if (!result.cancelled) {
            this.setState({ animation: true });
            let base64Img = `data:image/jpg;base64,${result.base64}`

            //Add your cloud name
            let apiUrl = 'https://api.cloudinary.com/v1_1/connvertex/image/upload';


            let data = {
                "file": base64Img,
                "upload_preset": "Connvertex@123",
            }
            fetch(apiUrl, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json();
                console.log("ProfileSTATUS", data)
                this.setState({ image: data.secure_url });
                this.setState({ animation: false });
                //console.log("data.secure_url", data.secure_url)
            }).catch(err => console.log(err))

        }
    };

    onChangeHandle = (field, value) => {
        this.setState({
            [field]: value
        })
    };

    onFocusChange = (field) => {
        this.setState({ [field]: true });
    };

    onBlurChange = (field) => {
        this.setState({ [field]: false });
    };

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

    componentWillMount() {
        this._animatedPasswordIsFocused = new Animated.Value(0);
        this._animatedFirstNameIsFocused = new Animated.Value(0);
        this._animatedLastNameIsFocused = new Animated.Value(0);
    }

    componentDidUpdate() {
        Animated.timing(this._animatedPasswordIsFocused, {
            toValue: (this.state.isPasswordFocused || this.state.password !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedFirstNameIsFocused, {
            toValue: (this.state.isFirstNameFocused || this.state.first_name !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedLastNameIsFocused, {
            toValue: (this.state.isLastNameFocused || this.state.last_name !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }

    render() {
        const topRowHeight = Layout.isSmallDevice ? 60 : 80;
        const middleRowHeight = Layout.isSmallDevice ? 320 : 400;
        const bottomRowHeight = Layout.isSmallDevice ? 180 : 220;
        const backgroundImageHeight = Layout.isSmallDevice ? (40 + 134 / 2) : (80 + 134 / 2);
        let { image, first_name, last_name, password } = this.state;
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
        const firstNameLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedFirstNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedFirstNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedFirstNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };
        const lastNameLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedLastNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedLastNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedLastNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };
        const iconStyle = {
            position: 'absolute',
            right: 0,
            top: 18,
        };

        return (
            <Container>
                {this.state.animation &&
                    <LoadingAnimation visible={this.state.animation} />
                }
                <Image source={require('./../assets/images/GreenBackground.png')} style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    width: '100%',
                    height: backgroundImageHeight
                }} resizeMode={"stretch"} />
                <Grid>
                    <Row>
                        <View style={styles.container}>
                            <Row size={2}>
                                <TouchableWithoutFeedback onPress={this._pickImage}>
                                    {image !== null ? <View style={styles.circle}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: image }}
                                                style={{ width: 132, height: 132, borderRadius: 132 / 2 }}
                                                resizeMode={"cover"} />
                                        </View>
                                    </View> :
                                        <View style={styles.circle}>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <FontAwesome name="camera" size={50}
                                                    color={"rgba(255, 255, 255, 0.7)"} />
                                            </View>
                                        </View>}
                                </TouchableWithoutFeedback>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    <View style={styles.row}>
                                        <Text style={{
                                            fontFamily: 'open-sans-hebrew-bold',
                                            fontSize: 21,
                                            color: '#555555'
                                        }}>
                                            Set your profile
                                        </Text>
                                    </View>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col>
                                    <View style={styles.inputContainer}>
                                        <Animated.Text style={firstNameLabelStyle}>
                                            First name
                                        </Animated.Text>
                                        <TextInput
                                            style={[styles.textInput, (this.state.isFirstNameFocused) ? {
                                                borderBottomColor: '#287F7E',
                                            } : { borderBottomColor: '#888888' }]}
                                            onFocus={() => this.onFocusChange("isFirstNameFocused")}
                                            onBlur={() => this.onBlurChange("isFirstNameFocused")}
                                            onChangeText={(text) => this.onChangeHandle("first_name", text)}
                                        />
                                    </View>
                                </Col>
                                <Col style={{ width: 10 }}>
                                </Col>
                                <Col>
                                    <View style={styles.inputContainer}>
                                        <Animated.Text style={lastNameLabelStyle}>
                                            Last name
                                        </Animated.Text>
                                        <TextInput
                                            style={[styles.textInput, (this.state.isLastNameFocused) ? {
                                                borderBottomColor: '#287F7E',
                                            } : { borderBottomColor: '#888888' }]}
                                            onFocus={() => this.onFocusChange("isLastNameFocused")}
                                            onBlur={() => this.onBlurChange("isLastNameFocused")}
                                            onChangeText={(text) => this.onChangeHandle("last_name", text)}
                                        />
                                    </View>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Col>
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
                                </Col>
                            </Row>
                            <Row size={1} style={styles.lastRow}>
                                <Col><StyleProvider style={getTheme(material)}>
                                    <Content>
                                        <Button
                                            onPress={() => this.onCompleteRegistrationClick()}
                                            disabled={first_name.length === 0 || last_name.length === 0 || password.length === 0}
                                            block
                                            success={!(first_name.length === 0 || last_name.length === 0 || password.length === 0)}
                                        >
                                            <Text style={{ fontFamily: 'open-sans-hebrew-bold', color: '#fff' }}>
                                                Complete registration
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
        fontSize: 16,
        height: 24
    },
    circle: {
        width: 134,
        height: 134,
        borderRadius: 134 / 2,
        backgroundColor: '#CCCCCC',
        borderColor: '#fff',
        borderWidth: 2,
        elevation: 4,
        shadowColor: '#888888',
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        },
    },
    passwordContainer: {
        flexDirection: 'row'
    },
    inputStyle: {
        flex: 1,
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
