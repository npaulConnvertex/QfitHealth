import React from 'react';
import {View} from 'react-native';

export default class AddButtonsScreen extends React.Component {
    static navigationOptions = ({navigation, defaultHandler}) => {
        return {
            tabBarOnPress: ({navigation, defaultHandler}) => {
                navigation.navigate('Calendar', {blur: true});
            }
        };
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'transparent', opacity: 1}}/>
        )
    }
}
