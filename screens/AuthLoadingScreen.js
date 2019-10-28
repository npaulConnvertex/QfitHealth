import React from 'react';
import {AsyncStorage, Dimensions, Image, StyleSheet, View,} from 'react-native';
import {findUserByPhone} from "../axios/api";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const [access_token, refresh_token, session] = await AsyncStorage.multiGet(['access_token', 'refresh_token', 'session']);
        let guest = true;
        if (session[1] && JSON.parse(session[1]) !== null) {
            guest = JSON.parse(session[1]).is_guest;
        }
        if (!guest) {
            const phone = JSON.parse(session[1]).phone;
            findUserByPhone(phone)
                .then(res => {
                    setTimeout(() => {
                        this.props.navigation.navigate('Main');
                    }, 1000);
                })
                .catch(err => {
                    setTimeout(() => {
                        this.props.navigation.navigate('Auth');
                    }, 1000);
                });
        } else {
            setTimeout(() => {
                this.props.navigation.navigate('Auth');
            }, 1000);
        }

        /*
        * @TODO
        *   Check if access token is still valid
        * */
    };

    render() {
        return (
            <View style={styles.container}>
                {/*<ActivityIndicator />
                <StatusBar barStyle="default" />*/}
                <Image resizeMode={"contain"} style={{width: Dimensions.get('window').width - 40}}
                       source={require('./../assets/images/logo.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#287F7E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#fff'
    }
});
