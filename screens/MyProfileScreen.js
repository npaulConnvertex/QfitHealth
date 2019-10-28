import React from 'react';
import {
    Alert,
    NetInfo,
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Container } from 'native-base';
import { Grid, Row } from "react-native-easy-grid";
import { FontAwesome } from '@expo/vector-icons';
// import { ImagePicker } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import { createUserPassword, refreshSession, revokeSession } from "../axios/api";
import { setProfileImageAction } from '../actions/SetProfileImageAction';
import Layout from "../constants/Layout";
import Icon from "react-native-fontawesome-pro";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutAction } from "../actions/LogoutAction";
import { ChannelConnection } from "../channel";
import LoadingAnimation from './../shared/LoadingAnimation';


class MyProfileScreen extends React.Component {
    state = {
        isConnected: false,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        isFirstNameFocused: false,
        isLastNameFocused: false,
        isPasswordFocused: false,
        isPasswordVisible: false,
        googleConnected: false,
        facebookConnected: true,
        userProfile: "",
        user_id: "",
        image: null,
        animation: false
    };

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Profile',
            headerStyle: {
                backgroundColor: '#287F7E', elevation: 0, shadowColor: 'transparent',
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
                height: 50
            },
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew-light',
                fontSize: 20,
                width: '100%',
                color: '#fff'
            },
            headerBackImage: <Icon name="times" type={"solid"} size={20} style={{ padding: 100 }}
                color={"#CCCCCC"} />,
            drawerLockMode: 'locked-closed'
        }
    };

    // onCompleteRegistrationClick = () => {
    //     AsyncStorage.getItem("refresh_token")
    //         .then(refresh_token => {
    //             refreshSession(refresh_token)
    //                 .then(newSessionData => {
    //                     if (newSessionData.data.success) {
    //                         AsyncStorage.multiSet([
    //                             ["access_token", newSessionData.data.access_token],
    //                             ["session", JSON.stringify(newSessionData.data.session)]
    //                         ]).then(success => {
    //                             createUserPassword(this.state.first_name, this.state.last_name, this.state.password).then(responseJson => {
    //                                 if (responseJson.data.success) {
    //                                     this.props.navigation.navigate('Main', { phone: this.props.navigation.getParam('phone', '') });
    //                                 } else {
    //                                     Alert.alert("Error", "Failed to complete profile registration");
    //                                 }
    //                             }
    //                             ).catch(err => console.log(`err -> ${JSON.stringify(err)}`));
    //                         }).catch(e => console.log("Failed to update storage 3"));
    //                     } else {
    //                         Alert.alert("Error", "Failed to refresh session");
    //                     }
    //                 })
    //                 .catch(err => console.log("Failed to refresh session"));
    //         })
    //         .catch(err => console.log("Failed to get refresh token"));
    // };



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

            //Add UploadPresetName
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
                console.log("ProfileStatus", data)
                await AsyncStorage.setItem('image', data.secure_url)
                this.setState({ image: data.secure_url })
                //console.log("data.secure_url", data.secure_url)
                this.props.setProfileImageAction(this.state.userProfile.user_id, data.secure_url)
                this.setState({ animation: false });

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

    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        const image = await AsyncStorage.getItem('image');
        try {
            var data = await AsyncStorage.multiGet(['session'])
            var data1 = data[0][1];
            data3 = JSON.parse(data1);
        } catch (error) {
        }
        this.setState({
            userProfile: data3,
        })
        if (image === null) {
            this.setState({ image: data3.image_id });

        } else {
            this.setState({ image: image })

        }

    }


    logout = async () => {
        await this.props.logoutAction();
        AsyncStorage.clear()
            .then(success => this.props.navigation.navigate('SignIn'))
            .catch(err => console.log("Failed to remove tokens"));

        obj = new ChannelConnection();
        obj.disconnect()

    };

    render() {

        const backgroundImageHeight = Layout.isSmallDevice ? (50 + 134 / 2) : (50 + 134 / 2);
        let { userProfile, image } = this.state;
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
                                    {image != null ? <View style={styles.circle}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: image }}
                                                style={{
                                                    width: Layout.isSmallDevice ? 98 : 132,
                                                    height: Layout.isSmallDevice ? 98 : 132,
                                                    borderRadius: Layout.isSmallDevice ? 98 / 2 : 132 / 2
                                                }}
                                                resizeMode={"cover"} />
                                        </View>
                                    </View> :
                                        <View style={styles.circle}>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <FontAwesome name="camera" size={Layout.isSmallDevice ? 35 : 50}
                                                    color={"rgba(255, 255, 255, 0.7)"} />
                                            </View>
                                        </View>}
                                </TouchableWithoutFeedback>
                            </Row>
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => console.log("pressed")}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="user" type={"solid"} size={19}
                                            color={"rgba(136, 136, 136, 0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Full
                                            Name</Text>
                                        <Text style={styles.textStyle2}>{userProfile.first_name} {userProfile.last_name}</Text>
                                    </View>
                                    <View style={styles.endIconContainer}>
                                        {/*<Icon name="pencil" ty
                                        
                                        ntainer}>
                                    <Text style={styles.greenTextStyle}>Credentials</Text>
                                </View>
                            </Row>
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => console.log("pressed")}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="key" type={"solid"} size={19}
                                              color={"rgba(136, 136, 136, 0.4)"}/>
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Password</Text>
                                        <Text style={styles.textStyle2}>Last modified: 14/07/2018</Text>
                                    </View>
                                    <View style={styles.endIconContainer}>
                                        {/*<Icon name="pencil" type={"solid"}
                                              size={12} color={"#888888"}/>*/}</View>
                                </TouchableOpacity>
                            </Row>
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => console.log("pressed")}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="google" type={"brands"} size={19}
                                            color={"rgba(136, 136, 136, 0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Google
                                            account</Text>
                                        <Text style={styles.textStyle2}>Not Connected</Text>
                                    </View>
                                    <View style={styles.endIconContainer}>
                                        {this.state.googleConnected ? <Icon name="pencil" type={"solid"}
                                            size={20} color={"#888888"} /> : null}</View>
                                </TouchableOpacity>
                            </Row>
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => console.log("pressed")}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="facebook-square" type={"brands"} size={19}
                                            color={"rgba(136, 136, 136, 0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Facebook
                                            account</Text>
                                        <Text style={styles.textStyle2}>Miyuki Shimose</Text>
                                    </View>
                                    {/* <View style={styles.endIconContainer}>
                                        {this.state.facebookConnected ? <Icon name="trash" type={"solid"}
                                                                              size={20}
                                                                              color={"#888888"}/> : null}</View> */}
                                </TouchableOpacity>
                            </Row>
                            <Row size={0.5} style={{ justifyContent: 'flex-start' }}>
                                <View style={styles.greenTextContainer}>
                                    <Text style={styles.greenTextStyle}>Settings</Text>
                                </View>
                            </Row>
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => console.log("pressed")}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="language" type={"solid"} size={19}
                                            color={"rgba(136, 136, 136, 0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Language</Text>
                                        <Text style={styles.textStyle2}>English</Text>
                                    </View>
                                    <View style={styles.endIconContainer}>
                                        {/*<Icon name="pencil" type={"solid"}
                                              size={12} color={"#888888"}/>*/}</View>
                                </TouchableOpacity>
                            </Row>
                            {/* <Row size={0.2}>
                                <View style={styles.rowStyle2}>
                                    <View style={styles.hairline}/>
                                </View>
                            </Row> */}
                            <Row size={1}>
                                <TouchableOpacity style={styles.rowStyle1} onPress={() => this.logout()}>
                                    <View style={styles.mainIconContainer}>
                                        <Icon name="sign-out" type={"solid"} size={19}
                                            color={"rgba(136, 136, 136, 0.4)"} />
                                    </View>
                                    <View style={styles.centerTextContainer}>
                                        <Text style={styles.textStyle1}>Logout</Text>
                                        {/* <Text style={styles.textStyle2}>Secondary Line</Text> */}
                                    </View>
                                    <View style={styles.endIconContainer}>
                                    </View>
                                </TouchableOpacity>
                            </Row>
                        </View>
                    </Row>
                    {/*<Row style={{height: bottomRowHeight}}>
                        <Grid>
                            <View style={styles.container}>

                            </View>
                        </Grid>
                    </Row>*/}
                </Grid>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </Container>
        );
    }
}
const mapStateToProps = (state) => (
    {
        ProfileImage: state.getBusinessByAliases.ProfileImage,
        // ProfileImageError: state.getBusinessByAliases.ProfileImageError,
        // pendingProfileImage: state.getBusinessByAliases.pendingProfileImage,
        //defaultnullProfileImage: state.getBusinessByAliases.defaultnullProfileImage,

    })
const mapDispatchToProps = (dispatch) => (
    bindActionCreators({ logoutAction, setProfileImageAction }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20
    },
    rowStyle2: {
        flex: 1, flexDirection: 'row', alignItems: 'center'
    },
    mainIconContainer: { flex: 1, justifyContent: 'center' },
    endIconContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
    centerTextContainer: { flex: 5, justifyContent: 'center' },
    textStyle1: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#000000' },
    textStyle2: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    },
    greenTextStyle: {
        fontFamily: 'open-sans-hebrew-bold',
        color: '#287F7E',
        fontSize: 14
    },
    greenTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    hairline: {
        backgroundColor: 'rgba(136, 136, 136, 0.4)',
        height: 1,
        width: Layout.window.width - 40
    },
    circle: {
        width: Layout.isSmallDevice ? 100 : 134,
        height: Layout.isSmallDevice ? 100 : 134,
        borderRadius: Layout.isSmallDevice ? 100 / 2 : 134 / 2,
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
