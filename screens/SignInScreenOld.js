import React from 'react';
import { Image, NetInfo, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Content, StyleProvider } from 'native-base';
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import { SocialIcon } from 'react-native-elements'

export default class SignInScreenOld extends React.Component {

    state = {
        isConnected: false,
    }
    static navigationOptions = {
        header: null,
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


    render() {
        return (
            <View>
                <ScrollView contentContainerStyle={styles.container}>
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Qfit.me</Text>
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Phone number"
                                onChangeText={(text) => this.setState({ text })}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Password"
                                onChangeText={(text) => this.setState({ text })}
                            />
                        </View>
                        {/*<View style={styles.row}>
                        <Button block>
                            <Text>Sign in</Text>
                        </Button>
                    </View>*/}
                        <StyleProvider style={getTheme(material)}>
                            <Content>
                                <Button block success>
                                    <Text style={{ color: '#fff' }}>Sign in</Text>
                                </Button>
                            </Content>
                        </StyleProvider>
                        <View style={styles.row}>
                            <Text style={{ color: '#555555' }}>Forgot your login details? </Text>
                            <Text style={{ color: '#287F7E' }}>Get help sign in</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.hairline} />
                            <Text style={styles.loginButtonBelowText1}>OR</Text>
                            <View style={styles.hairline} />
                        </View>
                        <View>
                            <SocialIcon
                                title='Continue with Facebook'
                                button
                                type='facebook'
                                style={{ borderRadius: 5 }}
                            />
                        </View>
                        <View>
                            <SocialIcon
                                title='Continue with Google'
                                button
                                light
                                type='google'
                                style={{ borderRadius: 5, backgroundColor: '#E7E7E7' }}
                            />
                        </View>
                        <View>
                            <Image source={require('./../assets/images/LineArt.png')}></Image>
                        </View>
                    </View>

                </ScrollView>
                {this.state.isConnected ? null :
                    <View style={styles.NetworkContainter}>
                        <Text style={styles.NetworkMessage}>No Internet Connection</Text>
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
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
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontSize: 24
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
