import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Root } from "native-base";
import AppNavigator from './navigation/AppNavigator';
import { configureFontAwesomePro } from "react-native-fontawesome-pro";
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import store from './store/index';
import { ChannelConnection } from "./channel";
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'


const newStore = store;

configureFontAwesomePro("light");

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
    };
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        obj = new ChannelConnection();
        obj.connect()
    }
    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <MenuProvider>
                    <Root>
                        <View style={styles.container}>
                            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                            <Provider store={newStore}>
                                <AppNavigator />
                            </Provider>
                        </View>
                    </Root>
                </MenuProvider>
            );
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/robot-dev.png'),
                require('./assets/images/robot-prod.png'),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app
                'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
                'open-sans-hebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
                'open-sans-hebrew-bold': require('./assets/fonts/OpenSansHebrew-Bold.ttf'),
                'open-sans-hebrew-light': require('./assets/fonts/OpenSansHebrew-Light.ttf'),
                'open-sans-hebrew-italic': require('./assets/fonts/OpenSansHebrew-Italic.ttf'),
            }),
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
