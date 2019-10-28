import React, { Component } from 'react';
import Icon from "react-native-fontawesome-pro";
import { SearchBar } from 'react-native-elements';
import { Image, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View, AsyncStorage, Button } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createNewCustomer } from '../actions/CreateCustomerAction';
import { deleteSingleCustomer } from '../actions/DeleteCustomerAction';
import { defaultnullCustomer } from '../actions/CreateCustomerAction';
import { configureChannel } from '../socketConnection';
import SnackBarComponent from '../components/Snackbar';

class SelectCustomerScreen extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        customers: {},
        searchBarCustomer: "",
        businessName: '',
        isConnected: false,
    };


    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Customers',
            headerTitleStyle: {
                fontFamily: 'open-sans-hebrew',
                fontSize: 17,
                width: '100%',
                color: '#555555'
            },
            headerStyle: {
                elevation: 5,
                shadowColor: 'black',
                shadowOffset: { height: -5 },
                shadowOpacity: 0.16,
                shadowRadius: 5,
            },
            headerRight: <View style={{ marginRight: 22, padding: 5 }}>
                <Icon name="ellipsis-v"
                    type={"regular"}
                    size={20}
                    color={"#888888"} marginLeft={22} style={{ padding: 30 }} />
            </View>,
            headerLeft: <View style={{
                flex: 1,
                width: '100%',
                marginLeft: 20,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}><Icon name="bars" type={"solid"} size={20} style={{ padding: 30 }} color={"#888888"}
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /></View>,


        }
    };

    async getData() {
        var access_token = await AsyncStorage.multiGet(['access_token']);
        return access_token;
    };
    onAddCustomer = (name, phone) => {
        let data = {
            nickname: name,
            phone: phone
        }
        console.log("business name on addd", this.state.businessName)
        this.setState({ searchBarCustomer: "" })
        this.props.createNewCustomer(this.state.businessName, data)


    };

    DisplaySnackBar = (snackMessage) => {
        this.refs.ReactNativeSnackBar.ShowSnackBarFunction(snackMessage);
    };

    onChangeCustomer = (text) => {
        let filteredCustomerData = Object.values(this.state.customers).map(customer => {
            let regExp = new RegExp(text, 'gi');
            if (customer.user.first_name === null) {
                if (regExp.test(customer.nickname)) {
                    customer.isVisible = true;
                } else {
                    customer.isVisible = false;
                }
            } else {
                if (regExp.test(customer.user.first_name)) {
                    customer.isVisible = true;
                } else {
                    customer.isVisible = false;
                }
            }
            return customer;
        }
        );
        this.setState({ customers: filteredCustomerData, searchBarCustomer: text });
    };

    deleteCustId = (customer_user_id) => {
        this.props.deleteSingleCustomer(this.state.businessName, customer_user_id)
    }


    async componentDidMount() {

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );

        const businessName = await AsyncStorage.getItem('businessName');
        console.log("customer listing", businessName)
        Object.values(this.props.customers).map(customer => {
            customer.isVisible = true
        })
        var sorted1 = Object.values(this.props.customers).sort(function (a, b) {
            var textA = (a.user.first_name != null ? a.user.first_name.toUpperCase() : a.nickname.toUpperCase());
            var textB = (b.user.first_name != null ? b.user.first_name.toUpperCase() : b.nickname.toUpperCase());
            // var textA = a.nickname.toUpperCase();
            // var textB = b.nickname.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.setState({
            customers: sorted1,
            businessName: businessName
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

    async componentWillReceiveProps(nextProps) {

        const businessName = await AsyncStorage.getItem('businessName');
        console.log("customer listing 123", this.state.businessName)
        Object.values(nextProps.customers).map(customer => {
            customer.isVisible = true;
        })

        var sorted1 = Object.values(nextProps.customers).sort(function (a, b) {
            var textA = (a.user.first_name != null ? a.user.first_name.toUpperCase() : a.nickname.toUpperCase());
            var textB = (b.user.first_name != null ? b.user.first_name.toUpperCase() : b.nickname.toUpperCase());
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.setState({
            customers: sorted1,
            businessName: businessName,

        })

        //******SNACKBAR********

        if (nextProps.pendingCustomer === false) {
            this.DisplaySnackBar("Customer Added Successfully")
        }
        if (nextProps.pendingCustomer === true) {
            this.DisplaySnackBar("Customer Added Successfully")
        }
        else if (nextProps.deleteCError === false) {
            this.DisplaySnackBar("Customer Deleted Successfully")
        }
        else if (nextProps.createCError === true) {
            this.DisplaySnackBar("Invalid Customer Phone Number")
        }
        // else if (nextProps.pendingCustomer === true) {
        //     this.DisplaySnackBar("Customer Creation Pending")
        // }

        this.props.defaultnullCustomer();

    }

    Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    render() {

        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={[styles.searchStyle]}>
                    <SearchBar
                        placeholder="Search customer"
                        placeholderTextColor="rgba(85, 85, 85, 0.5)"
                        containerStyle={{
                            backgroundColor: '#FFFFFF',
                            shadowColor: "rgba(0, 0, 0, 0.16)",
                            shadowOffset: { width: 3, height: -5 },
                            shadowOpacity: 0.16,
                            shadowRadius: 6,
                            elevation: 6,
                            borderBottomColor: 'transparent',
                            borderTopColor: 'transparent',
                            borderBottomWidth: 0,
                            borderTopWidth: 0,
                            borderRadius: 19 / 3
                        }}
                        inputStyle={{ backgroundColor: '#FFFFFF' }}
                        inputContainerStyle={{ backgroundColor: '#FFFFFF' }}
                        lightTheme={true}
                        searchIcon={<Icon name="search" color="#888888" size={19} />}
                        clearIcon={false}
                        style={{ backgroundColor: 'white' }}
                        onChangeText={(text) => this.onChangeCustomer(text)}
                        value={this.state.searchBarCustomer}
                        leftIconContainerStyle={{ backgroundColor: '#FFFFFF' }}
                        rightIconContainerStyle={{ backgroundColor: '#FFFFFF' }} />
                </View>
                <ScrollView contentInset={{ top: 0, left: 0, bottom: 0, right: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <View style={{ minHeight: 80 }}>
                            <TouchableOpacity style={[styles.rowStyle1, {
                                width: '100%',
                                minHeight: 40,
                            }]} onPress={() => this.props.navigation.navigate('NewCustomer', {
                                addCustomerCallback: this.onAddCustomer,
                                customers: this.state.customers, name: this.state.searchBarCustomer
                            })}
                            >
                                <View style={{ flex: 2 }} />
                                <View style={[styles.mainIconContainer]}>
                                    <Icon name={"plus"} type={"solid"} size={20} color={"#287F7E"} />
                                </View>
                                <View style={[styles.centerTextContainer, { paddingLeft: 10 }]}>
                                    {this.state.searchBarCustomer ?
                                        <Text style={styles.textStyle4}>Add new customer '{this.state.searchBarCustomer}'
                                        </Text> : <Text style={styles.textStyle4}>Add new customer
                                        </Text>}

                                </View>

                            </TouchableOpacity>

                            <View style={{ paddingBottom: 20 }}>
                                {Object.values(this.state.customers).length == 0 ?
                                    <Text style={[styles.centerTextContainer,
                                    {
                                        paddingLeft: 80,
                                        fontFamily: 'open-sans-hebrew',
                                        color: "#888888",
                                        fontSize: 16,
                                        paddingTop: 20
                                    }
                                    ]}>No Customer Available</Text>
                                    :
                                    Object.values(this.state.customers).filter(s => s.isVisible).map((customer, index, element) => (
                                        <TouchableOpacity key={customer.user.phone} style={[{
                                            width: '100%',
                                            marginBottom: 16
                                        }, index === 0 || element[index - 1].nickname.substring(0, 1) !== element[index].nickname.substring(0, 1) ? { marginTop: 30 } : {}
                                        ]}
                                            onPress={() => this.props.navigation.navigate('CustomerProfile',
                                                { customer: customer, deleteCustIdCallback: this.deleteCustId })}
                                        >
                                            <View key={customer.nickname}
                                                style={[styles.rowStyle2, {
                                                    width: '100%',
                                                    height: 40,
                                                }]}
                                            >
                                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', }}>
                                                    {index === 0 ? (
                                                        element[0].user.first_name !== null ?
                                                            <Text style={[styles.letterStyle]}>{element[0].user.first_name.substring(0, 1).toUpperCase()}</Text> :
                                                            <Text style={[styles.letterStyle]}>{element[0].nickname.substring(0, 1).toUpperCase()}</Text>
                                                    ) : (
                                                            element[index - 1].user.first_name !== null && element[index].user.first_name !== null ? (
                                                                element[index - 1].user.first_name.substring(0, 1).toUpperCase() !== element[index].user.first_name.substring(0, 1).toUpperCase() ?
                                                                    <Text style={[styles.letterStyle]}>{element[index].user.first_name.substring(0, 1).toUpperCase()}</Text> : null
                                                            ) : (
                                                                    element[index - 1].nickname.substring(0, 1).toUpperCase() !== element[index].nickname.substring(0, 1).toUpperCase() ?
                                                                        <Text style={[styles.letterStyle]}>{element[index].nickname.substring(0, 1).toUpperCase()}</Text> : null
                                                                )
                                                        )}

                                                </View>
                                                <View
                                                    style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', }]}>
                                                    <View style={[styles.circle, { backgroundColor: 'rgba(150, 0, 0, 0.26)' }]}><View
                                                        style={{
                                                            flex: 1, justifyContent: 'center', alignItems: 'center',
                                                        }}>
                                                        {(customer.user.image_id !== null ?
                                                            <Image source={{ uri: customer.user.image_id }}
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: 40 / 2
                                                                }}
                                                                resizeMode={"cover"} /> :
                                                            <Text style={{
                                                                fontFamily: 'open-sans-hebrew',
                                                                fontSize: 23,
                                                                color: 'rgba(255,255,255,0.87)'
                                                            }}>{customer.user.first_name === null ? customer.nickname.substring(0, 1).toUpperCase() : customer.user.first_name.substring(0, 1).toUpperCase()}</Text>)}

                                                    </View></View>
                                                </View>

                                                <View style={styles.centerTextContainer}>
                                                    <Text
                                                        style={[styles.textStyle2, { paddingLeft: 7 }]}>{customer.user.first_name === null ? this.Capitalize(customer.nickname) : (this.Capitalize(customer.user.first_name) + " " + this.Capitalize(customer.user.last_name))}</Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>

                                    ))}
                            </View>

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
                    </View>
                }

            </View >
        )
    }
}


const mapStateToProps = (state) => (
    {

        customers: state.getBusinessByAliases.customers,
        deleteCTransactionId: state.DeleteCustomerReducer,
        pendingCustomer: state.getBusinessByAliases.pendingCustomer,
        createCError: state.getBusinessByAliases.createCError,
        deleteCError: state.getBusinessByAliases.deleteCError,
        defaultnullCustomer: state.getBusinessByAliases.defaultnullCustomer
    });


const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createNewCustomer, deleteSingleCustomer, defaultnullCustomer
    }, dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(SelectCustomerScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scene: {
        flex: 1,
    },
    tabBarStyle: {
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { height: -5 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
    },
    rowStyle1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    mainIconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 21
    },
    centerTextContainer: { flex: 7, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 5 },
    textStyle4: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#287F7E' },
    searchStyle: {
        paddingTop: 20,
        paddingLeft: 11,
        paddingRight: 11
    },

    rowStyle2: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    textStyle1: { fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' },

    textStyle2: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: 'rgba(0,0,0,0.87)' },
    textStyle3: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 14,
        color: 'rgba(0,0,0,0.54)'
    },

    textInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew',
        fontSize: 25,
        height: 45,
        paddingLeft: 60.77,
        paddingBottom: 20,

    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#287F7E'
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: 'open-sans-hebrew',
        color: '#000000',
        paddingBottom: 5,

    },
    contentSubTitle: {
        fontSize: 14,
        fontFamily: 'open-sans-hebrew',
        color: 'rgba(0,0,0,0.50)'
    },
    titleStyle: {
        color: '#287F7E',
        fontSize: 14,
        fontFamily: 'open-sans-hebrew-bold'
    },
    letterStyle: {
        fontFamily: 'open-sans-hebrew',
        fontSize: 24,
        color: '#287F7E',
        textTransform: 'uppercase'
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
