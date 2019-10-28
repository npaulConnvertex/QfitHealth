import React, { Component } from 'react';
import Icon from "react-native-fontawesome-pro";
import { Button as EleButton } from 'react-native-elements';
import { ScrollView, NetInfo, StyleSheet, Text, AsyncStorage, TextInput, TouchableOpacity, View } from 'react-native';
import Layout from './../constants/Layout';
import { getBusiness, createServices } from "../axios/api";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { createNewService, defaultnullService } from "../actions/CreateServiceAction";
import SnackBarComponent from '../components/Snackbar';


class SelectServiceScreen extends Component {

    state = {
        isConnected: false,
        services: {},
        isServiceNameFocused: false,
        textBar: "",
        businessName: '',
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 20,
                width: '100%',
                color: '#555555'
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
        }
    };

    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        const businessName = await AsyncStorage.getItem('businessName');
        Object.values(this.props.services).map((ser) => {
            ser.isVisible = true
        });
        this.setState({
            businessName: businessName,
            services: this.props.services,

        })
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

    DisplaySnackBar = (snackMessage) => {
        this.refs.ReactNativeSnackBar.ShowSnackBarFunction(snackMessage);
    };

    componentWillReceiveProps(nextProps) {
        Object.values(nextProps.services).map((ser) => {
            ser.isVisible = true
        });
        this.setState({

            services: nextProps.services,

        })
        if (nextProps.createSError === true) {
            this.DisplaySnackBar("Error While Creating Service")
        }
        else if (nextProps.pendingService === false) {
            this.DisplaySnackBar("Service Added Successfully")
        }
        // else if (nextProps.pendingService === true) {
        //     this.DisplaySnackBar("Service Creation Pending")
        // }
        this.props.defaultnullService();
    }

    onChangeHandle = (field, value) => {
        this.setState({
            [field]: value
        });
    };
    onFocusChange = (field) => {
        this.setState({ [field]: true });
    };

    onBlurChange = (field) => {
        this.setState({ [field]: false });
    };


    onAddService = (name, serviceColor, serviceDuration, servicePrice) => {
        let data = {
            name: name,
            color: serviceColor,
            duration: serviceDuration,
            price: servicePrice,
        };
        this.setState({ textBar: '' })
        this.props.createNewService(this.state.businessName, data)

    }

    Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    render() {
        const topRowHeight = Layout.isSmallDevice ? 85 : 100;
        const { services } = this.state;
        console.log("SERVICESSSSSSSS", Object.values(this.state.services).length)

        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ height: topRowHeight, flex: 0 }}>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingTop: Layout.isSmallDevice ? 35 : 50,
                            paddingBottom: 2,
                            paddingLeft: 19.7,
                        }}>
                            <EleButton title={""}
                                buttonStyle={{
                                    backgroundColor: "#E8E8E8",
                                    width: 16,
                                    height: 16,
                                    borderRadius: 16 / 3
                                }} />
                        </View>
                        <TextInput
                            style={[styles.textInput, (this.state.isServiceNameFocused) ? {
                                borderBottomColor: '#287F7E',
                            } : { borderBottomColor: '#CCCCCC' }]}
                            placeholder={"Select Service"}
                            value={this.state.textBar}
                            onFocus={() => this.onFocusChange("isServiceNameFocused")}
                            onBlur={() => this.onBlurChange("isServiceNameFocused")}
                            onChangeText={(text) => {
                                let filteredData = Object.values(services).map(service => {
                                    let regExp = new RegExp(text, 'gi');
                                    if (regExp.test(service.name)) {
                                        service.isVisible = true;
                                    } else {
                                        service.isVisible = false;
                                    }
                                    return service;
                                }
                                );
                                this.setState({ services: filteredData, textBar: text });
                            }} />
                    </View>
                </View>

                <ScrollView contentInset={{ top: 0, left: 0, bottom: 0, right: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <View style={{ paddingBottom: 30 }}>
                            {Object.values(services).length == 0 ?
                                <Text style={[styles.centerTextContainer,
                                {
                                    paddingLeft: 80,
                                    fontFamily: 'open-sans-hebrew',
                                    color: "#888888",
                                    fontSize: 16,
                                    paddingTop: 20
                                }
                                ]}>No Service Available</Text>
                                : Object.values(services).filter(s => s.isVisible).map(service => (
                                    <TouchableOpacity key={service.id} style={{ width: '100%' }}
                                        onPress={() => this.props.navigation.navigate('TimeSuggestions',
                                            {
                                                name: service.name,
                                                service_id_props: service.id,
                                                color: service.settings.color,
                                                duration: service.settings.duration
                                                //time: this.props.navigation.getParam('name', null)
                                            })}>
                                        <View style={[styles.rowStyle2, {
                                            width: '100%',
                                            height: 88,
                                            paddingTop: 40
                                        }]}>
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingLeft: 5
                                            }}>
                                                <EleButton title={""}
                                                    buttonStyle={{
                                                        backgroundColor: service.settings.color,
                                                        //backgroundColor: "blue",
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: 18 / 3
                                                    }} />
                                            </View>

                                            <View style={styles.centerTextContainer}>
                                                <Text style={styles.textStyle2}>{this.Capitalize(service.name)}</Text>
                                                <Text

                                                    style={[styles.textStyle3, { marginTop: 2 }]}>{service.settings != null ? service.settings.duration : ""} minutes,
                                                      {service.settings != null ? service.settings.price : ""}₪</Text>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                ))}

                            <TouchableOpacity style={[styles.rowStyle1, {
                                width: '100%',
                                minHeight: 30,
                                paddingTop: 50
                            }]} onPress={() => this.props.navigation.navigate('NewService', {
                                addServiceCallback: this.onAddService,
                                services: this.state.services, name: this.state.textBar
                            })}
                            >
                                <View style={[styles.mainIconContainer]}>
                                    <Icon name={"plus"} type={"solid"} size={19} color={"#287F7E"} />
                                </View>
                                <View style={styles.centerTextContainer}>
                                    {this.state.textBar ? <Text style={styles.textStyle4}>Add Service '{this.state.textBar}'
                                    </Text> : <Text style={styles.textStyle4}>Add Service </Text>}
                                </View>


                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                    <SnackBarComponent ref="ReactNativeSnackBar" />
                </View>

                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}

            </View>
        )
    }
}

const mapStateToProps = (state) => ({

    services: state.getBusinessByAliases.services,
    pendingService: state.getBusinessByAliases.pendingService,
    createSError: state.getBusinessByAliases.createSError,
    defaultnullService: state.getBusinessByAliases.defaultnullService
});
const mapDispatchToProps = (dispatch) => (

    bindActionCreators({ createNewService, defaultnullService }, dispatch)

)
export default connect(mapStateToProps, mapDispatchToProps)(SelectServiceScreen)


const styles = StyleSheet.create({
    rowStyle1: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    rowStyle2: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    textStyle1: { fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' },
    textStyle4: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#287F7E' },
    textStyle2: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: 'rgba(0,0,0,0.87)' },
    textStyle3: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    },
    centerTextContainer: { flex: 6, justifyContent: 'center', paddingLeft: 15 },
    endIconContainer: { flex: 1, justifyContent: 'center' },
    mainIconContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 6.3 },
    textInput: {
        width: '100%',
        borderBottomWidth: 2,
        //borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew',
        fontSize: 25,
        height: 55,
        paddingLeft: 60.77,
        paddingBottom: 20,
        marginTop: -30

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
