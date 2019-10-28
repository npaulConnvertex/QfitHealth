import React, { Component } from 'react';
import { NetInfo, Animated, StyleSheet, TextInput, View, Text } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import { Button as EleButton } from "react-native-elements";
import ColorPalette from "../components/ColorPalette";

export default class AddServiceScreen extends Component {
    state = {
        isConnected: false,
        name: '',
        serviceDuration: '',
        servicePrice: '',
        serviceColor: '#D50000',
        isServiceNameFocused: false,
        isServiceDurationFocused: false,
        isServicePriceFocused: false,
        colors: ['#D50000', '#E67C73', '#F4511E', '#F6BF26', '#33B679', '#0B8043', '#039BE5', '#3F51B5', '#7986CB', '#8E24AA', '#616161', '#333333'],
    };
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'New Service',
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
                color={"#CCCCCC"} />,
            headerRight: <EleButton title={"Add"} raised
                titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 11 }}
                buttonStyle={{ backgroundColor: '#EC696A', width: 65, height: 27 }}
                containerStyle={{ marginRight: 10 }}
                onPress={() => {
                    navigation.state.params.addServiceCallback(navigation.getParam("name", ""), navigation.getParam("serviceColor", ""),
                        navigation.getParam("serviceDuration", ""), navigation.getParam("servicePrice", ""));
                    navigation.pop(1);

                }}
                disabled={navigation.getParam("name", "").length === 0 || navigation.getParam("serviceDuration", "").length === 0 || navigation.getParam("servicePrice", "").length === 0}>
            </EleButton>

        }
    };
    onChangeHandle = (field, value) => {
        if (field === 'name') {
            this.props.navigation.setParams({ name: value });
            this.setState({
                [field]: value
            })
        } else if (field === 'serviceDuration') {
            this.props.navigation.setParams({ serviceDuration: value });
            this.setState({
                [field]: value
            })
        } else if (field === 'servicePrice') {
            this.props.navigation.setParams({ servicePrice: value });
            this.setState({
                [field]: value
            })
        }
        else if (field === 'serviceColor') {
            this.props.navigation.setParams({ serviceColor: value });
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

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        if (this.props.navigation.getParam('name')) {

            this.setState({
                name: this.props.navigation.getParam('name')
            });
        }

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        Animated.timing(this._animatedServiceNameIsFocused, {
            toValue: (this.state.isServiceNameFocused || this.state.serviceName !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedServiceDurationIsFocused, {
            toValue: (this.state.isServiceDurationFocused || this.state.serviceDuration !== '') ? 1 : 0,
            duration: 200,
        }).start();
        Animated.timing(this._animatedServicePriceIsFocused, {
            toValue: (this.state.isServicePriceFocused || this.state.servicePrice !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }

    componentWillMount() {
        this._animatedServiceNameIsFocused = new Animated.Value(0);
        this._animatedServiceDurationIsFocused = new Animated.Value(0);
        this._animatedServicePriceIsFocused = new Animated.Value(0);
        if (this.props.navigation.getParam('name', "")) {
            this.setState({
                name: this.props.navigation.getParam('name', "")
            });
        }
        else {
            this.props.navigation.setParams({ name: this.state.name });
        }

        if (this.props.navigation.getParam('serviceDuration', "")) {
            this.setState({
                serviceDuration: this.props.navigation.getParam('serviceDuration', "")
            });
        }
        else {
            this.props.navigation.setParams({ serviceDuration: this.state.serviceDuration });
        }

        if (this.props.navigation.getParam('servicePrice', "")) {
            this.setState({
                servicePrice: this.props.navigation.getParam('servicePrice', "")
            });
        }
        else {
            this.props.navigation.setParams({ servicePrice: this.state.servicePrice });
        }

        if (this.props.navigation.getParam('serviceColor', "")) {
            this.setState({
                serviceColor: this.props.navigation.getParam('serviceColor', "")
            });
        }
        else {
            this.props.navigation.setParams({ serviceColor: this.state.serviceColor });
        }
    }
    render() {
        const serviceNameLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedServiceNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedServiceNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedServiceNameIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };
        const serviceDurationLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedServiceDurationIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedServiceDurationIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedServiceDurationIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };

        const servicePriceLabelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedServicePriceIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: this._animatedServicePriceIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            color: this._animatedServicePriceIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0.38)', '#000'],
            }),
        };


        return (
            <View
                style={[styles.serviceContent]}>
                <View style={{ height: 35, marginTop: 10 }}>
                    <View style={styles.inputContainer}>
                        <Animated.Text style={serviceNameLabelStyle}>
                            Service Name
                        </Animated.Text>
                        <TextInput value={this.state.name}
                            style={[styles.textInput1, (this.state.isServiceNameFocused) ? {
                                borderBottomColor: '#287F7E',
                            } : { borderBottomColor: '#888888' }]}
                            onFocus={() => this.onFocusChange("isServiceNameFocused")}
                            onBlur={() => this.onBlurChange("isServiceNameFocused")}
                            onChangeText={(text) => this.onChangeHandle("name", text)}
                        />
                    </View>
                </View>
                <View style={{ height: 35, marginTop: 20 }}>
                    <View style={[styles.rowStyle1, { width: '100%' }]}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Animated.Text style={serviceDurationLabelStyle}>
                                Duration
                            </Animated.Text>
                            <TextInput
                                style={[styles.textInput1, (this.state.isServiceDurationFocused) ? {
                                    borderBottomColor: '#287F7E',
                                } : { borderBottomColor: '#888888' }]}
                                onFocus={() => this.onFocusChange("isServiceDurationFocused")}
                                onBlur={() => this.onBlurChange("isServiceDurationFocused")}
                                onChangeText={(text) => this.onChangeHandle("serviceDuration", text)}
                                keyboardType={"numeric"}
                            />
                        </View>
                        <View style={{ flex: 0, width: 10 }}>
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Animated.Text style={servicePriceLabelStyle}>
                                Price
                            </Animated.Text>
                            <TextInput
                                style={[styles.textInput1, (this.state.isServicePriceFocused) ? {
                                    borderBottomColor: '#287F7E',
                                } : { borderBottomColor: '#888888' }]}
                                onFocus={() => this.onFocusChange("isServicePriceFocused")}
                                onBlur={() => this.onBlurChange("isServicePriceFocused")}
                                onChangeText={(text) => this.onChangeHandle("servicePrice", text)}
                                keyboardType={"numeric"}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ height: 150, marginTop: 20 }}>
                    <ColorPalette
                        onChange={color => this.onChangeHandle("serviceColor", color)}
                        defaultColor={this.state.serviceColor}
                        colors={this.state.colors}
                        title={""}
                        icon={
                            <Icon name={"check"} type={"solid"} size={19} color={"#fff"} />
                        }
                    />
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
    serviceContent: {
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    inputContainer: {
        paddingTop: 16
    },
    textInput1: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16,
        height: 30
    },
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
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
